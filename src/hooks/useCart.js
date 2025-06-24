import { useState } from 'react';

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  
  const outlets = {
    'babarpur': {
      name: 'Babarpur Branch',
      phone: '+91-9318310517',
      address: 'W-117, MAIN ROAD BABARPUR, SHAHDARA, DELHI-110032'
    },
    'yamunavihar': {
      name: 'Yamuna Vihar Branch', 
      phone: '+91-7840073405',
      address: 'C-2/166, BLOCK C, YAMUNAVIHAR, SHAHDARA, DELHI-110053'
    },
    'brahmpuri': {
      name: 'Brahmpuri Branch',
      phone: '+91-7840073405', 
      address: 'B-217, BRAHAMPURI RD, CHAUHAN BANGER, SHAHDARA, DELHI-110053'
    },
    'dayalpur': {
      name: 'Dayalpur Branch',
      phone: '+91-9318310517',
      address: 'F-11, KARAWAL NAGAR MAIN RD, BLOCK-D, DAYALPUR, KARAWAL NAGAR, DELHI-110094'
    }
  };

  // Legacy add-ons configuration for BOGO/Combo pricing (will be deprecated)
  const legacyAddOnPricing = {
    'Extra Cheese': {
      prices: {
        'Small': 40,
        'Medium': 60,
        'Large': 80
      },
      comboPrices: {
        'Medium': 120,  // For both pizzas in combo
        'Large': 160    // For both pizzas in combo
      }
    },
    'Cheese Burst': {
      prices: {
        'Small': 50,
        'Medium': 80,
        'Large': 120
      },
      comboPrices: {
        'Medium': 160,  // For both pizzas in combo
        'Large': 240    // For both pizzas in combo
      }
    }
  };

  // Helper function to get add-on price based on size and type
  const getAddOnPrice = (addOnName, size, isCombo = false) => {
    const pricing = legacyAddOnPricing[addOnName];
    if (!pricing) return 0;
    
    if (isCombo) {
      return pricing.comboPrices[size] || pricing.comboPrices['Medium'] || 0;
    } else {
      return pricing.prices[size] || 0;
    }
  };

  const addItem = (pizza) => {
    const existingIndex = items.findIndex(item => 
      item.name === pizza.name && 
      item.size === pizza.size &&
      item.extraCheese === pizza.extraCheese &&
      item.cheeseBurst === pizza.cheeseBurst
    );

    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([...items, { 
        ...pizza, 
        id: Date.now(), 
        quantity: 1,
        extraCheese: pizza.extraCheese || false,
        cheeseBurst: pizza.cheeseBurst || false
      }]);
    }
  };

  const removeItem = (id) => setItems(items.filter(item => item.id !== id));
  
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const toggleAddOn = (id, addOnName) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item };
        
        // Handle legacy add-ons (for backward compatibility)
        if (addOnName === 'Extra Cheese') {
          newItem.extraCheese = !item.extraCheese;
        } else if (addOnName === 'Cheese Burst') {
          newItem.cheeseBurst = !item.cheeseBurst;
        }
        
        // Handle dynamic add-ons from the new system
        if (!newItem.selectedAddOns) {
          newItem.selectedAddOns = [];
        }
        
        const existingIndex = newItem.selectedAddOns.findIndex(addon => addon.name === addOnName);
        if (existingIndex >= 0) {
          // Remove add-on
          newItem.selectedAddOns = newItem.selectedAddOns.filter(addon => addon.name !== addOnName);
        } else {
          // Add add-on (find it in the item's available add-ons or use default pricing)
          const availableAddOn = item.addOns?.find(addon => addon.name === addOnName);
          if (availableAddOn) {
            newItem.selectedAddOns.push(availableAddOn);
          }
        }
        
        return newItem;
      }
      return item;
    }));
  };

  const calculateItemTotal = (item) => {
    let total = item.price;
    
    // For BOGO offers, add combo pricing for add-ons
    if (item.type === 'bogo') {
      const size = item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium';
      
      // Legacy add-ons
      if (item.extraCheese) {
        total += getAddOnPrice('Extra Cheese', size, true);
      }
      if (item.cheeseBurst) {
        total += getAddOnPrice('Cheese Burst', size, true);
      }
      
      // Dynamic add-ons - use combo pricing if available
      if (item.selectedAddOns) {
        item.selectedAddOns.forEach(addOn => {
          total += getAddOnPrice(addOn.name, size, true) || addOn.price;
        });
      }
      
      return total * item.quantity;
    }
    
    // For regular combos, price is already calculated
    if (item.type === 'combo') {
      return total * item.quantity;
    }
    
    // For regular pizzas, add standard add-ons pricing
    if (item.extraCheese && item.sizeName) {
      total += getAddOnPrice('Extra Cheese', item.sizeName);
    }
    if (item.cheeseBurst && item.sizeName) {
      total += getAddOnPrice('Cheese Burst', item.sizeName);
    }
    
    // Add dynamic add-ons pricing
    if (item.selectedAddOns) {
      item.selectedAddOns.forEach(addOn => {
        // Use legacy pricing if available, otherwise use the add-on's base price
        const legacyPrice = getAddOnPrice(addOn.name, item.sizeName);
        total += legacyPrice || addOn.price;
      });
    }
    
    return total * item.quantity;
  };

  const getSubtotal = () => items.reduce((total, item) => total + calculateItemTotal(item), 0);
  
  const getDeliveryCharge = () => 30; // Flat delivery charge of ₹30

  const getTotal = () => getSubtotal() + getDeliveryCharge();
  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

  const generateMessage = () => {
    if (!selectedOutlet || items.length === 0) return '';
    
    const outlet = outlets[selectedOutlet];
    let message = `*PIZZA DIET ORDER*\n\n`;
    message += `*Outlet:* ${outlet.name}\n*Phone:* ${outlet.phone}\n\n*ORDER DETAILS:*\n${'='.repeat(25)}\n`;

    items.forEach((item, index) => {
      let itemDesc = `${index + 1}. *${item.name}*\n`;
      
      // Handle different item types
      if (item.type === 'bogo') {
        itemDesc += `   🎉 BOGO Deal\n`;
        itemDesc += `   Pizza 1: ${item.pizza1.name} (${item.pizza1.size.name})\n`;
        itemDesc += `   Pizza 2: ${item.pizza2.name} (${item.pizza2.size.name})\n`;
        
        // Add combo add-ons for BOGO
        const size = item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium';
        
        // Legacy add-ons
        if (item.extraCheese) {
          itemDesc += `   + Extra Cheese for both pizzas (₹${getAddOnPrice('Extra Cheese', size, true)})\n`;
        }
        if (item.cheeseBurst) {
          itemDesc += `   + Cheese Burst for both pizzas (₹${getAddOnPrice('Cheese Burst', size, true)})\n`;
        }
        
        // Dynamic add-ons
        if (item.selectedAddOns) {
          item.selectedAddOns.forEach(addOn => {
            const price = getAddOnPrice(addOn.name, size, true) || addOn.price;
            itemDesc += `   + ${addOn.name} for both pizzas (₹${price})\n`;
          });
        }
        
        itemDesc += `   Original Price: Rs.${item.originalPrice}\n`;
        itemDesc += `   You Save: Rs.${item.savings}\n`;
      } else if (item.type === 'combo') {
        itemDesc += `   📦 Combo Deal\n`;
        itemDesc += `   ${item.description}\n`;
        itemDesc += `   Original Value: Rs.${item.originalPrice}\n`;
        itemDesc += `   You Save: Rs.${item.savings}\n`;
      } else {
        itemDesc += `   Size: ${item.sizeName}\n`;
        
        // Legacy add-ons
        if (item.extraCheese) {
          itemDesc += `   + Extra Cheese (₹${getAddOnPrice('Extra Cheese', item.sizeName)})\n`;
        }
        if (item.cheeseBurst) {
          itemDesc += `   + Cheese Burst (₹${getAddOnPrice('Cheese Burst', item.sizeName)})\n`;
        }
        
        // Dynamic add-ons
        if (item.selectedAddOns) {
          item.selectedAddOns.forEach(addOn => {
            const price = getAddOnPrice(addOn.name, item.sizeName) || addOn.price;
            itemDesc += `   + ${addOn.name} (₹${price})\n`;
          });
        }
      }
      
      const itemTotal = calculateItemTotal(item);
      itemDesc += `   Qty: ${item.quantity} x Rs.${itemTotal/item.quantity} = Rs.${itemTotal}\n\n`;
      message += itemDesc;
    });

    message += `${'='.repeat(25)}\n*BILL SUMMARY:*\nSubtotal: Rs.${getSubtotal()}\nDelivery: Rs.${getDeliveryCharge()}\n*Total: Rs.${getTotal()}*\n\nPlease confirm and provide delivery details!`;
    return message;
  };

  const clearCart = () => {
    setItems([]);
  };

  return {
    items,
    selectedOutlet,
    outlets,
    legacyAddOnPricing, // For backward compatibility  
    getAddOnPrice,
    addItem,
    removeItem,
    updateQuantity,
    toggleAddOn,
    setSelectedOutlet,
    getSubtotal,
    getDeliveryCharge,
    getTotal,
    getTotalItems,
    getItemTotal: calculateItemTotal,
    generateMessage,
    clearCart
  };
};