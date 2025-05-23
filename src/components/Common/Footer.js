import React from 'react';
import { Phone, Clock, Heart, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl sm:text-4xl">🍕</div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Pizza Diet
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Crafting delicious vegetarian pizzas with love and passion since 2020. Your satisfaction is our priority.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {[
                { name: 'Facebook', icon: <Facebook size={20} />, url: '#', color: 'from-blue-500 to-blue-600' },
                { name: 'Instagram', icon: <Instagram size={20} />, url: '#', color: 'from-pink-500 to-purple-600' },
                { name: 'Twitter', icon: <Twitter size={20} />, url: '#', color: 'from-blue-400 to-blue-500' },
                { name: 'YouTube', icon: <Youtube size={20} />, url: '#', color: 'from-red-600 to-red-700' }
              ].map(platform => (
                <a
                  key={platform.name}
                  href={platform.url}
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}
                  aria-label={platform.name}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-orange-500">Quick Links</h4>
            <div className="space-y-2 sm:space-y-3">
              {['Home', 'Gallery', 'Menu', 'Order', 'Contact'].map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-gray-400 hover:text-orange-500 transition-colors hover:translate-x-2 duration-300 text-sm sm:text-base"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-orange-500">Our Locations</h4>
            <div className="space-y-2 sm:space-y-3 text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div className="text-sm sm:text-base">
                  <p>Sector 17, Chandigarh</p>
                  <p>Sector 22, Chandigarh</p>
                  <p>Phase 7, Mohali</p>
                  <p>Sector 5, Panchkula</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-orange-500">Contact Info</h4>
            <div className="space-y-3 sm:space-y-4 text-gray-400">
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone size={16} className="text-orange-500" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">+91 98765 43210</p>
                  <p className="text-xs sm:text-sm">Call for orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock size={16} className="text-orange-500" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">10:00 AM - 11:00 PM</p>
                  <p className="text-xs sm:text-sm">Daily | Always Fresh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-center md:text-left text-xs sm:text-sm">
              &copy; {currentYear} Pizza Diet. All rights reserved. Made with <Heart className="inline w-3 h-3 sm:w-4 sm:h-4 text-red-500 mx-1" /> for pizza lovers.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <a href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</a>
              <a href="/refund" className="hover:text-orange-500 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;