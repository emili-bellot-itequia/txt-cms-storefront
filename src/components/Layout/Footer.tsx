import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="storefront-footer mt-5">
    <Container>
      <Row className="py-4">
        <Col md={4} className="mb-3">
          <h6 className="fw-bold">TXT Shop</h6>
          <p className="text-muted small mb-0">Tu tienda de confianza.</p>
        </Col>
        <Col md={4} className="mb-3">
          <h6 className="fw-bold">Información</h6>
          <ul className="list-unstyled small">
            <li><Link to="/catalog" className="footer-link">Catálogo</Link></li>
            <li><Link to="/account" className="footer-link">Mi cuenta</Link></li>
            <li><Link to="/account/orders" className="footer-link">Mis pedidos</Link></li>
          </ul>
        </Col>
        <Col md={4} className="mb-3">
          <h6 className="fw-bold">Ayuda</h6>
          <ul className="list-unstyled small text-muted">
            <li>Envíos en 24-48h</li>
            <li>Devoluciones gratuitas</li>
          </ul>
        </Col>
      </Row>
      <hr />
      <p className="text-center text-muted small py-2 mb-0">
        © {new Date().getFullYear()} TXT Shop. Todos los derechos reservados.
      </p>
    </Container>
  </footer>
);

export default Footer;
