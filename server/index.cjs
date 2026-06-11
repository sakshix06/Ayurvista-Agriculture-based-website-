// load env first
require("dotenv").config({ path: "./server/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OpenAI } = require("openai");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_ayurvista";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "../dist")));

// (Fallback route moved to the bottom of this file)

// connect mongo
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    try {
      const count = await Plant.countDocuments();
      if (count === 0) {
        console.log("🌱 Database is empty. Seeding herbs...");
        const herbsList = require("./data/herbsData.cjs");
        await Plant.insertMany(herbsList);
        console.log(`✅ Successfully seeded ${herbsList.length} herbs into MongoDB!`);
      } else {
        console.log(`ℹ️ MongoDB already has ${count} plants. Seeding skipped.`);
      }
    } catch (err) {
      console.error("❌ Seeding plants failed:", err);
    }
  })
  .catch(err => console.log(err));

// START SERVER (ONLY ONE TIME)
// const PORT = process.env.PORT || 10000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// Bookmark Schema
const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plantId: { type: Number, required: true },
    plantName: { type: String, required: true },
    plantImage: { type: String, required: true },
    plantDescription: { type: String },
    bookmarkedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, plantId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// Plant Schema for storing plant data
const plantSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    scientificName: { type: String },
    image: { type: String, required: true },
    tourVideo: { type: String },
    description: { type: String },
    category: { type: String, default: 'medicinal' },
    benefitsTags: [String],
    fullBenefits: [String],
    detailedUses: [String],
    precautions: [String],
    relatedHerbs: [String],
    symptoms: [String],
    goals: [String],
    // keep legacy fields just in case
    benefits: [String],
    uses: [String],
    careInstructions: {
      water: String,
      light: String,
      temperature: String,
      soil: String
    },
    medicinalProperties: [String]
  },
  { timestamps: true }
);

const Plant = mongoose.model('Plant', plantSchema);

// In-memory storage for development (fallback when MongoDB is not available)
const inMemoryStorage = {
  users: new Map(),
  bookmarks: new Map(),
  plants: new Map(),
  nextUserId: 1,
  nextBookmarkId: 1
};

