const { connectToDatabase } = require('../_lib/db');
const { MenuCategory } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleValidationError, handleRequest } = require('../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const categories = await MenuCategory.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select('-__v');
    
    successResponse(res, { categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    errorResponse(res, 500, 'Error fetching categories', error.message);
  }
}

async function POST(req, res) {
  try {
    await connectToDatabase();
    
    const category = new MenuCategory({
      ...req.body,
      updatedAt: new Date()
    });
    
    const savedCategory = await category.save();
    
    successResponse(res, { category: savedCategory }, 'Category created successfully', 201);
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Category ID already exists');
    }
    
    if (error.name === 'ValidationError') {
      const validationError = handleValidationError(error);
      return errorResponse(res, 400, validationError.message, validationError.errors);
    }
    
    errorResponse(res, 500, 'Error creating category', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET,
    POST
  });
}