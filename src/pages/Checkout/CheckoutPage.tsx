import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { checkout } from '../../services/cartService';
import { getProfile } from '../../services/profileService';
import { getApplicableShippingRate, type ApplicableShippingRate } from '../../services/shippingService';
import type { CustomerAddress } from '../../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm: React.FC<{
  clientSecret: string;
  amount: number;
  shippingCost: number;
  currency: string;
  onSuccess: () => void;
}> = ({ amount, shippingCost, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = amount - shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Error procesando el pago');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 p-3 bg-light rounded small">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Subtotal productos</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Gastos de envío</span>
          <span>{shippingCost === 0 ? <span className="text-success">Gratis</span> : `€${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold border-top pt-1 mt-1">
          <span>Total</span>
          <span>€{amount.toFixed(2)}</span>
        </div>
      </div>
      <PaymentElement className="mb-3" />
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}
      <Button type="submit" variant="primary" size="lg" className="w-100" disabled={!stripe || processing}>
        {processing
          ? <><Spinner size="sm" animation="border" className="me-2" />Procesando...</>
          : `Pagar €${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const { cart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [shippingId, setShippingId] = useState<number | undefined>();
  const [billingId, setBillingId] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [confirmedShippingCost, setConfirmedShippingCost] = useState(0);
  const [currency, setCurrency] = useState('eur');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [shippingRate, setShippingRate] = useState<ApplicableShippingRate | null | undefined>(undefined);
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchCart();
    getProfile().then(p => {
      setAddresses(p.addresses);
      const def = p.addresses.find(a => a.isDefault);
      if (def) { setShippingId(def.id); setBillingId(def.id); }
    }).catch(() => {});
  }, [isAuthenticated]);

  // Fetch shipping rate whenever shipping address or cart changes
  useEffect(() => {
    if (!shippingId || !cart?.items?.length) {
      setShippingRate(undefined);
      return;
    }
    const addr = addresses.find(a => a.id === shippingId);
    if (!addr?.country) { setShippingRate(undefined); return; }

    const cartSubtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    setShippingLoading(true);
    getApplicableShippingRate(addr.country, cartSubtotal).then(rate => {
      setShippingRate(rate);
    }).finally(() => setShippingLoading(false));
  }, [shippingId, addresses, cart]);

  const cartSubtotal = cart?.items.reduce((sum, i) => sum + i.subtotal, 0) ?? 0;
  const estimatedShipping = shippingRate?.shippingCost ?? 0;
  const estimatedTotal = cartSubtotal + estimatedShipping;

  const handleProceedToPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await checkout({ shippingAddressId: shippingId, billingAddressId: billingId, notes: notes || undefined });
      setClientSecret(res.clientSecret);
      setAmount(res.amount);
      setConfirmedShippingCost(res.shippingCost ?? 0);
      setCurrency(res.currency);
      setStep('payment');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'Error al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;
  if (!cart?.items?.length) return (
    <MainLayout>
      <Container className="py-5 text-center">
        <p className="text-muted">Tu carrito está vacío.</p>
        <Button variant="primary" onClick={() => navigate('/catalog')}>Ver catálogo</Button>
      </Container>
    </MainLayout>
  );

  return (
    <MainLayout>
      <Container className="py-4" style={{ maxWidth: 860 }}>
        <h2 className="fw-bold mb-4">Finalizar compra</h2>

        <Row>
          {/* Left: details or payment */}
          <Col lg={7} className="mb-4">
            {step === 'details' ? (
              <Card>
                <Card.Body>
                  <h5 className="fw-bold mb-3">Envío y facturación</h5>

                  {addresses.length === 0 ? (
                    <Alert variant="info">
                      No tienes direcciones guardadas.{' '}
                      <Button variant="link" className="p-0" onClick={() => navigate('/account')}>Añadir dirección</Button>
                    </Alert>
                  ) : (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Dirección de envío</Form.Label>
                        <Form.Select value={shippingId ?? ''} onChange={e => setShippingId(Number(e.target.value))}>
                          <option value="">-- Seleccionar --</option>
                          {addresses.map(a => (
                            <option key={a.id} value={a.id}>{a.alias} — {a.street}, {a.city}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Dirección de facturación</Form.Label>
                        <Form.Select value={billingId ?? ''} onChange={e => setBillingId(Number(e.target.value))}>
                          <option value="">-- Igual que envío --</option>
                          {addresses.map(a => (
                            <option key={a.id} value={a.id}>{a.alias} — {a.street}, {a.city}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Notas del pedido</Form.Label>
                    <Form.Control as="textarea" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instrucciones especiales..." />
                  </Form.Group>

                  {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                  <Button variant="primary" size="lg" className="w-100" onClick={handleProceedToPayment} disabled={loading || !shippingId}>
                    {loading ? <><Spinner size="sm" animation="border" className="me-2" />Cargando...</> : 'Ir al pago'}
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <Card.Body>
                  <h5 className="fw-bold mb-3">Pago seguro</h5>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <PaymentForm
                      clientSecret={clientSecret}
                      amount={amount}
                      shippingCost={confirmedShippingCost}
                      currency={currency}
                      onSuccess={() => navigate('/checkout/success')}
                    />
                  </Elements>
                  <Button variant="link" className="mt-2 p-0 text-muted" onClick={() => setStep('details')}>← Volver a los detalles</Button>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Right: order summary */}
          <Col lg={5}>
            <Card className="sticky-top" style={{ top: 90 }}>
              <Card.Body>
                <h5 className="fw-bold mb-3">Resumen del pedido</h5>
                {cart.items.map(item => (
                  <div key={item.id} className="d-flex justify-content-between small mb-1">
                    <span className="text-muted">{item.productName} x{item.quantity}m</span>
                    <span>€{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <hr className="my-2" />

                {step === 'payment' ? (
                  // Use backend-confirmed amounts (discount already applied)
                  <>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">Subtotal</span>
                      <span>€{(amount - confirmedShippingCost).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Gastos de envío</span>
                      <span>{confirmedShippingCost === 0
                        ? <span className="text-success fw-semibold">Gratis</span>
                        : `€${confirmedShippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total</span>
                      <span>€{amount.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  // Estimate before confirming
                  <>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">Subtotal</span>
                      <span>€{cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Gastos de envío</span>
                      <span>
                        {shippingLoading ? (
                          <Spinner size="sm" animation="border" />
                        ) : shippingRate == null ? (
                          shippingId && shippingRate === null
                            ? <Badge bg="warning" text="dark">No disponible</Badge>
                            : <span className="text-muted">—</span>
                        ) : shippingRate.isFree ? (
                          <span className="text-success fw-semibold">Gratis</span>
                        ) : (
                          `€${shippingRate.shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shippingRate && shippingRate.freeShippingThreshold && !shippingRate.isFree && (
                      <div className="small text-muted mb-2">
                        Envío gratis a partir de <strong>€{shippingRate.freeShippingThreshold.toFixed(2)}</strong>
                        {' '}(te faltan €{(shippingRate.freeShippingThreshold - cartSubtotal).toFixed(2)})
                      </div>
                    )}
                    {shippingRate === null && shippingId && (
                      <Alert variant="warning" className="py-2 small">
                        No hay tarifa de envío disponible para este país. Contacta con nosotros.
                      </Alert>
                    )}
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total</span>
                      <span>€{estimatedTotal.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {shippingRate && (
                  <div className="small text-muted mt-1">{shippingRate.name}</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default CheckoutPage;