// Helper function to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing name, email or password' });
    }
    
    if (isMongoConnected()) {
      // Use MongoDB
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      
      const token = jwt.sign(
        { sub: user._id.toString(), email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      // Attempt to send welcome email in the background without blocking the response
      import("./services/mailService.js").then((mailService) => {
        mailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
          console.error("Failed to send welcome email:", err);
        });
      }).catch((err) => console.error("Failed to load mail service:", err));
      
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
      // Use in-memory storage
      if (inMemoryStorage.users.has(email)) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = inMemoryStorage.nextUserId++;
      const user = { id: userId, name, email, passwordHash };
      
      inMemoryStorage.users.set(email, user);
      
      const token = jwt.sign(
        { sub: userId.toString(), email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      // Attempt to send welcome email in the background
      import("./services/mailService.js").then((mailService) => {
        mailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
          console.error("Failed to send welcome email:", err);
        });
      }).catch((err) => console.error("Failed to load mail service:", err));
      
      return res.json({ token, user: { id: userId, name: user.name, email: user.email } });
    }
  } catch (err) {
    console.error('Register Error details:', err);
    return res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }
    
    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials (User not found)' });
      }

      // Check which password field exists (legacy support)
      const userPassword = user.passwordHash || user.password;
      
      if (!userPassword) {
        console.error(`Login error: User ${email} has no password field in database.`);
        return res.status(401).json({ message: 'Invalid credentials (Account error)' });
      }

      const ok = await bcrypt.compare(password, userPassword);
      if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials (Wrong password)' });
      }

      const token = jwt.sign(
        { sub: user._id.toString(), email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
      // Use in-memory storage
      const user = inMemoryStorage.users.get(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userPassword = user.passwordHash || user.password;
      if (!userPassword) {
         return res.status(401).json({ message: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(password, userPassword);
      if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { sub: user.id.toString(), email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
  } catch (err) {
    console.error('Login Error details:', err);
    return res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Import and use new Auth routes for Google and Forgot Password
const authRoutes = require("./routes/authRoutes.js").default;
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Bookmark endpoints
app.post('/api/bookmarks', verifyToken, async (req, res) => {
  try {
    const { plantId, plantName, plantImage, plantDescription } = req.body;
    if (!plantId || !plantName || !plantImage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (isMongoConnected()) {
      // Use MongoDB
      const bookmark = await Bookmark.create({
        userId: req.userId,
        plantId,
        plantName,
        plantImage,
        plantDescription
      });
      res.json({ success: true, bookmark });
    } else {
      // Use in-memory storage
      const bookmarkKey = `${req.userId}-${plantId}`;
      if (inMemoryStorage.bookmarks.has(bookmarkKey)) {
        return res.status(409).json({ message: 'Plant already bookmarked' });
      }
      const bookmark = {
        id: inMemoryStorage.nextBookmarkId++,
        userId: req.userId,
        plantId,
        plantName,
        plantImage,
        plantDescription,
        bookmarkedAt: new Date()
      };
      inMemoryStorage.bookmarks.set(bookmarkKey, bookmark);
      res.json({ success: true, bookmark });
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Plant already bookmarked' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookmarks', verifyToken, async (req, res) => {
  try {
    if (isMongoConnected()) {
      // Use MongoDB
      const bookmarks = await Bookmark.find({ userId: req.userId })
        .sort({ bookmarkedAt: -1 });
      res.json({ bookmarks });
    } else {
      // Use in-memory storage
      const bookmarks = Array.from(inMemoryStorage.bookmarks.values())
        .filter(bookmark => bookmark.userId == req.userId)
        .sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt));
      res.json({ bookmarks });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/bookmarks/:plantId', verifyToken, async (req, res) => {
  try {
    const { plantId } = req.params;
    
    if (isMongoConnected()) {
      // Use MongoDB
      const result = await Bookmark.findOneAndDelete({ 
        userId: req.userId, 
        plantId: parseInt(plantId) 
      });
      
      if (!result) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }
      
      res.json({ success: true, message: 'Bookmark removed' });
    } else {
      // Use in-memory storage
      const bookmarkKey = `${req.userId}-${plantId}`;
      if (!inMemoryStorage.bookmarks.has(bookmarkKey)) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }
      inMemoryStorage.bookmarks.delete(bookmarkKey);
      res.json({ success: true, message: 'Bookmark removed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize in-memory plant data
const initializePlantData = () => {
  try {
    const plantsData = require("./data/herbsData.cjs");
    plantsData.forEach(plant => {
      inMemoryStorage.plants.set(plant.id, plant);
    });
  } catch (err) {
    console.error("Failed to load in-memory plant data:", err);
  }
};

// Initialize plant data
initializePlantData();

// Search and Recommend Herbs (Paginated & AI Insight)
app.get('/api/plants/search', async (req, res) => {
  try {
    const { query, chip, symptom, ageGroup, goal, page = 1, limit = 4 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const pageSize = parseInt(limit);

    let dbQuery = {};
    let isFallback = false;

    // 1. Handle Quick Filter Chip
    if (chip && chip !== 'View All') {
      const chipRegex = new RegExp(chip, 'i');
      dbQuery = {
        $or: [
          { category: chipRegex },
          { benefitsTags: chipRegex },
          { goals: chipRegex }
        ]
      };
      
      // Special mappings for quick filters
      if (chip.toLowerCase() === 'hair fall') {
        dbQuery.$or.push({ benefitsTags: /hair care/i });
        dbQuery.$or.push({ category: /haircare/i });
      }
      if (chip.toLowerCase() === 'skin care') {
        dbQuery.$or.push({ benefitsTags: /skin care/i });
        dbQuery.$or.push({ category: /skincare/i });
      }
      if (chip.toLowerCase() === 'digestion') {
        dbQuery.$or.push({ benefitsTags: /digestion/i });
        dbQuery.$or.push({ category: /digestive/i });
      }
    }
    // 2. Handle Remedy Finder Form
    else if (symptom || goal) {
      let conditions = [];
      if (goal) {
        const goalWord = goal.split(" ")[0];
        conditions.push({ goals: new RegExp(goal, 'i') });
        conditions.push({ goals: new RegExp(goalWord, 'i') });
      }
      if (symptom) {
        const symptomClean = symptom.replace(/-/g, ' ');
        const words = symptomClean.split(/\s+/);
        words.forEach(w => {
          const r = new RegExp(w, 'i');
          conditions.push({ symptoms: r });
          conditions.push({ description: r });
          conditions.push({ benefitsTags: r });
        });
      }
      
      if (symptom) {
        // Match goal OR symptom
        dbQuery = { $or: conditions };
      } else {
        // Match goal
        dbQuery = { $or: conditions.filter(c => c.goals) };
      }
    }
    // 3. Handle Regular Search Query
    else if (query && query.trim() !== '') {
      const term = query.trim();
      const termRegex = new RegExp(term, 'i');
      dbQuery = {
        $or: [
          { name: termRegex },
          { scientificName: termRegex },
          { description: termRegex },
          { benefitsTags: termRegex },
          { fullBenefits: termRegex },
          { detailedUses: termRegex },
          { symptoms: termRegex },
          { goals: termRegex }
        ]
      };
    }

    let plants = [];
    let total = 0;

    if (isMongoConnected()) {
      total = await Plant.countDocuments(dbQuery);
      plants = await Plant.find(dbQuery)
        .sort({ id: 1 })
        .skip(skip)
        .limit(pageSize);

      // If no exact match exists for query/filters, show closest relevant herbal recommendations
      if (plants.length === 0 && (query || chip || symptom || goal)) {
        console.log(`No exact match. Recommending default/fallback herbs.`);
        isFallback = true;
        // Fallback to top wellness herbs (Giloy, Amla, Tulsi, Ashwagandha)
        const fallbackQuery = {
          name: { $in: ["Giloy (Guduchi)", "Amla (Indian Gooseberry)", "Tulsi (Holy Basil)", "Ashwagandha (Indian Ginseng)"] }
        };
        total = await Plant.countDocuments(fallbackQuery);
        plants = await Plant.find(fallbackQuery)
          .sort({ id: 1 })
          .skip(skip)
          .limit(pageSize);
      }
    } else {
      // Use In-Memory storage search
      let allPlants = Array.from(inMemoryStorage.plants.values());
      let matched = allPlants;

      if (chip && chip !== 'View All') {
        matched = allPlants.filter(p => 
          p.category.toLowerCase() === chip.toLowerCase() ||
          p.benefitsTags.some(tag => tag.toLowerCase().includes(chip.toLowerCase())) ||
          p.goals.some(g => g.toLowerCase().includes(chip.toLowerCase()))
        );
      } else if (symptom || goal) {
        matched = allPlants.filter(p => {
          const goalMatch = goal ? p.goals.some(g => g.toLowerCase().includes(goal.toLowerCase().split(" ")[0])) : false;
          const symptomClean = symptom ? symptom.replace(/-/g, ' ').toLowerCase() : '';
          const symptomWords = symptomClean.split(/\s+/);
          const symptomMatch = symptom ? p.symptoms.some(s => symptomWords.some(w => s.toLowerCase().includes(w))) : false;
          return symptom ? (goalMatch || symptomMatch) : goalMatch;
        });
      } else if (query && query.trim() !== '') {
        const term = query.toLowerCase().trim();
        matched = allPlants.filter(p => 
          p.name.toLowerCase().includes(term) ||
          p.scientificName.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.benefitsTags.some(tag => tag.toLowerCase().includes(term)) ||
          p.symptoms.some(s => s.toLowerCase().includes(term)) ||
          p.goals.some(g => g.toLowerCase().includes(term))
        );
      }

      if (matched.length === 0 && (query || chip || symptom || goal)) {
        isFallback = true;
        matched = allPlants.filter(p => 
          ["Giloy (Guduchi)", "Amla (Indian Gooseberry)", "Tulsi (Holy Basil)", "Ashwagandha (Indian Ginseng)"].includes(p.name)
        );
      }

      total = matched.length;
      plants = matched.slice(skip, skip + pageSize);
    }

    // AI Ayurvedic Insight explaining why herbs were recommended
    let aiInsight = '';
    const apiKey = process.env.GOOGLE_API_KEY;
    const modelInput = query || chip || (goal ? `${goal} for ${ageGroup || 'Adult'}s (concern: ${symptom || 'general'})` : '');
    
    if (modelInput && apiKey && apiKey.trim() !== '') {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        
        const plantNames = plants.map(p => p.name).join(", ");
        const prompt = `You are an Ayurvedic AI assistant. Write a short, highly professional Ayurvedic insight (max 2-3 sentences) explaining why these herbs: [${plantNames}] are recommended for the health concern: "${modelInput}". Keep the tone traditional, reassuring, and medical. Answer in English, unless the concern contains Hindi characters, in which case write in clean Hindi.`;
        
        const result = await model.generateContent(prompt);
        aiInsight = result.response.text().trim();
      } catch (aiError) {
        console.error('AI recommendation insight error:', aiError);
      }
    }

    res.json({
      plants,
      total,
      aiInsight,
      page: parseInt(page),
      limit: pageSize,
      hasMore: skip + plants.length < total,
      isFallback
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error searching plants' });
  }
});

// Plant endpoints
app.get('/api/plants', async (req, res) => {
  try {
    if (isMongoConnected()) {
      // Use MongoDB
      const plants = await Plant.find().sort({ id: 1 });
      res.json({ plants });
    } else {
      // Use in-memory storage
      const plants = Array.from(inMemoryStorage.plants.values()).sort((a, b) => a.id - b.id);
      res.json({ plants });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/plants/:id', async (req, res) => {
  try {
    const plantId = parseInt(req.params.id);
    
    if (isMongoConnected()) {
      // Use MongoDB
      const plant = await Plant.findOne({ id: plantId });
      if (!plant) {
        return res.status(404).json({ message: 'Plant not found' });
      }
      res.json({ plant });
    } else {
      // Use in-memory storage
      const plant = inMemoryStorage.plants.get(plantId);
      if (!plant) {
        return res.status(404).json({ message: 'Plant not found' });
      }
      res.json({ plant });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize plants data if database is empty
app.post('/api/plants/seed', async (req, res) => {
  try {
    const count = await Plant.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Plants already seeded', count });
    }

    const plantsData = require("./data/herbsData.cjs");
    await Plant.insertMany(plantsData);
    res.json({ message: 'Plants seeded successfully', count: plantsData.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to search plants by name (fuzzy matching)
const findPlantByName = async (plantName) => {
  if (!plantName || typeof plantName !== 'string') return null;
  
  const searchTerm = plantName.toLowerCase().trim();
  
  if (isMongoConnected()) {
    // Search in MongoDB - case insensitive
    const plant = await Plant.findOne({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { 'name': { $regex: searchTerm.replace(/\s+/g, '.*'), $options: 'i' } }
      ]
    });
    return plant;
  } else {
    // Search in-memory storage
    for (const plant of inMemoryStorage.plants.values()) {
      if (plant.name.toLowerCase().includes(searchTerm) || 
          searchTerm.includes(plant.name.toLowerCase())) {
        return plant;
      }
    }
  }
  return null;
};

// Helper function to extract plant name and intent from query
const extractPlantInfo = (query) => {
  if (!query || typeof query !== 'string') {
    return { plantName: null, intent: 'general', language: 'en' };
  }

  const text = query.toLowerCase().trim();
  
  // Detect language (simple heuristic - can be improved)
  const hindiPattern = /[\u0900-\u097F]/;
  const language = hindiPattern.test(query) ? 'hi' : 'en';
  
  // Common plant names in English and Hindi with mapping
  const plantNameMap = {
    // Hindi to English mapping
    'तुलसी': 'tulsi',
    'नीम': 'neem',
    'एलोवेरा': 'aloe vera',
    'अश्वगंधा': 'ashwagandha',
    'हल्दी': 'turmeric',
    'अदरक': 'ginger',
    'बांस': 'bamboo',
    'गिलोय': 'giloy',
    'मनी प्लांट': 'money plant',
    'कैक्टस': 'cactus',
    'फर्न': 'fern',
    'मॉन्स्टेरा': 'monstera'
  };
  
  const plantNames = {
    en: ['tulsi', 'holy basil', 'neem', 'aloe vera', 'aloe', 'ashwagandha', 'turmeric', 'ginger', 
         'bamboo', 'giloy', 'money plant', 'cactus', 'fern', 'monstera', 'calathea', 'autumn fern',
         'golden money plant', 'monstera deliciosa'],
    hi: Object.keys(plantNameMap)
  };
  
  // Extract plant name
  let plantName = null;
  
  // First check Hindi names
  for (const hindiName of plantNames.hi) {
    if (query.includes(hindiName)) {
      // Map to English for database search
      plantName = plantNameMap[hindiName] || hindiName;
      break;
    }
  }
  
  // If not found, check English names
  if (!plantName) {
    for (const name of plantNames.en) {
      if (text.includes(name.toLowerCase())) {
        plantName = name;
        break;
      }
    }
  }
  
  // If not found in list, try to extract using patterns
  if (!plantName) {
    // Pattern: "about [plant]", "[plant] ka", "[plant] ke", "tell me about [plant]"
    const patterns = [
      /(?:about|tell me about|what is|what's)\s+([a-z]+(?:\s+[a-z]+)*)/i,
      /([a-z]+(?:\s+[a-z]+)*)\s+(?:ka|ke|ki|ko|about|for|is|are)/i,
      /^([a-z]+(?:\s+[a-z]+)*)\s+(?:good|benefits|use|uses|care|watering|sunlight)/i
    ];
    
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        plantName = match[1].trim();
        break;
      }
    }
  }
  
  // Extract intent
  let intent = 'general';
  const intentKeywords = {
    watering: ['water', 'paani', 'पानी', 'watering', 'kitna paani', 'how much water'],
    sunlight: ['sunlight', 'sun', 'light', 'धूप', 'sunlight chahiye', 'light condition'],
    soil: ['soil', 'मिट्टी', 'soil type', 'potting'],
    benefits: ['benefits', 'benefit', 'फायदे', 'good for', 'uses', 'use', 'ka use', 'ke liye'],
    care: ['care', 'how to grow', 'grow', 'maintain', 'कैसे उगाएं'],
    medicinal: ['medicinal', 'medicine', 'treatment', 'treatment', 'इलाज', 'दवा'],
    description: ['what is', 'tell me about', 'describe', 'क्या है', 'बताओ'],
    temperature: ['temperature', 'temp', 'cold', 'hot', 'तापमान']
  };
  
  for (const [key, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      intent = key;
      break;
    }
  }
  
  return { plantName, intent, language };
};

// Enhanced chat endpoint for plant questions
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Extract plant info and intent
    const { plantName, intent, language: detectedLang } = extractPlantInfo(message);
    const queryLanguage = language || detectedLang || 'en';
    
    console.log('Plant Q&A Request:', { message, plantName, intent, language: queryLanguage });
    
    let reply = '';
    let plantData = null;
    
    // If plant name found, try to get from DB
    if (plantName) {
      plantData = await findPlantByName(plantName);
    }
    
    // If we have plant data, use it
    if (plantData) {
      const plant = plantData.toObject ? plantData.toObject() : plantData;
      
      if (queryLanguage === 'hi') {
        // Hindi response
        switch (intent) {
          case 'watering':
            reply = `${plant.name} को पानी देने के लिए: ${plant.careInstructions?.water || 'मध्यम पानी दें'}`;
            break;
          case 'sunlight':
            reply = `${plant.name} के लिए प्रकाश: ${plant.careInstructions?.light || 'उज्ज्वल, अप्रत्यक्ष प्रकाश'}`;
            break;
          case 'benefits':
            reply = `${plant.name} के फायदे: ${plant.benefits?.join(', ') || 'स्वास्थ्य लाभ'}`;
            break;
          case 'medicinal':
            reply = `${plant.name} की औषधीय गुण: ${plant.medicinalProperties?.join(', ') || 'औषधीय गुण'}`;
            break;
          default:
            reply = `${plant.name} के बारे में: ${plant.description || ''}। फायदे: ${plant.benefits?.join(', ') || 'N/A'}`;
        }
      } else {
        // English response
        switch (intent) {
          case 'watering':
            reply = `For ${plant.name} watering: ${plant.careInstructions?.water || 'Moderate watering'}`;
            break;
          case 'sunlight':
            reply = `Light requirements for ${plant.name}: ${plant.careInstructions?.light || 'Bright, indirect light'}`;
            break;
          case 'benefits':
            reply = `Benefits of ${plant.name}: ${plant.benefits?.join(', ') || 'Health benefits'}`;
            break;
          case 'medicinal':
            reply = `Medicinal properties of ${plant.name}: ${plant.medicinalProperties?.join(', ') || 'Medicinal properties'}`;
            break;
          default:
            reply = `About ${plant.name}: ${plant.description || ''}. Benefits: ${plant.benefits?.join(', ') || 'N/A'}`;
        }
      }
    } else {
      // Use AI to generate answer
      const apiKey = process.env.GOOGLE_API_KEY;
      if (apiKey && apiKey.trim() !== '') {
        try {
          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
          
          const prompt = queryLanguage === 'hi' 
            ? `आप एक पौधा विशेषज्ञ हैं। इस प्रश्न का उत्तर हिंदी में दें: "${message}". संक्षिप्त, सटीक और उपयोगी जवाब दें।`
            : `You are a plant expert. Answer this question: "${message}". Provide a brief, accurate, and helpful answer.`;
          
          const result = await model.generateContent(prompt);
          reply = result.response.text();
        } catch (aiError) {
          console.error('AI generation error:', aiError);
          reply = queryLanguage === 'hi' 
            ? 'क्षमा करें, मैं इस प्रश्न का उत्तर नहीं दे सकता। कृपया पुनः प्रयास करें।'
            : 'Sorry, I could not answer this question. Please try again.';
        }
      } else {
        // Fallback response
        reply = queryLanguage === 'hi'
          ? 'आम जड़ी-बूटियों के बारे में पूछें जैसे तुलसी, नीम, एलोवेरा आदि।'
          : 'Ask about common herbs like tulsi, neem, aloe vera, etc.';
      }
    }
    
    res.json({ 
      reply,
      plantName: plantName || null,
      intent,
      language: queryLanguage,
      fromDatabase: !!plantData
    });
  } catch (e) {
    console.error('Chat error:', e);
    res.status(500).json({ 
      reply: 'Sorry, I encountered an error. Please try again.',
      language: 'en'
    });
  }
});

// === AI endpoints (stubs with optional provider integration) ===

// Speech-to-Text: expects { audioBase64: string, language?: 'hi'|'en' }

// 🔇 Disable server-side transcribe (Browser handles speech)
app.post("/api/ai/transcribe", async (_req, res) => {
  return res.json({
    text: null,
    language: "en",
    confidence: 0
  });
});
// Text-to-Speech: expects { text: string, language?: 'hi'|'en' }
// Responds with { audioBase64: string, mimeType: string }
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text, language } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'text is required' });
    }
    
    const apiKey = process.env.GOOGLE_API_KEY;
    
    // If API key available, try to use Gemini for TTS (though it doesn't support TTS directly)
    // In production, use Google Cloud Text-to-Speech API
    if (apiKey && apiKey.trim() !== '') {
      // Note: Gemini doesn't have TTS, so we'll use a fallback
      // For production, integrate Google Cloud Text-to-Speech API
      console.log('TTS requested - using fallback. For production, use Google Cloud TTS API.');
    }
    
    // Stub: return a short silent WAV to keep client logic simple.
    // 1 second of silence, 16-bit PCM mono, 16kHz.
    const wavHeader = Buffer.from('524946462400000057415645666d74201000000001000100403e000080bb0000020010006461746100000000', 'hex');
    const silence = Buffer.alloc(16000 * 2); // 1s * 16k samples * 2 bytes
    const wav = Buffer.concat([wavHeader, silence]);
    const audioBase64 = wav.toString('base64');
    return res.json({ audioBase64, mimeType: 'audio/wav' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'TTS failed' });
  }
});

// Plant Q&A endpoint (Conversational, Session History, Plant Context Aware)
app.post("/api/ai/plant-qa", async (req, res) => {
  try {
    const { query, history = [], plantName, scientificName, language } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "query is required" });
    }

    const userLang = language === "hi" ? "hi" : "en";

    // Build the system prompt based on whether we have a specific plant context
    let systemPrompt = "";
    if (userLang === "hi") {
      systemPrompt = `आप एक विशेषज्ञ आयुर्वेदिक चिकित्सक और जड़ी-बूटी विशेषज्ञ हैं।
${plantName ? `आप यूज़र से "${plantName}" (${scientificName || ''}) नामक जड़ी-बूटी के बारे में बात कर रहे हैं।` : 'आप यूज़र से आयुर्वेदिक जड़ी-बूटियों के बारे में बात कर रहे हैं।'}
नियम:
- उत्तर केवल हिंदी में दें।
- बातचीत की शैली को संवादात्मक, अत्यंत सहायक और प्रामाणिक रखें।
- आयुर्वेदिक सिद्धांतों, उपयोगों, सावधानियों, खुराक और पारंपरिक महत्व के आधार पर उत्तर दें।
- यदि यूज़र कोई असंबंधित प्रश्न पूछता है, तो उसे विनम्रतापूर्वक जड़ी-बूटी, आयुर्वेद या स्वास्थ्य विषयों पर वापस लाएं।
- उत्तर को संक्षिप्त और व्यावहारिक रखें ताकि पढ़ना आसान हो।`;
    } else {
      systemPrompt = `You are an expert Ayurvedic doctor and herbal specialist.
${plantName ? `You are talking to the user about the herb "${plantName}" (${scientificName || ''}).` : 'You are talking to the user about Ayurvedic herbs and wellness.'}
Rules:
- Reply ONLY in English.
- Keep the style conversational, warm, and highly professional.
- Focus on Ayurvedic benefits, precautions, traditional uses, and health goals.
- If the user asks an unrelated question, politely guide them back to herbs, Ayurveda, or holistic health.
- Keep the responses concise and actionable.`;
    }

    let answerText = "";

    /* ===== OPENAI FIRST ===== */
    try {
      if (!openai) throw new Error("OpenAI not available");

      // Format history into OpenAI Message structure
      const messages = [
        { role: "system", content: systemPrompt }
      ];

      // Add previous messages (limiting to last 10 messages for token safety)
      const recentHistory = history.slice(-10);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add current user query
      messages.push({ role: "user", content: query });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.6,
        max_tokens: 500
      });

      answerText = completion.choices[0].message?.content || "";
    } catch (err) {
  console.error("🚨 OPENAI ERROR:", err);
  console.warn("⚠️ OpenAI failed, switching to Gemini");
    // } catch (err) {
    //   console.warn("⚠️ OpenAI failed, switching to Gemini");

      /* ===== GEMINI FALLBACK ===== */
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      // Construct a single consolidated prompt with conversation history for Gemini
      let fullPrompt = `${systemPrompt}\n\n`;
      if (plantName) {
        fullPrompt += `Context: The user is currently viewing ${plantName} (${scientificName || ''}). All answers should prioritize this herb unless the user asks about another herb.\n\n`;
      }
      
      if (history && history.length > 0) {
        fullPrompt += `Conversation History:\n`;
        const recentHistory = history.slice(-10);
        recentHistory.forEach(msg => {
          const role = msg.sender === 'user' ? 'User' : 'Assistant';
          fullPrompt += `${role}: ${msg.text}\n`;
        });
      }
      
      fullPrompt += `User: ${query}\nAssistant:`;

      const result = await model.generateContent(fullPrompt);
      answerText = result.response.text();
    }

    // Clean any leftover formatting
    const cleanAnswer = answerText
      .replace(/```/g, "")
      .replace(/json/gi, "")
      .trim();

    return res.json({
      answer: cleanAnswer,
      plantName: plantName || null,
      intent: "general",
      language: userLang,
      fromDatabase: false,
    });
  } catch (err) {
  console.error("PLANT QA ERROR:", err);

  const fallbackLang = req.body?.language === "hi" ? "hi" : "en";

  return res.status(500).json({
    answer:
      fallbackLang === "hi"
        ? "क्षमा करें, कुछ समस्या आ गई है।"
        : "Sorry, something went wrong.",
    plantName: null,
    intent: "general",
    language: fallbackLang,
    fromDatabase: false,
  });
}
}); 

// Herbal Guide Narration: expects { plantName, uses, origin, benefits, category }
// Responds with { narration: string } - 20 seconds Hindi narration in Ayurvedic style
app.post('/api/ai/herbal-narration', async (req, res) => {
  try {
    const { plantName, uses, origin, benefits, category } = req.body;
    
    if (!plantName) {
      return res.status(400).json({ message: 'plantName is required' });
    }

    if (!openai) {
 return res.status(500).json({ 
        message: 'OpenAI API key not configured',
        narration: `${plantName} के बारे में जानकारी उपलब्ध नहीं है।` 
      });
    }

    const usesText = uses && Array.isArray(uses) ? uses.join(', ') : (uses || '');
    const benefitsText = benefits && Array.isArray(benefits) ? benefits.join(', ') : (benefits || '');
    const originText = origin || 'प्राचीन भारत';
    const categoryText = category || 'आयुर्वेदिक';

    const prompt = `आप एक आयुर्वेदिक विशेषज्ञ हैं। ${plantName} के बारे में 20 सेकंड की हिंदी में मित्रतापूर्ण और शैक्षिक कथन लिखें।

शामिल करें:
1. उत्पत्ति/मूल: ${originText}
2. आयुर्वेदिक उपयोग: ${usesText}
3. औषधीय लाभ: ${benefitsText}
4. दोष संतुलन (वात, पित्त, कफ)
5. घरेलू उपचार
6. सुरक्षा नोट्स

शैली: मित्रतापूर्ण, शैक्षिक, आयुर्वेदिक, लगभग 20 सेकंड पढ़ने योग्य (लगभग 60-80 शब्द)
केवल कथन लिखें, कोई अतिरिक्त टिप्पणी नहीं।`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    const narration = completion.choices[0].message?.content || 
      `${plantName} एक महत्वपूर्ण आयुर्वेदिक पौधा है जिसका उपयोग प्राचीन काल से किया जा रहा है।`;

    return res.json({ narration });
  } catch (err) {
    console.error('HERBAL NARRATION ERROR:', err);
    return res.status(500).json({ 
      message: err.message,
      narration: 'क्षमा करें, कथन उत्पन्न करने में समस्या हुई।'
    });
  }
});

// Plant Identify: expects { imageBase64: string }
// Responds with { species: string, medicinal: boolean, confidence: number, description: string }
// This matches the Python implementation: directly passing image to generateContent
app.post('/api/ai/plant-identify', async (req, res) => {
  try {
    console.log('Plant identification request received');
    console.log('🔍 Checking API key...');
    console.log('Environment variables:', {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? 'EXISTS (length: ' + process.env.GOOGLE_API_KEY.length + ')' : 'MISSING',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'EXISTS' : 'MISSING'
    });
    
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      console.error("❌ API KEY missing or empty!");
      console.error("Current env vars:", Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('GEMINI')));
      return res.status(500).json({
        message: "Gemini API key not configured. Add GOOGLE_API_KEY in server/.env and restart the server"
      });
    }
    
    console.log('✅ API key found, length:', apiKey.length);

    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: "imageBase64 is required" });
    }

    // Load Gemini library
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    // Extract MIME type
    let mimeType = "image/jpeg";
    let base64Data = imageBase64;

    if (imageBase64.includes("data:image/")) {
      const m = imageBase64.match(/data:(image\/[a-zA-Z]+);base64,/);
      mimeType = m ? m[1] : "image/jpeg";
      base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    }

    console.log("Using MIME type:", mimeType);

    // Load the model — EXACTLY same as Python example
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    // Send image + prompt with structured format request
    const prompt = `Identify this plant from the image. Provide your response in the following exact format:

Common Name: [the most commonly used name for this plant]
Scientific Name: [the botanical/scientific name]
Description: [a detailed description of the plant including its characteristics, appearance, and any notable features]

Important:
- Start your response with "Common Name:" followed by the plant's common name on the same line
- Be specific and accurate with the plant identification
- Use the most widely recognized common name for the plant
- If you're uncertain, still provide your best guess but mention the uncertainty in the description`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      prompt
    ]);

    const text = result.response.text();
    console.log("Full Response:", text);

    // Parse the response to extract plant name more reliably
    let species = "Unknown Plant";
    let description = text;
    
    // Method 1: Try to extract common name from structured format (most reliable)
    const commonNameMatch = text.match(/Common Name:\s*(.+?)(?:\n|Scientific Name:|Description:|$)/i);
    if (commonNameMatch && commonNameMatch[1]) {
      species = commonNameMatch[1].trim();
    } else {
      // Method 2: Look for "Common Name:" anywhere in text (case insensitive)
      const commonNameAlt = text.match(/[Cc]ommon [Nn]ame[:\s]+([A-Z][^.\n]+?)(?:\n|\.|Scientific|Description|$)/);
      if (commonNameAlt && commonNameAlt[1]) {
        species = commonNameAlt[1].trim();
      } else {
        // Method 3: Look for patterns like "This is a [plant name]" or "[Plant Name] is"
        const patterns = [
          /This is (?:a|an)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
          /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is|are|has|was|appears)/,
          /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[:\-]/,
          /identified as\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
          /appears to be\s+(?:a|an)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
        ];
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && match[1] && match[1].trim().length > 2) {
            species = match[1].trim();
            break;
          }
        }
        
        // Method 4: If still not found, try first line but clean it up
        if (species === "Unknown Plant") {
          const firstLine = text.split("\n")[0].trim();
          // Remove common prefixes
          const cleaned = firstLine
            .replace(/^(This is|This appears to be|I can see|Identified as|The plant is|This plant is)\s+(?:a|an)?\s*/i, "")
            .replace(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*).*/, "$1");
          
          if (cleaned && cleaned.length > 2 && cleaned.length < 100 && /^[A-Z]/.test(cleaned)) {
            species = cleaned.split(/[.,;:]/)[0].trim();
          }
        }
      }
    }

    // Clean up species name - remove any trailing punctuation, extra words, or parenthetical info
    species = species
      .split(/[.,;:]/)[0]  // Take only first part before punctuation
      .replace(/\s*\([^)]*\)\s*/g, "")  // Remove parenthetical info
      .replace(/\s*\[[^\]]*\]\s*/g, "")  // Remove bracket info
      .trim();
    
    // If too long, take first few words (likely a sentence instead of just name)
    if (species.length > 50) {
      const words = species.split(/\s+/);
      // Take first 2-4 words that look like a plant name (capitalized)
      const nameWords = words.filter((w, i) => i < 4 && /^[A-Z]/.test(w));
      if (nameWords.length > 0) {
        species = nameWords.join(" ");
      } else {
        species = words.slice(0, 3).join(" ");
      }
    }
    
    // Final validation - ensure it looks like a plant name
    if (species.length < 2 || species.length > 50 || !/^[A-Z]/.test(species)) {
      species = "Unknown Plant";
    }

    console.log("Extracted species:", species);

    return res.json({
      species,
      description: text,
      medicinal: text.toLowerCase().includes("medicinal"),
      confidence: 0.90
    });
  } catch (err) {
    console.error("Plant identification error:", err);
    return res.status(500).json({
      message: "Plant identification failed: " + err.message
    });
  }
});
// ================= ORDER API =================





// const PORT = process.env.API_PORT || process.env.PORT || 5000;

// Enhanced error handling for port conflicts
// ================= START SERVER =================

//const PORT = process.env.PORT || 10000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
// ;
// ================= RAZORPAY API =================

app.post("/api/razorpay/create-order", async (req, res) => {
  try {

    // Razorpay Import
    const Razorpay = require("razorpay");

    // Razorpay Instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { items } = req.body;

    // Validation
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    // Total Calculation
    const totalAmount = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Order Options
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // Create Order
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.error("Razorpay Error:", error);

    res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
    });
  }
});

// ================= REACT FRONTEND FALLBACK =================
// This MUST be placed after all API routes so it doesn't intercept them
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});