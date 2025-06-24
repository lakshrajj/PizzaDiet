const { connectToDatabase } = require('../_lib/db');
const { Offer } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleValidationError, handleRequest } = require('../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const offers = await Offer.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    successResponse(res, { offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    errorResponse(res, 500, 'Error fetching offers', error.message);
  }
}

async function POST(req, res) {
  try {
    await connectToDatabase();
    
    const offer = new Offer({
      ...req.body,
      updatedAt: new Date()
    });
    
    const savedOffer = await offer.save();
    
    successResponse(res, { offer: savedOffer }, 'Offer created successfully', 201);
  } catch (error) {
    console.error('Error creating offer:', error);
    
    if (error.name === 'ValidationError') {
      const validationError = handleValidationError(error);
      return errorResponse(res, 400, validationError.message, validationError.errors);
    }
    
    errorResponse(res, 500, 'Error creating offer', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET,
    POST
  });
}