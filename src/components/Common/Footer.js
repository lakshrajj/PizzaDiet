import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Clock, Heart, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Menu', path: '/order' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Refund Policy', path: '/refund-policy' }
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
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
                { name: 'Instagram', icon: <Instagram size={20} />, url: '#', color: 'from-pink-500 to-purple-600' }
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
              {quickLinks.map(link => (
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    className="block text-gray-400 hover:text-orange-500 transition-colors hover:translate-x-2 duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-gray-400 hover:text-orange-500 transition-colors hover:translate-x-2 duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-orange-500">Contact Info</h4>
            <div className="space-y-3 sm:space-y-4 text-gray-400">
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone size={16} className="text-orange-500" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">+91-7840072457</p>
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

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Pizza Diet. Made with <Heart size={12} className="inline text-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;