import React, { useEffect } from 'react';
import Header from './Header/Header';
import Footer from './Footer';
import CartDrawer from '../Cart/CartDrawer/CartDrawer';
import CookieBanner from '../CookieBanner/CookieBanner';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 mb-3">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
    </div>
  );
};

export default MainLayout;
