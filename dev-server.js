const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const MenuCategory = mongoose.model('MenuCategory', new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  icon: String,
  color: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }));

const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  sizes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  image: String,
  badge: String,
  rating: Number,
  isActive: { type: Boolean, default: true }
}, { timestamps: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Development server is running' });
});

app.get('/api/menu/items/grouped', async (req, res) => {
  try {
    const items = await MenuItem.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    const categories = await MenuCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    
    // Group items by category
    const groupedItems = {};
    categories.forEach(cat => {
      groupedItems[cat.categoryId] = [];
    });
    
    items.forEach(item => {
      if (groupedItems[item.category]) {
        groupedItems[item.category].push(item);
      } else {
        groupedItems[item.category] = [item];
      }
    });
    
    res.json({
      success: true,
      categories,
      menuItems: groupedItems
    });
  } catch (error) {
    console.error('Error fetching grouped menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
});

app.get('/api/offers/all', async (req, res) => {
  try {
    // For now, return empty offers array
    res.json({
      success: true,
      offers: []
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Development server running on port ${PORT}`);
});