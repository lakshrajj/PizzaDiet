const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Franchise Application Schema
const franchiseApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  businessName: String,
  businessAddress: String,
  ownsFranchise: String,
  franchiseDetails: String,
  locationInterest: { type: String, required: true },
  whyFranchise: { type: String, required: true },
  industryExperience: String,
  industryDetails: String,
  investmentAmount: { type: String, required: true },
  canMeetInvestment: String,
  businessExperience: String,
  businessDetails: String,
  consentInfo: { type: Boolean, required: true },
  consentProcessing: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

const FranchiseApplication = mongoose.model('FranchiseApplication', franchiseApplicationSchema);

// Menu Category Schema
const menuCategorySchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, default: '🍕' },
  color: { type: String, default: 'from-orange-500 to-red-500' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  badge: String,
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  category: { type: String, required: true },
  sizes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Offers/Deals Schema
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  discount: { type: String, required: true },
  badge: String,
  validUntil: { type: Date, required: true },
  terms: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Offer = mongoose.model('Offer', offerSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Submit franchise application
app.post('/api/franchise/apply', async (req, res) => {
  try {
    console.log('Received franchise application:', req.body);
    
    const application = new FranchiseApplication(req.body);
    const savedApplication = await application.save();
    
    console.log('Franchise application saved to MongoDB:', savedApplication._id);
    
    res.status(201).json({
      success: true,
      message: 'Franchise application submitted successfully',
      applicationId: savedApplication._id
    });
  } catch (error) {
    console.error('Error saving franchise application:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get all franchise applications (admin only)
app.get('/api/franchise/applications', async (req, res) => {
  try {
    const applications = await FranchiseApplication.find()
      .sort({ submittedAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications'
    });
  }
});

// Get single franchise application by ID
app.get('/api/franchise/applications/:id', async (req, res) => {
  try {
    const application = await FranchiseApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application'
    });
  }
});

// Update application status
app.patch('/api/franchise/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'in-review'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const application = await FranchiseApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application status updated',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application'
    });
  }
});

// ========================
// MENU CATEGORIES ROUTES
// ========================

// Get all menu categories
app.get('/api/menu/categories', async (req, res) => {
  try {
    const categories = await MenuCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// Create menu category
app.post('/api/menu/categories', async (req, res) => {
  try {
    const category = new MenuCategory({
      ...req.body,
      updatedAt: new Date()
    });
    
    const savedCategory = await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: savedCategory
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category ID already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating category'
    });
  }
});

// Update menu category
app.put('/api/menu/categories/:id', async (req, res) => {
  try {
    const category = await MenuCategory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category'
    });
  }
});

// Delete menu category
app.delete('/api/menu/categories/:id', async (req, res) => {
  try {
    const category = await MenuCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Soft delete - mark as inactive
    category.isActive = false;
    category.updatedAt = new Date();
    await category.save();
    
    // Also mark all menu items in this category as inactive
    await MenuItem.updateMany(
      { category: category.categoryId },
      { isActive: false, updatedAt: new Date() }
    );
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
    });
  }
});

// ========================
// MENU ITEMS ROUTES
// ========================

// Get all menu items
app.get('/api/menu/items', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    const items = await MenuItem.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items'
    });
  }
});

// Get menu items grouped by category
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
      message: 'Error fetching menu items'
    });
  }
});

// Create menu item
app.post('/api/menu/items', async (req, res) => {
  try {
    const item = new MenuItem({
      ...req.body,
      updatedAt: new Date()
    });
    
    const savedItem = await item.save();
    
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item: savedItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating menu item'
    });
  }
});

// Get single menu item
app.get('/api/menu/items/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    
    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item'
    });
  }
});

// Update menu item
app.put('/api/menu/items/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      item
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating menu item'
    });
  }
});

// Delete menu item
app.delete('/api/menu/items/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    // Soft delete - mark as inactive
    item.isActive = false;
    item.updatedAt = new Date();
    await item.save();
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item'
    });
  }
});

// Clear and seed with comprehensive menu data
app.post('/api/menu/clear-and-seed', async (req, res) => {
  try {
    // Clear existing data
    await MenuItem.deleteMany({});
    await MenuCategory.deleteMany({});
    
    // New comprehensive categories
    const categories = [
      { categoryId: 'featured', name: 'Featured', icon: '🔥', color: 'from-red-500 to-orange-500', order: 1 },
      { categoryId: 'simply-veg', name: 'Simply Veg', icon: '🥬', color: 'from-green-500 to-emerald-500', order: 2 },
      { categoryId: 'classic-veg', name: 'Classic Veg', icon: '🍕', color: 'from-orange-500 to-red-500', order: 3 },
      { categoryId: 'deluxe-veg', name: 'Deluxe Veg', icon: '👑', color: 'from-purple-500 to-pink-500', order: 4 },
      { categoryId: 'supreme-veg', name: 'Supreme Veg', icon: '⭐', color: 'from-yellow-500 to-orange-500', order: 5 },
      { categoryId: 'jain-special', name: 'Jain Special', icon: '🙏', color: 'from-amber-500 to-yellow-500', order: 6 },
      { categoryId: 'sides', name: 'Sides', icon: '🍟', color: 'from-yellow-500 to-orange-500', order: 7 },
      { categoryId: 'starters', name: 'Starters', icon: '🥗', color: 'from-blue-500 to-cyan-500', order: 8 },
      { categoryId: 'beverages', name: 'Beverages', icon: '🥤', color: 'from-blue-500 to-purple-500', order: 9 },
      { categoryId: 'miniPizzas', name: 'Mini Pizzas', icon: '🍕', color: 'from-indigo-500 to-purple-500', order: 10 },
      { categoryId: 'burgers', name: 'Burgers', icon: '🍔', color: 'from-red-500 to-orange-500', order: 11 },
      { categoryId: 'pasta', name: 'Pasta', icon: '🍝', color: 'from-green-500 to-teal-500', order: 12 },
      { categoryId: 'breads', name: 'Breads', icon: '🍞', color: 'from-amber-500 to-orange-500', order: 13 },
      { categoryId: 'combos', name: 'Combos', icon: '🍽️', color: 'from-pink-500 to-red-500', order: 14 }
    ];
    
    // Insert categories
    for (const categoryData of categories) {
      await MenuCategory.create(categoryData);
    }
    
    // Comprehensive menu data
    const menuData = {
      "featured": [
        {
          "name": "Cloud 7",
          "description": "(Onion, tomato, corn, paneer, capsicum, jalapeno)",
          "image": "https://media.discordapp.net/attachments/1378467356996800562/1384920550220107876/Cloud_7.png?ex=68542f45&is=6852ddc5&hm=72a21f6306879111a15d6d534ce39f87afe7229238a4147144d809c7f49b7497&=&format=webp&quality=lossless&width=350&height=350",
          "badge": "🔥 Featured",
          "rating": 4.9,
          "category": "featured",
          "sizes": [
            { "name": "Small", "price": 240 },
            { "name": "Medium", "price": 450 },
            { "name": "Large", "price": 650 }
          ]
        },
        {
          "name": "Extravaganza",
          "description": "(Black olives, onion, capsicum, mushroom, fresh tomato & corn)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1380606512228991096/Extravaganza.png?ex=6853a6c2&is=68525542&hm=e2ff2e1d82a95dea42be8adbde6723175856d76a2ec3c1b4ee36617e4a5931f2&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🎉 Special",
          "rating": 4.8,
          "category": "featured",
          "sizes": [
            { "name": "Small", "price": 240 },
            { "name": "Medium", "price": 450 },
            { "name": "Large", "price": 600 }
          ]
        },
        {
          "name": "Special Tandoori Paneer",
          "description": "(Tandoori Sauce, onion, capsicum, chillies & paneer)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1380606558404087909/Peppy.png?ex=6853a6cd&is=6852554d&hm=eccecb86241c3edc86989a5ceb9a31d349d8ecd0f093066a15607586d4eb64d0&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🔥 Tandoori",
          "rating": 4.7,
          "category": "featured",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        }
      ],
      "simply-veg": [
        {
          "name": "Margherita",
          "description": "(Cheese & Tomato Sauce)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1380606514380673075/Margherita.png?ex=6853a6c3&is=68525543&hm=0a28996ac96bee5c4d6093ed868b6ccc987dd32b4681971800dbd27b3dd6871f&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🍕 Classic",
          "rating": 4.7,
          "category": "simply-veg",
          "sizes": [
            { "name": "Small", "price": 100 },
            { "name": "Medium", "price": 200 },
            { "name": "Large", "price": 360 }
          ]
        },
        {
          "name": "Onion Veg",
          "description": "(Cheese & onion)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1380606557376610385/Onion.png?ex=6853a6cd&is=6852554d&hm=df91f32f1bac938d1184e9354d0faf08aaf96c3861ec24d2d508d73befcc9c0e&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🧅 Simple",
          "rating": 4.4,
          "category": "simply-veg",
          "sizes": [
            { "name": "Small", "price": 120 },
            { "name": "Medium", "price": 240 },
            { "name": "Large", "price": 380 }
          ]
        },
        {
          "name": "Tomato Veg",
          "description": "(Cheese & tomato)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1380606622178476163/Tomato.png?ex=6853a6dd&is=6852555d&hm=1663b89ccc69279497eb476577056c1084d07dfccda34e618b37451eb05f2485&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🍅 Fresh",
          "rating": 4.3,
          "category": "simply-veg",
          "sizes": [
            { "name": "Small", "price": 120 },
            { "name": "Medium", "price": 240 },
            { "name": "Large", "price": 380 }
          ]
        },
        {
          "name": "Capsicum Veg",
          "description": "(Cheese & capsicum)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930662305234984/Capsicum.png?ex=685438b0&is=6852e730&hm=f21f7588be88345e16a79036a4215bf310baaf06cf89dafa7d94a9d101895259&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🫑 Crispy",
          "rating": 4.2,
          "category": "simply-veg",
          "sizes": [
            { "name": "Small", "price": 120 },
            { "name": "Medium", "price": 240 },
            { "name": "Large", "price": 380 }
          ]
        },
        {
          "name": "Cheese Paneer",
          "description": "(Cheese & paneer)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930663244894290/Cheese_Paneer.png?ex=685438b0&is=6852e730&hm=381e7ca27a341b006b598c9f1ac1259493d6ecf14f3fbfc693cbe6d7d2ffd6bd&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🧀 Rich",
          "rating": 4.6,
          "category": "simply-veg",
          "sizes": [
            { "name": "Small", "price": 140 },
            { "name": "Medium", "price": 300 },
            { "name": "Large", "price": 460 }
          ]
        }
      ],
      "classic-veg": [
        {
          "name": "Mexican Veg",
          "description": "(Onion, Tomato & Jalapenos)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930722669789397/Mexican.png?ex=685438bf&is=6852e73f&hm=201f1a33a7d8d4f26bc634dfc940080d6aedc746f610b2d7b176368f5ae1c9ea&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🌶️ Mexican",
          "rating": 4.4,
          "category": "classic-veg",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Spicy Veg",
          "description": "(Onion, Capsicum & Green Chillies)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384933478658871296/Spicy_Veg.png?ex=68543b50&is=6852e9d0&hm=d2328edc169c3712ec4df89081d2d3edeff032b28cd33b12a0e3feb4faa7c2fd&=&format=webp&quality=lossless&width=826&height=826",
          "badge": "🔥 Spicy",
          "rating": 4.2,
          "category": "classic-veg",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Golden Corn Veg",
          "description": "(Onion, Capsicum & Corn)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930720761512106/Golden.png?ex=685438be&is=6852e73e&hm=67a952cd17790ada0d6e5e8a66863ece468bc4f76a1e4cdfed94514ddc42fd88&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🌽 Sweet",
          "rating": 4.5,
          "category": "classic-veg",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Farmhouse Veg",
          "description": "(Onion, Capsicum & Tomato)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930719742165083/Farmhouse.png?ex=685438be&is=6852e73e&hm=33ed5e0c29901aee286677cec0b8ef126b0ac137670ccd58812d3b1ab5c48b69&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🚜 Farm Fresh",
          "rating": 4.4,
          "category": "classic-veg",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Country Special",
          "description": "(Onion, Capsicum, Tomato & Mushrooms)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930717972037793/Country.png?ex=685438bd&is=6852e73d&hm=525ed8411b7123fd8110029e345dc74954b09b3506d754e9ea945b9dcbd381d2&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🏡 Country",
          "rating": 4.3,
          "category": "classic-veg",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Double Cheese Margherita",
          "description": "(Double Cheese & sauce)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930722116145345/Margherita.png?ex=685438be&is=6852e73e&hm=11cf16d81231f2dd57a69752fdea62433e4ee76757fdd03d020e01f263935a21&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🧀🧀 Double Cheese",
          "rating": 4.7,
          "category": "classic-veg",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        }
      ],
      "deluxe-veg": [
        {
          "name": "Spl. Makhani Paneer",
          "description": "(Onion, Paneer & Corn)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384937232397500586/Makhani.png?ex=68543ecf&is=6852ed4f&hm=423e906ed7e53edf86f082f28f6b88db019aef5748da59ae39bb2821a2ac70e4&=&format=webp&quality=lossless&width=826&height=826",
          "badge": "👑 Royal",
          "rating": 4.8,
          "category": "deluxe-veg",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        },
        {
          "name": "Spl. Tandoori",
          "description": "(Tandoori Sauce, Onion, Capsicum, Chillies & Paneer)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930770338054225/Peppy.png?ex=685438ca&is=6852e74a&hm=7ecbeee4f69aae4e9763667fbe80ab4f6858ae7551db3ff988a9897012cf891b&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🔥 Tandoori",
          "rating": 4.6,
          "category": "deluxe-veg",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        },
        {
          "name": "Spl. Punjabi",
          "description": "(Onion, Capsicum, Chillies & Paneer)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930770937843782/Punjabi.png?ex=685438ca&is=6852e74a&hm=6e9721e355583206b97cf8b3b6ab7ab215d1d33d81eb5979f7a364a244666454&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🥘 Punjabi",
          "rating": 4.7,
          "category": "deluxe-veg",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        },
        {
          "name": "Spl. Deluxe",
          "description": "(Onion, Capsicum, Paneer & Mushrooms)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384939569593581798/Deluxe.png?ex=685440fc&is=6852ef7c&hm=d775fb990c97fafacccc9500ae824c2d6a44b12ea6bc9dcdf70e8acda72ed0d6&=&format=webp&quality=lossless&width=826&height=826",
          "badge": "💎 Deluxe",
          "rating": 4.7,
          "category": "deluxe-veg",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        }
      ],
      "supreme-veg": [
        {
          "name": "Cloud 7",
          "description": "(Onion, tomato, corn, paneer, capsicum, jalapeno)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930664997978122/Cloud_7.png?ex=685438b1&is=6852e731&hm=f3f5cb58c28e7d85a5e2af2a514673ea9073afe5cef8ca3b8bf8cb165d083fc0&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "☁️ Signature",
          "rating": 4.9,
          "category": "supreme-veg",
          "sizes": [
            { "name": "Small", "price": 240 },
            { "name": "Medium", "price": 450 },
            { "name": "Large", "price": 600 }
          ]
        },
        {
          "name": "Extravaganza Veg",
          "description": "(Black olives, onion, capsicum, mushroom, fresh tomato & corn)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930719138054255/Extravaganza.png?ex=685438be&is=6852e73e&hm=b200694952c1d7ef044b2adbadaaec2370dc53f098d9487868ed0e10d393c3be&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "🎉 Extravaganza",
          "rating": 4.8,
          "category": "supreme-veg",
          "sizes": [
            { "name": "Small", "price": 240 },
            { "name": "Medium", "price": 450 },
            { "name": "Large", "price": 600 }
          ]
        },
        {
          "name": "Spl. Supreme Veg",
          "description": "(Onion, tomato, corn, capsicum, jalapeno, mushrooms & Extra Cheese)",
          "image": "https://media.discordapp.net/attachments/1380606372118532166/1384930719138054255/Extravaganza.png?ex=685438be&is=6852e73e&hm=b200694952c1d7ef044b2adbadaaec2370dc53f098d9487868ed0e10d393c3be&=&format=webp&quality=lossless&width=722&height=722",
          "badge": "👑 Supreme",
          "rating": 4.7,
          "category": "supreme-veg",
          "sizes": [
            { "name": "Small", "price": 250 },
            { "name": "Medium", "price": 480 },
            { "name": "Large", "price": 620 }
          ]
        }
      ],
      "jain-special": [
        {
          "name": "Golden Delight",
          "description": "(Tomato, Capsicum & Corn)",
          "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "badge": "🙏 Jain",
          "rating": 4.3,
          "category": "jain-special",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Veggie Crust",
          "description": "(Tomato, Capsicum & Jalapeno)",
          "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "badge": "🙏 Jain",
          "rating": 4.2,
          "category": "jain-special",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Spicy Seasonal",
          "description": "(Green Chilies, Capsicum & Red Chilies)",
          "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "badge": "🙏 Jain",
          "rating": 4.1,
          "category": "jain-special",
          "sizes": [
            { "name": "Small", "price": 150 },
            { "name": "Medium", "price": 360 },
            { "name": "Large", "price": 480 }
          ]
        },
        {
          "name": "Yummy Tandoori Paneer",
          "description": "(Tandoori Sauce, Capsicum, Chillies & Paneer)",
          "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "badge": "🙏 Jain",
          "rating": 4.5,
          "category": "jain-special",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        },
        {
          "name": "Spicy Zesty Paneer",
          "description": "(Green Chillies, Red Chillies, Paneer & Capsicum)",
          "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "badge": "🙏 Jain",
          "rating": 4.4,
          "category": "jain-special",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        },
        {
          "name": "Yummy Makhani Paneer",
          "description": "(Paneer, Corn & Capsicum)",
          "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "badge": "🙏 Jain",
          "rating": 4.6,
          "category": "jain-special",
          "sizes": [
            { "name": "Small", "price": 200 },
            { "name": "Medium", "price": 400 },
            { "name": "Large", "price": 580 }
          ]
        }
      ]
    };
    
    // Insert all menu items
    for (const [category, items] of Object.entries(menuData)) {
      for (const itemData of items) {
        await MenuItem.create(itemData);
      }
    }
    
    res.json({
      success: true,
      message: 'Database cleared and seeded successfully with comprehensive menu data',
      stats: {
        categories: categories.length,
        menuItems: Object.values(menuData).reduce((sum, items) => sum + items.length, 0)
      }
    });
  } catch (error) {
    console.error('Error clearing and seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing and seeding database',
      error: error.message
    });
  }
});

// Seed initial data from existing data structure (keep old endpoint for compatibility)
app.post('/api/menu/seed', async (req, res) => {
  try {
    // Initial categories data
    const initialCategories = [
      { categoryId: 'featured', name: 'Featured', icon: '⭐', color: 'from-yellow-500 to-orange-500', order: 1 },
      { categoryId: 'simply-veg', name: 'Simply Veg', icon: '🥬', color: 'from-green-500 to-emerald-500', order: 2 },
      { categoryId: 'deluxe', name: 'Deluxe', icon: '👑', color: 'from-purple-500 to-pink-500', order: 3 }
    ];
    
    // Insert categories
    for (const categoryData of initialCategories) {
      const existingCategory = await MenuCategory.findOne({ categoryId: categoryData.categoryId });
      if (!existingCategory) {
        await MenuCategory.create(categoryData);
      }
    }
    
    // Sample menu items
    const initialItems = [
      {
        name: 'Cloud 7 Pizza',
        description: 'Our signature creation with onion, tomato, corn, paneer, capsicum, and jalapeño - a perfect harmony of flavors',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
        badge: '🏆 Signature',
        rating: 4.9,
        category: 'featured',
        sizes: [
          { name: 'Small', price: 240 },
          { name: 'Medium', price: 450 },
          { name: 'Large', price: 600 }
        ]
      },
      {
        name: 'Margherita Classic',
        description: 'The timeless classic with fresh mozzarella cheese and our signature pizza sauce',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500',
        badge: '❤️ Classic',
        rating: 4.6,
        category: 'simply-veg',
        sizes: [
          { name: 'Small', price: 100 },
          { name: 'Medium', price: 200 },
          { name: 'Large', price: 360 }
        ]
      },
      {
        name: 'Makhani Paneer Special',
        description: 'Rich makhani sauce with tender paneer, onions, and corn - a royal treat',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500',
        badge: '👑 Royal',
        rating: 4.8,
        category: 'deluxe',
        sizes: [
          { name: 'Small', price: 200 },
          { name: 'Medium', price: 400 },
          { name: 'Large', price: 580 }
        ]
      }
    ];
    
    // Insert menu items if they don't exist
    for (const itemData of initialItems) {
      const existingItem = await MenuItem.findOne({ name: itemData.name });
      if (!existingItem) {
        await MenuItem.create(itemData);
      }
    }
    
    res.json({
      success: true,
      message: 'Database seeded successfully with initial menu data'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database'
    });
  }
});

// ========================
// OFFERS ROUTES
// ========================

// Get all active offers
app.get('/api/offers', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      offers
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
});

// Get all offers (admin)
app.get('/api/offers/all', async (req, res) => {
  try {
    const offers = await Offer.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      offers
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
});

// Create offer
app.post('/api/offers', async (req, res) => {
  try {
    const offer = new Offer({
      ...req.body,
      updatedAt: new Date()
    });
    
    const savedOffer = await offer.save();
    
    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer: savedOffer
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating offer'
    });
  }
});

// Update offer
app.put('/api/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Offer updated successfully',
      offer
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating offer'
    });
  }
});

// Delete offer
app.delete('/api/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    // Soft delete - mark as inactive
    offer.isActive = false;
    offer.updatedAt = new Date();
    await offer.save();
    
    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting offer'
    });
  }
});

// Seed offers with initial data
app.post('/api/offers/seed', async (req, res) => {
  try {
    const sampleOffers = [
      {
        title: "BOGO Pizza Special",
        description: "Buy one get one FREE on all medium pizzas",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        discount: "50% OFF",
        badge: "🔥 Hot Deal",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        terms: [
          "Valid on medium pizzas only",
          "Cannot be combined with other offers",
          "Dine-in and takeaway only",
          "Valid till stocks last"
        ]
      },
      {
        title: "Weekend Family Combo",
        description: "2 Large Pizzas + 4 Beverages + Garlic Bread",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
        discount: "₹999 Only",
        badge: "👨‍👩‍👧‍👦 Family Deal",
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        terms: [
          "Valid on weekends only",
          "Choose from select pizza varieties",
          "Beverages: Pepsi/Sprite/7Up",
          "Free home delivery"
        ]
      },
      {
        title: "Student Special",
        description: "30% off on all orders with valid student ID",
        image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500",
        discount: "30% OFF",
        badge: "🎓 Student",
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        terms: [
          "Valid student ID required",
          "Available all days",
          "Maximum discount ₹200",
          "Not valid on combos"
        ]
      }
    ];

    // Insert offers if they don't exist
    for (const offerData of sampleOffers) {
      const existingOffer = await Offer.findOne({ title: offerData.title });
      if (!existingOffer) {
        await Offer.create(offerData);
      }
    }

    res.json({
      success: true,
      message: 'Offers seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding offers'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;