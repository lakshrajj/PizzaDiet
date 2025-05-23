import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 p-4 rounded-xl text-white z-50 shadow-2xl animate-slide-in max-w-sm ${
      type === 'success' 
        ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
        : 'bg-gradient-to-r from-red-500 to-pink-500'
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;