const { connectToDatabase } = require('../../_lib/db');
const { MenuItem, MenuCategory } = require('../../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleRequest } = require('../../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
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
    
    successResponse(res, {
      categories,
      menuItems: groupedItems
    });
  } catch (error) {
    console.error('Error fetching grouped menu items:', error);
    errorResponse(res, 500, 'Error fetching menu items', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET
  });
}