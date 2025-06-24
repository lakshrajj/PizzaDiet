const { connectToDatabase } = require('../../_lib/db');
const { MenuCategory, MenuItem } = require('../../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleValidationError, handleRequest } = require('../../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const category = await MenuCategory.findById(id);
    
    if (!category || !category.isActive) {
      return errorResponse(res, 404, 'Category not found');
    }
    
    successResponse(res, { category });
  } catch (error) {
    console.error('Error fetching category:', error);
    errorResponse(res, 500, 'Error fetching category', error.message);
  }
}

async function PUT(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const category = await MenuCategory.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }
    
    successResponse(res, { category }, 'Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.name === 'ValidationError') {
      const validationError = handleValidationError(error);
      return errorResponse(res, 400, validationError.message, validationError.errors);
    }
    
    errorResponse(res, 500, 'Error updating category', error.message);
  }
}

async function DELETE(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const category = await MenuCategory.findById(id);
    
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
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
    
    successResponse(res, {}, 'Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    errorResponse(res, 500, 'Error deleting category', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET,
    PUT,
    DELETE
  });
}