const { connectToDatabase } = require('../_lib/db');
const { MenuItem } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleRequest } = require('../_lib/utils');

async function POST(req, res) {
  try {
    await connectToDatabase();
    
    const sampleItem = {
      name: 'Sample Pizza',
      description: 'A delicious sample pizza with fresh ingredients',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
      badge: '🆕 New',
      rating: 4.5,
      category: 'featured',
      sizes: [
        { name: 'Small', price: 199 },
        { name: 'Medium', price: 299 },
        { name: 'Large', price: 399 }
      ],
      isActive: true
    };

    const item = new MenuItem(sampleItem);
    const savedItem = await item.save();
    
    successResponse(res, { item: savedItem }, 'Sample menu item created successfully', 201);
  } catch (error) {
    console.error('Error creating sample menu item:', error);
    errorResponse(res, 500, 'Error creating sample menu item', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    POST
  });
}