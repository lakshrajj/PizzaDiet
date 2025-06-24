const { connectToDatabase } = require('../../_lib/db');
const { MenuItem } = require('../../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleValidationError, handleRequest } = require('../../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const item = await MenuItem.findById(id);
    
    if (!item || !item.isActive) {
      return errorResponse(res, 404, 'Menu item not found');
    }
    
    successResponse(res, { item });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    errorResponse(res, 500, 'Error fetching menu item', error.message);
  }
}

async function PUT(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const item = await MenuItem.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return errorResponse(res, 404, 'Menu item not found');
    }
    
    successResponse(res, { item }, 'Menu item updated successfully');
  } catch (error) {
    console.error('Error updating menu item:', error);
    
    if (error.name === 'ValidationError') {
      const validationError = handleValidationError(error);
      return errorResponse(res, 400, validationError.message, validationError.errors);
    }
    
    errorResponse(res, 500, 'Error updating menu item', error.message);
  }
}

async function DELETE(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const item = await MenuItem.findById(id);
    
    if (!item) {
      return errorResponse(res, 404, 'Menu item not found');
    }
    
    // Soft delete - mark as inactive
    item.isActive = false;
    item.updatedAt = new Date();
    await item.save();
    
    successResponse(res, {}, 'Menu item deleted successfully');
  } catch (error) {
    console.error('Error deleting menu item:', error);
    errorResponse(res, 500, 'Error deleting menu item', error.message);
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