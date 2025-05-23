import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const OrderSection = () => {
  const orderMethods = [
    {
      icon: <MessageCircle className="w-10 h-10" />,
      title: 'Order via WhatsApp',
      description: 'Direct communication with our smart cart system',
      features: ['Instant Order Processing', 'Custom Modifications', 'Real-time Updates', 'Multiple Outlet Support'],
      gradient: 'from-green-500 to-emerald-500',
      action: () => {
        const menuSection = document.getElementById('menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: <Phone className="w-10 h-10" />,
      title: 'Call to Order',
      description: 'Personal service with expert recommendations',
      features: ['Direct Communication', 'Bulk Order Discounts', 'Custom Requirements', '+91 98765 43210'],
      gradient: 'from-blue-500 to-indigo-500',
      action: () => {
        window.location.href = 'tel:+919876543210';
      }
    }
  ];

  return (
    <section id="order" className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden scroll-mt-24">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Order Online</h2>
          <p className="section-subtitle">
            Choose your preferred way to order and experience our premium service
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {orderMethods.map((method, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/50"
              onClick={method.action}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${method.gradient} text-white mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {method.icon}
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-gray-800">{method.title}</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{method.description}</p>
              
              <ul className="space-y-4">
                {method.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 text-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderSection;