const { connectToDatabase } = require('../_lib/db');
const { FranchiseApplication } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleRequest } = require('../_lib/utils');

async function GET(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const application = await FranchiseApplication.findById(id);
    
    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }
    
    successResponse(res, { application });
  } catch (error) {
    console.error('Error fetching application:', error);
    errorResponse(res, 500, 'Error fetching application', error.message);
  }
}

async function PATCH(req, res) {
  try {
    await connectToDatabase();
    
    const { id } = req.query;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'in-review'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status value');
    }
    
    const application = await FranchiseApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }
    
    successResponse(res, { application }, 'Application status updated');
  } catch (error) {
    console.error('Error updating application status:', error);
    errorResponse(res, 500, 'Error updating application', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET,
    PATCH
  });
}