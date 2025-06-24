import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Gallery from './components/Gallery/Gallery';
import ContactSection from './components/Contact/ContactSection';
import Footer from './components/Common/Footer';
import CartSidebar from './components/Cart/CartSidebar';
import FloatingCart from './components/Cart/FloatingCart';
import SimpleAdminPanel from './components/Admin/SimpleAdminPanel';
import AdminAccess from './components/Admin/AdminAccess';
import Toast from './components/Common/Toast';
import FluidBackground from './components/Common/FluidBackground';
import ScrollBackground from './components/Common/ScrollBackground';
import OrderPage from './pages/OrderPage';
import RefundPolicy from './components/Common/RefundPolicy';
import FranchiseApplication from './components/Franchise/FranchiseApplication';
import { useCart } from './hooks/useCart';
import './styles/globals.css';

const HomePage = () => (
  <>
    <Hero />
    <Gallery />
    <ContactSection />
  </>
);

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);
  
  const cart = useCart();

  // Check for admin URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setShowAdminAccess(true);
    }
  }, []);

  const handleAddToCart = (pizza) => {
    cart.addItem(pizza);
    setToast({ message: 'Added to cart!', type: 'success' });
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setShowAdminAccess(false);
    setIsAdminOpen(true);
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setShowAdminAccess(true);
    }
  };

  return (
    <Router>
      <ThemeProvider>
        <DataProvider>
          <div className="min-h-screen bg-transparent transition-colors duration-300 relative">
            <ScrollBackground />
            <FluidBackground />
            <Header 
              cartItems={cart.getTotalItems()} 
              onCartToggle={() => setIsCartOpen(!isCartOpen)}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showAdminButton={isAdminLoggedIn}
              onAdminClick={handleAdminClick}
            />
            
            <main className="relative z-10">
              <Routes>
                <Route 
                  path="/" 
                  element={<HomePage />} 
                />
                <Route 
                  path="/order" 
                  element={<OrderPage onAddToCart={handleAddToCart} />} 
                />
                <Route 
                  path="/refund-policy" 
                  element={<RefundPolicy />} 
                />
                <Route 
                  path="/franchise" 
                  element={<FranchiseApplication />} 
                />
                <Route 
                  path="/admin" 
                  element={<AdminAccess />} 
                />
              </Routes>
            </main>
            
            <Footer className="relative z-10" />
            
            <FloatingCart 
              cartItems={cart.getTotalItems()} 
              onCartToggle={() => setIsCartOpen(!isCartOpen)} 
            />
            
            <CartSidebar 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
              cart={cart} 
            />

            {showAdminAccess && (
              <AdminAccess onAdminLogin={handleAdminLogin} />
            )}

            {isAdminLoggedIn && (
              <SimpleAdminPanel 
                isOpen={isAdminOpen} 
                onClose={() => setIsAdminOpen(false)} 
              />
            )}

            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        </DataProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;