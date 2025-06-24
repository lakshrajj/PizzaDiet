const { connectToDatabase } = require('../_lib/db');
const { FranchiseApplication } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleRequest } = require('../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const applications = await FranchiseApplication.find()
      .sort({ submittedAt: -1 })
      .select('-__v');
    
    successResponse(res, {
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    errorResponse(res, 500, 'Error fetching applications', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET
  });
}