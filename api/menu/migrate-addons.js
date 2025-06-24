const { connectToDatabase } = require('../_lib/db');
const { MenuItem } = require('../_lib/models');
const { corsMiddleware, runMiddleware, errorResponse, successResponse, handleRequest } = require('../_lib/utils');

async function POST(req, res) {
  try {
    await connectToDatabase();
    
    // Define the standard add-ons that were previously hardcoded
    const standardAddOns = [
      {
        name: 'Extra Cheese',
        price: 60, // Medium price as base
        category: 'Extra',
        isActive: true
      },
      {
        name: 'Cheese Burst',
        price: 80, // Medium price as base
        category: 'Extra', 
        isActive: true
      }
    ];
    
    // Get all menu items that don't have these add-ons yet
    const menuItems = await MenuItem.find({ 
      isActive: true,
      $or: [
        { addOns: { $exists: false } },
        { addOns: { $size: 0 } },
        { 
          addOns: { 
            $not: { 
              $elemMatch: { 
                name: { $in: ['Extra Cheese', 'Cheese Burst'] } 
              } 
            } 
          } 
        }
      ]
    });
    
    let updatedCount = 0;
    
    for (const item of menuItems) {
      // Skip if item already has these add-ons
      const existingAddOnNames = (item.addOns || []).map(addon => addon.name);
      const addOnsToAdd = standardAddOns.filter(addon => 
        !existingAddOnNames.includes(addon.name)
      );
      
      if (addOnsToAdd.length > 0) {
        const updatedAddOns = [...(item.addOns || []), ...addOnsToAdd];
        
        await MenuItem.findByIdAndUpdate(
          item._id,
          { 
            addOns: updatedAddOns,
            updatedAt: new Date()
          },
          { new: true }
        );
        
        updatedCount++;
      }
    }
    
    successResponse(res, {
      message: `Migration completed successfully`,
      updatedItems: updatedCount,
      totalItems: menuItems.length,
      addedAddOns: standardAddOns.map(addon => addon.name)
    });
    
  } catch (error) {
    console.error('Error migrating add-ons:', error);
    errorResponse(res, 500, 'Error migrating add-ons', error.message);
  }
}

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);
  
  await handleRequest(req, res, {
    POST
  });
}