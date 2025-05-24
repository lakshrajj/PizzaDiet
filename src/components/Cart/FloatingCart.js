import React from 'react';
import { ShoppingCart } from 'lucide-react';

const FloatingCart = ({ cartItems, onCartToggle }) => {
  if (cartItems === 0) return null;

  return (
    <button
      onClick={onCartToggle}
      className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center group"
    >
      <ShoppingCart size={20} className="group-hover:animate-pulse" />
      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce border-2 border-white dark:border-gray-800">
        {cartItems}
      </span>
    </button>
  );
};

export default FloatingCart;