const { connectToDatabase } = require('../_lib/db');
const { Offer } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleRequest } = require('../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const offers = await Offer.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    successResponse(res, { offers });
  } catch (error) {
    console.error('Error fetching all offers:', error);
    errorResponse(res, 500, 'Error fetching offers', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET
  });
}