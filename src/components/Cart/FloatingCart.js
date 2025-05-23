import React from 'react';
import { ShoppingCart } from 'lucide-react';

const FloatingCart = ({ cartItems, onCartToggle }) => {
  if (cartItems === 0) return null;

  return (
    <button
      onClick={onCartToggle}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center animate-pulse"
    >
      <ShoppingCart size={24} />
      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold animate-bounce border-2 border-white">
        {cartItems}
      </span>
    </button>
  );
};

export default FloatingCart;