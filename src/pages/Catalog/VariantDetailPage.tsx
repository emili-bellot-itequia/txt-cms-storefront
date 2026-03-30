import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import MainLayout from '../../components/Layout/MainLayout';
import { getVariantById } from '../../services/productService';
import type { StorefrontVariantDetail } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const MIN_QTY = 0.3;
const STEP_QTY = 0.05;

const VariantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [variant, setVariant] = useState<StorefrontVariantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(MIN_QTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVariantById(Number(id))
      .then(v => setVariant(v))
      .catch((e) => { if (e?.response?.status === 404) setNotFound(true); else navigate('/catalog'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><div className="text-center py-5"><Spinner animation="border" variant="primary" /></div></MainLayout>;
  if (notFound) return <MainLayout><Container className="py-5"><Alert variant="warning">Variante no encontrada.</Alert></Container></MainLayout>;
  if (!variant) return null;

  const images = variant.imageUrls.length ? variant.imageUrls : variant.thumbnailUrl ? [variant.thumbnailUrl] : [];
  const outOfStock = variant.availableStock <= 0;
  const hasDiscount = variant.originalPrice > variant.price;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= MIN_QTY) setQuantity(val);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setError('');
    try {
      await addItem(undefined, variant.id, quantity);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al añadir al carrito.');
    }
  };

  return (
    <MainLayout>
      <Container className="py-4">
        <Button variant="link" className="p-0 mb-3 text-muted" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Volver
        </Button>

        <Row>
          {/* Images */}
          <Col md={6} className="mb-4">
            <div className="product-detail-main-img mb-2">
              {images[selectedImage]
                ? <img src={images[selectedImage]} alt={variant.name} className="w-100 rounded" style={{ maxHeight: 420, objectFit: 'contain' }} />
                : <div className="product-detail-placeholder">📦</div>}
            </div>
            {images.length > 1 && (
              <div className="d-flex gap-2 flex-wrap">
                {images.map((url, i) => (
                  <img key={i} src={url} alt="" onClick={() => setSelectedImage(i)}
                    className={`product-thumb ${i === selectedImage ? 'active' : ''}`} />
                ))}
              </div>
            )}
          </Col>

          {/* Info */}
          <Col md={6}>
            {variant.productName && (
              <div className="text-muted small text-uppercase mb-1">
                <Link to={`/product/${variant.productSlug}`} className="text-muted text-decoration-none">
                  {variant.productName}
                </Link>
              </div>
            )}
            <h1 className="h3 fw-bold mb-1">{variant.name}</h1>
            {variant.typeValue && <div className="text-muted small mb-1">{variant.typeValue}</div>}
            <div className="text-muted small mb-3">Ref: {variant.code}</div>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-2 mb-3">
              <span className="fs-3 fw-bold">€{variant.price.toFixed(2)}</span>
              {hasDiscount && <span className="text-muted text-decoration-line-through">€{variant.originalPrice.toFixed(2)}</span>}
              {hasDiscount && <Badge bg="danger">Oferta</Badge>}
            </div>

            {/* Stock */}
            <div className="mb-3">
              {outOfStock
                ? <Badge bg="secondary">Sin stock</Badge>
                : variant.availableStock <= 5
                  ? <Badge bg="warning" text="dark">¡Solo quedan {variant.availableStock}!</Badge>
                  : <Badge bg="success">En stock</Badge>}
            </div>

            {/* Quantity */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Cantidad (m)</Form.Label>
              <Form.Control
                type="number"
                min={MIN_QTY}
                step={STEP_QTY}
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: 120 }}
                disabled={outOfStock}
              />
            </Form.Group>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            <Button variant="primary" size="lg" className="w-100 mb-3" disabled={outOfStock || cartLoading} onClick={handleAddToCart}>
              <FaShoppingCart className="me-2" />
              {outOfStock ? 'Sin stock' : 'Añadir al carrito'}
            </Button>

            <hr />
            <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>{variant.description}</div>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default VariantDetailPage;
