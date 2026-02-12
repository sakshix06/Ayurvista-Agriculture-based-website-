const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1️⃣ LOAD .env FIRST (VERY IMPORTANT)
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

// 2️⃣ Initialize Gemini AFTER dotenv
const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 3️⃣ Initialize OpenAI AFTER dotenv
let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "") {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("✅ OpenAI client initialized");
} else {
  console.warn("⚠️ OPENAI_API_KEY not found. OpenAI endpoints will fail.");
}

// 2️⃣ Import routes
const stripeRoutes = require("./routes/stripe.routes.cjs");
const { mailerRouter } = require("./routes/mailer.routes.cjs");
const orderRouter = require("./routes/order.routes.cjs");

// 3️⃣ Create Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

// 4️⃣ Register routes
app.use("/api/stripe", stripeRoutes);
app.use("/api/mail", mailerRouter);
app.use("/api/order", orderRouter);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ayurvista";
const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-please-change";

// MongoDB connect
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.warn("⚠️ MongoDB connection failed:", err.message);
    console.log("📝 Using in-memory storage for development");
  });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
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
    image: { type: String, required: true },
    description: { type: String },
    benefits: [String],
    uses: [String],
    careInstructions: {
      water: String,
      light: String,
      temperature: String,
      soil: String
    },
    medicinalProperties: [String],
    category: { type: String, default: 'medicinal' }
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
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    
    if (isMongoConnected()) {
      // Use MongoDB
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already registered' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      const token = jwt.sign({ sub: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
      // Use in-memory storage
      if (inMemoryStorage.users.has(email)) {
        return res.status(409).json({ message: 'Email already registered' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = inMemoryStorage.nextUserId++;
      const user = { id: userId, name, email, passwordHash };
      inMemoryStorage.users.set(email, user);
      const token = jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: userId, name: user.name, email: user.email } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    
    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ sub: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
      // Use in-memory storage
      const user = inMemoryStorage.users.get(email);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
  const plantsData = [
    {
      id: 1,
      name: "Aloe Vera",
      image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
      description: "A succulent plant known for its healing properties",
      benefits: ["Skin healing", "Digestive health", "Immune support"],
      uses: ["Topical gel", "Juice", "Supplements"],
      careInstructions: {
        water: "Water sparingly, allow soil to dry between waterings",
        light: "Bright, indirect light",
        temperature: "60-75°F (15-24°C)",
        soil: "Well-draining cactus mix"
      },
      medicinalProperties: ["Anti-inflammatory", "Antimicrobial", "Wound healing"]
    },
    {
      id: 2,
      name: "Golden Money Plant",
      image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png",
      description: "A popular houseplant believed to bring good luck and prosperity",
      benefits: ["Air purification", "Stress reduction", "Positive energy"],
      uses: ["Indoor decoration", "Air purification", "Feng shui"],
      careInstructions: {
        water: "Water when top inch of soil is dry",
        light: "Bright, indirect light",
        temperature: "65-80°F (18-27°C)",
        soil: "Well-draining potting mix"
      },
      medicinalProperties: ["Air purification", "Stress relief"]
    },
    {
      id: 3,
      name: "Cactus",
      image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png",
      description: "A hardy desert plant with unique water storage capabilities",
      benefits: ["Low maintenance", "Air purification", "Unique aesthetics"],
      uses: ["Indoor decoration", "Garden landscaping", "Medicinal purposes"],
      careInstructions: {
        water: "Water every 2-3 weeks, less in winter",
        light: "Full sun to bright indirect light",
        temperature: "70-90°F (21-32°C)",
        soil: "Cactus or succulent mix"
      },
      medicinalProperties: ["Water storage", "Adaptogenic"]
    },
    {
      id: 4,
      name: "Autumn Fern",
      image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png",
      description: "A beautiful fern with copper-colored new fronds",
      benefits: ["Air purification", "Humidity regulation", "Natural beauty"],
      uses: ["Indoor decoration", "Garden landscaping", "Air purification"],
      careInstructions: {
        water: "Keep soil consistently moist",
        light: "Partial shade to filtered light",
        temperature: "60-75°F (15-24°C)",
        soil: "Rich, well-draining soil"
      },
      medicinalProperties: ["Air purification", "Humidity control"]
    },
    {
      id: 5,
      name: "Monstera Deliciosa",
      image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png",
      description: "A tropical plant with distinctive split leaves",
      benefits: ["Air purification", "Large foliage", "Tropical aesthetics"],
      uses: ["Indoor decoration", "Air purification", "Statement plant"],
      careInstructions: {
        water: "Water when top 2 inches are dry",
        light: "Bright, indirect light",
        temperature: "65-85°F (18-29°C)",
        soil: "Well-draining potting mix"
      },
      medicinalProperties: ["Air purification", "Large oxygen production"]
    }
  ];

  plantsData.forEach(plant => {
    inMemoryStorage.plants.set(plant.id, plant);
  });
};

// Initialize plant data
initializePlantData();

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
      return res.json({ message: 'Plants already seeded' });
    }

    const plantsData = [
      {
        id: 1,
        name: "Aloe Vera",
        image: "/lovable-uploads/101fe8a0-5dc6-4ded-a05b-a887722a629d.png",
        description: "A succulent plant known for its healing properties",
        benefits: ["Skin healing", "Digestive health", "Immune support"],
        uses: ["Topical gel", "Juice", "Supplements"],
        careInstructions: {
          water: "Water sparingly, allow soil to dry between waterings",
          light: "Bright, indirect light",
          temperature: "60-75°F (15-24°C)",
          soil: "Well-draining cactus mix"
        },
        medicinalProperties: ["Anti-inflammatory", "Antimicrobial", "Wound healing"]
      },
      {
        id: 2,
        name: "Golden Money Plant",
        image: "/lovable-uploads/124c9240-d734-40d5-aaad-699471ad9889.png",
        description: "A popular houseplant believed to bring good luck and prosperity",
        benefits: ["Air purification", "Stress reduction", "Positive energy"],
        uses: ["Indoor decoration", "Air purification", "Feng shui"],
        careInstructions: {
          water: "Water when top inch of soil is dry",
          light: "Bright, indirect light",
          temperature: "65-80°F (18-27°C)",
          soil: "Well-draining potting mix"
        },
        medicinalProperties: ["Air purification", "Stress relief"]
      },
      {
        id: 3,
        name: "Cactus",
        image: "/lovable-uploads/4569bb5e-341b-40ca-a57d-012a38c41449.png",
        description: "A hardy desert plant with unique water storage capabilities",
        benefits: ["Low maintenance", "Air purification", "Unique aesthetics"],
        uses: ["Indoor decoration", "Garden landscaping", "Medicinal purposes"],
        careInstructions: {
          water: "Water every 2-3 weeks, less in winter",
          light: "Full sun to bright indirect light",
          temperature: "70-90°F (21-32°C)",
          soil: "Cactus or succulent mix"
        },
        medicinalProperties: ["Water storage", "Adaptogenic"]
      },
      {
        id: 4,
        name: "Autumn Fern",
        image: "/lovable-uploads/57676f3f-fcca-4be2-83f5-99907f0f3068.png",
        description: "A beautiful fern with copper-colored new fronds",
        benefits: ["Air purification", "Humidity regulation", "Natural beauty"],
        uses: ["Indoor decoration", "Garden landscaping", "Air purification"],
        careInstructions: {
          water: "Keep soil consistently moist",
          light: "Partial shade to filtered light",
          temperature: "60-75°F (15-24°C)",
          soil: "Rich, well-draining soil"
        },
        medicinalProperties: ["Air purification", "Humidity control"]
      },
      {
        id: 5,
        name: "Monstera Deliciosa",
        image: "/lovable-uploads/b3353135-a7cc-4a7f-861d-ffbce405151c.png",
        description: "A tropical plant with distinctive split leaves",
        benefits: ["Air purification", "Large foliage", "Tropical aesthetics"],
        uses: ["Indoor decoration", "Air purification", "Statement plant"],
        careInstructions: {
          water: "Water when top 2 inches are dry",
          light: "Bright, indirect light",
          temperature: "65-85°F (18-29°C)",
          soil: "Well-draining potting mix"
        },
        medicinalProperties: ["Air purification", "Large oxygen production"]
      }
    ];

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

// Plant Q&A endpoint
// 🌿 Plant Q&A (Clean Text Answer Only)
app.post("/api/ai/plant-qa", async (req, res) => {
  try {
    const { query, language } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "query is required" });
    }

    const userLang = language === "hi" ? "hi" : "en";

    // 🔥 STRONG LANGUAGE-LOCK PROMPT
    const prompt =
      userLang === "hi"
        ? `आप एक पौधों के विशेषज्ञ हैं।

यूज़र का प्रश्न:
"${query}"

नियम:
- उत्तर केवल हिंदी में दें
- अंग्रेज़ी का एक भी शब्द न लिखें
- सरल, स्पष्ट और उपयोगी उत्तर दें
- कोई JSON, कोड या formatting न करें`
        : `You are a plant expert.

User question:
"${query}"

Rules:
- Reply ONLY in English
- Do NOT use Hindi words
- Give a clear, simple and helpful answer
- Do NOT return JSON, code or formatting`;

    let answerText = "";

    /* ===== OPENAI FIRST ===== */
    try {
      if (!openai) throw new Error("OpenAI not available");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      answerText = completion.choices[0].message?.content || "";
    } catch (err) {
      console.warn("⚠️ OpenAI failed, switching to Gemini");

      /* ===== GEMINI FALLBACK ===== */
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      const result = await model.generateContent(prompt);
      answerText = result.response.text();
    }

    // 🔹 CLEAN ANY LEFTOVER FORMATTING
    const cleanAnswer = answerText
      .replace(/```/g, "")
      .replace(/json/gi, "")
      .trim();

    return res.json({
      answer: cleanAnswer,
      plantName: null,
      intent: "general",
      language: userLang,
      fromDatabase: false,
    });
  } catch (err) {
    console.error("PLANT QA ERROR:", err);
    return res.status(500).json({
      answer:
        language === "hi"
          ? "क्षमा करें, कुछ समस्या आ गई है।"
          : "Sorry, something went wrong.",
      plantName: null,
      intent: "general",
      language: language || "en",
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





const PORT = process.env.API_PORT || process.env.PORT || 5000;

// Enhanced error handling for port conflicts
const server = app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`💡 Solutions:`);
    console.error(`   1. Kill the process using port ${PORT}:`);
    console.error(`      Windows: netstat -ano | findstr :${PORT}`);
    console.error(`      Then: taskkill /PID <PID> /F`);
    console.error(`   2. Use a different port by setting API_PORT in .env file`);
    console.error(`   3. Or change PORT in your .env file`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

