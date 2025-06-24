const { connectToDatabase } = require('../../_lib/db');
const { MenuItem } = require('../../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleValidationError, handleRequest } = require('../../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const { category } = req.query;
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    const items = await MenuItem.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    successResponse(res, {
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    errorResponse(res, 500, 'Error fetching menu items', error.message);
  }
}

async function POST(req, res) {
  try {
    await connectToDatabase();
    
    const item = new MenuItem({
      ...req.body,
      updatedAt: new Date()
    });
    
    const savedItem = await item.save();
    
    successResponse(res, { item: savedItem }, 'Menu item created successfully', 201);
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    if (error.name === 'ValidationError') {
      const validationError = handleValidationError(error);
      return errorResponse(res, 400, validationError.message, validationError.errors);
    }
    
    errorResponse(res, 500, 'Error creating menu item', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET,
    POST
  });
}