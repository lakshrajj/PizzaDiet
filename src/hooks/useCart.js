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

  const addItem = (pizza) => {
    const existingIndex = items.findIndex(item => 
      item.name === pizza.name && item.size === pizza.size
    );

    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([...items, { ...pizza, id: Date.now(), quantity: 1 }]);
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

  const getSubtotal = () => items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const getDeliveryCharge = () => 30; // Flat delivery charge of ₹30

  const getTotal = () => getSubtotal() + getDeliveryCharge();
  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

  const generateMessage = () => {
    if (!selectedOutlet || items.length === 0) return '';
    
    const outlet = outlets[selectedOutlet];
    let message = `*PIZZA DIET ORDER*\n\n`;
    message += `*Outlet:* ${outlet.name}\n*Phone:* ${outlet.phone}\n\n*ORDER DETAILS:*\n${'='.repeat(25)}\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n   Size: ${item.sizeName}\n   Qty: ${item.quantity} x Rs.${item.price} = Rs.${item.price * item.quantity}\n\n`;
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
    addItem,
    removeItem,
    updateQuantity,
    setSelectedOutlet,
    getSubtotal,
    getDeliveryCharge,
    getTotal,
    getTotalItems,
    generateMessage,
    clearCart
  };
};