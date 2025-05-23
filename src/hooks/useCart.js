import { useState } from 'react';

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  
  const outlets = {
    'sector17': {
      name: 'Sector 17, Chandigarh',
      phone: '+91 98765 43210',
      address: '123 Food Street, Sector 17, Chandigarh, Punjab 160017'
    },
    'sector22': {
      name: 'Sector 22, Chandigarh', 
      phone: '+91 98765 43211',
      address: '456 Taste Avenue, Sector 22, Chandigarh, Punjab 160022'
    },
    'mohali': {
      name: 'Phase 7, Mohali',
      phone: '+91 98765 43212', 
      address: '789 Pizza Plaza, Phase 7, Mohali, Punjab 160062'
    },
    'panchkula': {
      name: 'Sector 5, Panchkula',
      phone: '+91 98765 43213',
      address: '321 Food Court, Sector 5, Panchkula, Haryana 134109'
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
  const getDeliveryCharge = () => getSubtotal() >= 299 ? 0 : 40;
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

    message += `${'='.repeat(25)}\n*BILL SUMMARY:*\nSubtotal: Rs.${getSubtotal()}\nDelivery: ${getDeliveryCharge() === 0 ? 'FREE' : 'Rs.' + getDeliveryCharge()}\n*Total: Rs.${getTotal()}*\n\nPlease confirm and provide delivery details!`;
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