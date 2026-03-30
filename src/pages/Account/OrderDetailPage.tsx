import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '../../components/Layout/MainLayout';
import { getOrderDetail } from '../../services/profileService';
import type { StorefrontOrderDetail } from '../../types';

const statusVariant: Record<string, string> = {
  Pending: 'warning', Confirmed: 'primary', Processing: 'info',
  Shipped: 'secondary', Delivered: 'success', Cancelled: 'danger',
};
const statusLabel: Record<string, string> = {
  Pending: 'Pendiente', Confirmed: 'Confirmado', Processing: 'En proceso',
  Shipped: 'Enviado', Delivered: 'Entregado', Cancelled: 'Cancelado',
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<StorefrontOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderDetail(Number(id))
      .then(setOrder)
      .catch(() => navigate('/account/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><div className="text-center py-5"><Spinner animation="border" variant="primary" /></div></MainLayout>;
  if (!order) return null;

  return (
    <MainLayout>
      <Container className="py-4">
        <Button variant="link" className="p-0 text-muted mb-3" onClick={() => navigate('/account/orders')}>
          <FaArrowLeft className="me-1" /> Volver a pedidos
        </Button>

        <div className="d-flex align-items-center gap-3 mb-4">
          <h2 className="fw-bold mb-0">Pedido #{order.id}</h2>
          <Badge bg={statusVariant[order.status] ?? 'secondary'} className="fs-6">
            {statusLabel[order.status] ?? order.status}
          </Badge>
        </div>

        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <h6 className="fw-semibold mb-2">Información</h6>
                <div className="text-muted small">Fecha: {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                {order.notes && <div className="text-muted small mt-1">Notas: {order.notes}</div>}
              </Card.Body>
            </Card>
          </Col>
          {order.shippingAddress && (
            <Col md={6} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <h6 className="fw-semibold mb-2">Dirección de envío</h6>
                  <div className="text-muted small">
                    <div>{order.shippingAddress.recipientName}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.postalCode} {order.shippingAddress.city}</div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        <Card>
          <Card.Body>
            <h6 className="fw-semibold mb-3">Productos</h6>
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">P. unit.</th>
                  <th className="text-end">Dto.</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line, i) => (
                  <tr key={i}>
                    <td>
                      <div className="fw-semibold small">{line.productName}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>{line.productCode}</div>
                    </td>
                    <td className="text-center">{line.quantity}</td>
                    <td className="text-end">€{line.unitPrice.toFixed(2)}</td>
                    <td className="text-end">{line.discountPercent > 0 ? `${line.discountPercent}%` : '—'}</td>
                    <td className="text-end fw-semibold">€{line.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-end fw-bold fs-5">Total</td>
                  <td className="text-end fw-bold fs-5">€{order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default OrderDetailPage;
