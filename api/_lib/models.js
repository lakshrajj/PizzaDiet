const mongoose = require('mongoose');

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

// Export models with conditional creation to avoid re-compilation errors
const FranchiseApplication = mongoose.models.FranchiseApplication || mongoose.model('FranchiseApplication', franchiseApplicationSchema);
const MenuCategory = mongoose.models.MenuCategory || mongoose.model('MenuCategory', menuCategorySchema);
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

module.exports = {
  FranchiseApplication,
  MenuCategory,
  MenuItem,
  Offer
};