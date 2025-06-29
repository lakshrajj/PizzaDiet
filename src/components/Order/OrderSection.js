import React from 'react';
import { MessageCircle, Phone, ShoppingBag, ExternalLink } from 'lucide-react';

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
      features: ['Direct Communication', 'Bulk Order Discounts', 'Custom Requirements', '+91 93183 10517'],
      gradient: 'from-blue-500 to-indigo-500',
      action: () => {
        window.location.href = 'tel:+919318310517';
      }
    }
  ];

  const deliveryPartners = [
    {
      name: 'Zomato',
      logo: '/zomato.png',
      description: 'Order through Zomato for special discounts',
      link: 'https://www.zomato.com/pizza-diet',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      name: 'Swiggy',
      logo: '/swiggy.png',
      description: 'Fast delivery with Swiggy',
      link: 'https://www.swiggy.com/pizza-diet',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <section id="order" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 relative overflow-hidden scroll-mt-24">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200/30 dark:bg-red-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title">Order Online</h2>
          <p className="section-subtitle dark:text-gray-300">
            Choose your preferred way to order and experience our premium service
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {orderMethods.map((method, index) => (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/50 dark:border-gray-700/50"
              onClick={method.action}
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${method.gradient} text-white mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {method.icon}
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">{method.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 sm:text-lg leading-relaxed">{method.description}</p>
              
              <ul className="space-y-3 sm:space-y-4">
                {method.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 dark:text-gray-200 sm:text-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <span className="text-white text-xs sm:text-sm font-bold">✓</span>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Partners Section */}
        <div className="text-center mb-8 sm:mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">Our Delivery Partners</h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Order from your favorite food delivery platforms for special offers and quick delivery
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {deliveryPartners.map((partner, index) => (
            <a
              key={index}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center p-6 sm:p-8 ${partner.bgColor} rounded-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex-shrink-0 mr-6">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain" 
                />
              </div>
              <div className="flex-grow">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 flex items-center">
                  {partner.name}
                  <ExternalLink className="ml-2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </h4>
                <p className="text-gray-600 dark:text-gray-300">{partner.description}</p>
              </div>
              <div className={`ml-4 p-3 sm:p-4 rounded-full bg-gradient-to-r ${partner.gradient} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderSection;