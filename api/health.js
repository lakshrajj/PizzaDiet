const { corsMiddleware, runMiddleware, successResponse, handleRequest } = require('./_lib/utils');

async function GET(req, res) {
  successResponse(res, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  }, 'Server is running');
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    GET
  });
}