import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/Layout/MainLayout';

const CheckoutErrorPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Container className="py-5 text-center" style={{ maxWidth: 520 }}>
        <FaTimesCircle size={64} className="text-danger mb-3" />
        <h2 className="fw-bold mb-2">{t('checkoutError.title')}</h2>
        <p className="text-muted mb-4">{t('checkoutError.message')}</p>
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="primary" onClick={() => navigate('/checkout')}>{t('checkoutError.tryAgain')}</Button>
          <Button variant="outline-secondary" onClick={() => navigate('/catalog')}>{t('checkoutError.continueShopping')}</Button>
        </div>
      </Container>
    </MainLayout>
  );
};

export default CheckoutErrorPage;
