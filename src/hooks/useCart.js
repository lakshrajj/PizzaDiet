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
      phone: '+91-9318310517',
      address: 'C-2/166, BLOCK C, YAMUNAVIHAR, SHAHDARA, DELHI-110053'
    },
    'brahmpuri': {
      name: 'Brahmpuri Branch',
      phone: '+91-9318310517', 
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
      }
    },
    cheeseBurst: {
      name: 'Cheese Burst',
      prices: {
        'Small': 50,
        'Medium': 80,
        'Large': 120
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
          if (newItem.extraCheese) newItem.cheeseBurst = false;
        } else if (type === 'cheeseBurst') {
          newItem.cheeseBurst = !item.cheeseBurst;
          if (newItem.cheeseBurst) newItem.extraCheese = false;
        }
        return newItem;
      }
      return item;
    }));
  };

  const calculateItemTotal = (item) => {
    let total = item.price;
    if (item.extraCheese) {
      total += addOns.extraCheese.prices[item.sizeName];
    }
    if (item.cheeseBurst) {
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
      let itemDesc = `${index + 1}. *${item.name}*\n   Size: ${item.sizeName}\n`;
      
      if (item.extraCheese) {
        itemDesc += `   + Extra Cheese (₹${addOns.extraCheese.prices[item.sizeName]})\n`;
      }
      if (item.cheeseBurst) {
        itemDesc += `   + Cheese Burst (₹${addOns.cheeseBurst.prices[item.sizeName]})\n`;
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