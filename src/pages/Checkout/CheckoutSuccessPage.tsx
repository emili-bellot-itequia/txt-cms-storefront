import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/Layout/MainLayout';
import { useCart } from '../../contexts/CartContext';

const CheckoutSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  useEffect(() => {
    // Refresh cart so it clears the checked-out cart
    fetchCart();
  }, []);

  return (
    <MainLayout>
      <Container className="py-5 text-center" style={{ maxWidth: 520 }}>
        <FaCheckCircle size={64} className="text-success mb-3" />
        <h2 className="fw-bold mb-2">{t('checkoutSuccess.title')}</h2>
        <p className="text-muted mb-4">{t('checkoutSuccess.message')}</p>
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="primary" onClick={() => navigate('/account/orders')}>{t('checkoutSuccess.viewOrders')}</Button>
          <Button variant="outline-secondary" onClick={() => navigate('/catalog')}>{t('checkoutSuccess.continueShopping')}</Button>
        </div>
      </Container>
    </MainLayout>
  );
};

export default CheckoutSuccessPage;
