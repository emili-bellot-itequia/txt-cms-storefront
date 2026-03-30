import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { useCart } from '../../contexts/CartContext';

const CheckoutSuccessPage: React.FC = () => {
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
        <h2 className="fw-bold mb-2">¡Pedido recibido!</h2>
        <p className="text-muted mb-4">
          Gracias por tu compra. Recibirás un email de confirmación en breve.
          Puedes seguir el estado de tu pedido desde tu cuenta.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="primary" onClick={() => navigate('/account/orders')}>Ver mis pedidos</Button>
          <Button variant="outline-secondary" onClick={() => navigate('/catalog')}>Seguir comprando</Button>
        </div>
      </Container>
    </MainLayout>
  );
};

export default CheckoutSuccessPage;
