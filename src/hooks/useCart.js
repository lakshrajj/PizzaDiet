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

  const addOns = {
    extraCheese: {
      name: 'Extra Cheese',
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
    cheeseBurst: {
      name: 'Cheese Burst',
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

  const toggleAddOn = (id, type) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item };
        if (type === 'extraCheese') {
          newItem.extraCheese = !item.extraCheese;
        } else if (type === 'cheeseBurst') {
          newItem.cheeseBurst = !item.cheeseBurst;
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
      if (item.extraCheese) {
        // Use combo pricing - determine size from BOGO deal
        const size = item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium';
        total += addOns.extraCheese.comboPrices[size] || 0;
      }
      if (item.cheeseBurst) {
        // Use combo pricing - determine size from BOGO deal
        const size = item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium';
        total += addOns.cheeseBurst.comboPrices[size] || 0;
      }
      return total * item.quantity;
    }
    
    // For regular combos, price is already calculated
    if (item.type === 'combo') {
      return total * item.quantity;
    }
    
    // For regular pizzas, add standard add-ons pricing
    if (item.extraCheese && item.sizeName) {
      total += addOns.extraCheese.prices[item.sizeName];
    }
    if (item.cheeseBurst && item.sizeName) {
      total += addOns.cheeseBurst.prices[item.sizeName];
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
        if (item.extraCheese || item.cheeseBurst) {
          const size = item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium';
          if (item.extraCheese) {
            itemDesc += `   + Extra Cheese for both pizzas (₹${addOns.extraCheese.comboPrices[size]})\n`;
          }
          if (item.cheeseBurst) {
            itemDesc += `   + Cheese Burst for both pizzas (₹${addOns.cheeseBurst.comboPrices[size]})\n`;
          }
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
        if (item.extraCheese) {
          itemDesc += `   + Extra Cheese (₹${addOns.extraCheese.prices[item.sizeName]})\n`;
        }
        if (item.cheeseBurst) {
          itemDesc += `   + Cheese Burst (₹${addOns.cheeseBurst.prices[item.sizeName]})\n`;
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
    addOns,
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