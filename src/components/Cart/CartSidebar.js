import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Copy } from 'lucide-react';
import Toast from '../Common/Toast';

const CartSidebar = ({ isOpen, onClose, cart }) => {
  const [toast, setToast] = useState(null);

  const handleWhatsApp = () => {
    if (!cart.selectedOutlet) {
      setToast({ message: 'Please select an outlet first!', type: 'error' });
      return;
    }
    
    const message = cart.generateMessage();
    const whatsappURL = `https://wa.me/919318310517?text=${encodeURIComponent(message)}`;
    
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

  const getDeliveryFeeText = () => {
    return '₹30';
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ShoppingCart />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Outlet
                </label>
                <select
                  value={cart.selectedOutlet}
                  onChange={(e) => cart.setSelectedOutlet(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select an outlet</option>
                  {Object.entries(cart.outlets).map(([key, outlet]) => (
                    <option key={key} value={key}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {cart.items.map(item => (
                <div key={item.id} className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.sizeName} • ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.extraCheese}
                          onChange={() => cart.toggleAddOn(item.id, 'extraCheese')}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        Extra Cheese (+₹{
                          item.type === 'bogo' 
                            ? cart.addOns.extraCheese.comboPrices[
                                item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium'
                              ] || 0
                            : cart.addOns.extraCheese.prices[item.sizeName]
                        }){item.type === 'bogo' ? ' for both pizzas' : ''}
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.cheeseBurst}
                          onChange={() => cart.toggleAddOn(item.id, 'cheeseBurst')}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        Cheese Burst (+₹{
                          item.type === 'bogo' 
                            ? cart.addOns.cheeseBurst.comboPrices[
                                item.pizza1?.size?.name === 'Large' || item.pizza2?.size?.name === 'Large' ? 'Large' : 'Medium'
                              ] || 0
                            : cart.addOns.cheeseBurst.prices[item.sizeName]
                        }){item.type === 'bogo' ? ' for both pizzas' : ''}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{cart.getItemTotal(item)}
                      </span>
                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{cart.getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charge</span>
                <span>{getDeliveryFeeText()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{cart.getTotal()}</span>
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