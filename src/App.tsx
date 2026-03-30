import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import HomePage from './pages/Catalog/HomePage';
import ProductDetailPage from './pages/Catalog/ProductDetailPage';
import VariantDetailPage from './pages/Catalog/VariantDetailPage';
import PageCatalogPage from './pages/Catalog/PageCatalogPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import CheckoutSuccessPage from './pages/Checkout/CheckoutSuccessPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AccountPage from './pages/Account/AccountPage';
import OrdersPage from './pages/Account/OrdersPage';
import OrderDetailPage from './pages/Account/OrderDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/catalog" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/variant/:id" element={<VariantDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/pages/:slug" element={<PageCatalogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected (Customer) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/orders" element={<OrdersPage />} />
              <Route path="/account/orders/:id" element={<OrderDetailPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/catalog" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
