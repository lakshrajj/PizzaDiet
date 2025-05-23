import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Settings } from 'lucide-react';

const Header = ({ cartItems, onCartToggle, isMenuOpen, setIsMenuOpen, showAdminButton, onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#order', label: 'Order' },
    { href: '#menu', label: 'Menu' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl py-3 border-b border-orange-100' 
        : 'bg-white/90 backdrop-blur-sm py-6'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl animate-bounce">🍕</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Pizza Diet
          </div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-10">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="relative text-gray-700 hover:text-orange-500 transition-all duration-300 font-semibold group">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {showAdminButton && (
            <button
              onClick={onAdminClick}
              className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <Settings size={20} />
            </button>
          )}
          
          <button
            onClick={onCartToggle}
            className="relative p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <ShoppingCart size={20} className="group-hover:animate-pulse" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce border-2 border-white">
                {cartItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-orange-100 shadow-xl">
          <div className="px-6 py-6 space-y-4">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="block text-gray-700 hover:text-orange-500 transition-colors font-semibold py-3 border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;