const { connectToDatabase } = require('../_lib/db');
const { FranchiseApplication } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleValidationError, handleRequest } = require('../_lib/utils');

async function POST(req, res) {
  try {
    await connectToDatabase();
    
    console.log('Received franchise application:', req.body);
    
    const application = new FranchiseApplication(req.body);
    const savedApplication = await application.save();
    
    console.log('Franchise application saved to MongoDB:', savedApplication._id);
    
    successResponse(res, {
      applicationId: savedApplication._id
    }, 'Franchise application submitted successfully', 201);
  } catch (error) {
    console.error('Error saving franchise application:', error);
    
    if (error.name === 'ValidationError') {
      const validationError = handleValidationError(error);
      return errorResponse(res, 400, validationError.message, validationError.errors);
    }
    
    errorResponse(res, 500, 'Internal server error', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    POST
  });
}