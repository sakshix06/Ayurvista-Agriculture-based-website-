const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayurvista';
console.log('Connecting to:', uri);

mongoose.connect(uri)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully!');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check if Plants collection has any data
    try {
      const Plant = mongoose.model('Plant', new mongoose.Schema({}, { strict: false }));
      const count = await Plant.countDocuments();
      console.log('Total plants in DB:', count);
    } catch (e) {
      console.error('Error querying plants:', e);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  });
