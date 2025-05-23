import React, { useState } from 'react';
import { ShoppingCart, X, MapPin, Plus, Minus, Trash2, MessageCircle, Copy } from 'lucide-react';
import Toast from '../Common/Toast';

const CartSidebar = ({ isOpen, onClose, cart }) => {
  const [toast, setToast] = useState(null);

  const handleWhatsApp = () => {
    if (!cart.selectedOutlet) {
      setToast({ message: 'Please select an outlet first!', type: 'error' });
      return;
    }
    
    const message = cart.generateMessage();
    const outlet = cart.outlets[cart.selectedOutlet];
    const phone = outlet.phone.replace(/[^0-9]/g, '');
    const whatsappURL = `https://wa.me/91${phone.startsWith('91') ? phone.slice(2) : phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
    setToast({ message: 'Opening WhatsApp...', type: 'success' });
  };

  const handleCopy = async () => {
    if (!cart.selectedOutlet) {
      setToast({ message: 'Please select an outlet first!', type: 'error' });
      return;
    }

    try {
      await navigator.clipboard.writeText(cart.generateMessage());
      setToast({ message: 'Order copied to clipboard!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Copy failed', type: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ShoppingCart size={24} />
            My Order
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Outlet Selection */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
            <MapPin size={18} />
            Select Outlet
          </h3>
          <select
            value={cart.selectedOutlet}
            onChange={(e) => cart.setSelectedOutlet(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white"
          >
            <option value="">Choose your preferred outlet</option>
            {Object.entries(cart.outlets).map(([key, outlet]) => (
              <option key={key} value={key}>{outlet.name}</option>
            ))}
          </select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-6 opacity-50">🍕</div>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-400">Add some delicious pizzas to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map(item => (
                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                      <p className="text-orange-600 font-medium">{item.sizeName}</p>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <button
                      onClick={() => cart.removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-xl text-orange-600">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{cart.getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Delivery:</span>
                <span className={`font-semibold ${cart.getDeliveryCharge() === 0 ? 'text-green-500' : 'text-gray-800'}`}>
                  {cart.getDeliveryCharge() === 0 ? 'FREE' : `₹${cart.getDeliveryCharge()}`}
                </span>
              </div>
              {cart.getDeliveryCharge() === 0 && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                  🎉 You saved ₹40 on delivery!
                </div>
              )}
              <div className="flex justify-between font-bold text-xl border-t pt-3">
                <span>Total:</span>
                <span className="text-orange-600">₹{cart.getTotal()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleWhatsApp}
                disabled={!cart.selectedOutlet}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 disabled:scale-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <MessageCircle size={24} />
                Order via WhatsApp
              </button>
              <button
                onClick={handleCopy}
                disabled={!cart.selectedOutlet}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 disabled:scale-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <Copy size={24} />
                Copy Message
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default CartSidebar;