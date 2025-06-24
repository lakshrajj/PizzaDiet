import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ cartItems, onCartToggle, isMenuOpen, setIsMenuOpen, showAdminButton, onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/order', label: 'Menu & Order' },
    { href: '/#gallery', label: 'Gallery' },
    { href: '/#contact', label: 'Contact' },
    { href: '/franchise', label: 'Franchise' },
    { href: '/admin', label: 'Admin', icon: Settings }
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('/#')) {
      const element = document.getElementById(href.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-dark-secondary/95 backdrop-blur-xl shadow-xl py-2 border-b border-orange-100 dark:border-purple-500/30' 
        : 'bg-white/90 dark:bg-dark-primary/90 backdrop-blur-sm py-3'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl animate-bounce">🍕</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Pizza Diet
            </div>
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map(item => (
            item.href.startsWith('/#') ? (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="relative text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-dark-orange transition-all duration-300 font-semibold group text-sm"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className={`relative text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-dark-orange transition-all duration-300 font-semibold group text-sm ${
                  location.pathname === item.href ? 'text-orange-500 dark:text-dark-orange' : ''
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ${
                  location.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300 shadow-lg ${
              darkMode 
                ? 'bg-gradient-to-r from-dark-purple to-dark-blue text-dark-text' 
                : 'bg-gradient-to-r from-orange-400 to-amber-300 text-white'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} className="animate-pulse" /> : <Moon size={16} className="animate-pulse" />}
          </button>

          {showAdminButton && (
            <button
              onClick={onAdminClick}
              className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              aria-label="Admin settings"
            >
              <Settings size={16} />
            </button>
          )}
          
          <button
            onClick={onCartToggle}
            className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={16} className="group-hover:animate-pulse" />
            {cartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-bounce border-2 border-white dark:border-gray-800">
                {cartItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-dark-secondary/95 backdrop-blur-xl border-t border-orange-100 dark:border-purple-500/30 shadow-xl">
          <div className="px-6 py-6 space-y-4">
            {navItems.map(item => (
              item.href.startsWith('/#') ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-dark-pink transition-colors font-semibold py-3 border-b border-gray-100 dark:border-purple-500/20"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-dark-pink transition-colors font-semibold py-3 border-b border-gray-100 dark:border-purple-500/20 ${
                    location.pathname === item.href ? 'text-orange-500 dark:text-dark-orange' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;