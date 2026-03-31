import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import MainLayout from '../../components/Layout/MainLayout';
import { getProductBySlug } from '../../services/productService';
import type { StorefrontProduct, StorefrontVariant } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const MIN_QTY = 0.3;
const STEP_QTY = 0.05;

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<StorefrontVariant | null>(null);
  const [quantity, setQuantity] = useState(MIN_QTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then(p => { setProduct(p); if (p.variants?.length) setSelectedVariant(p.variants[0]); })
      .catch((e) => { if (e?.response?.status === 404) setNotFound(true); else navigate('/catalog'); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <MainLayout><div className="text-center py-5"><Spinner animation="border" variant="primary" /></div></MainLayout>;
  if (notFound) return <MainLayout><Container className="py-5"><Alert variant="warning">Producto no encontrado.</Alert></Container></MainLayout>;
  if (!product) return null;

  const active = selectedVariant ?? product;
  const images = active.imageUrls?.length ? active.imageUrls : product.imageUrls ?? [];
  const outOfStock = active.availableStock <= 0;
  const hasDiscount = active.originalPrice > active.price;
  const hasGroupDiscount = (active.discountPercent ?? 0) > 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setError('');
    try {
      if (selectedVariant) await addItem(undefined, selectedVariant.id, quantity);
      else await addItem(product.id, undefined, quantity);
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
                ? <img src={images[selectedImage]} alt={product.name} className="w-100 rounded" style={{ maxHeight: 420, objectFit: 'contain' }} />
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
            {product.productTypeName && <div className="text-muted small text-uppercase mb-1">{product.productTypeName}</div>}
            <h1 className="h3 fw-bold mb-1">{product.name}</h1>
            <div className="text-muted small mb-3">Ref: {active.code}</div>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-2 flex-wrap mb-1">
              <span className="fs-3 fw-bold text-danger">€{active.price.toFixed(2)}</span>
              {(hasDiscount || hasGroupDiscount) && (
                <span className="text-muted text-decoration-line-through fs-5">€{active.originalPrice.toFixed(2)}</span>
              )}
              {hasGroupDiscount
                ? <Badge bg="success">Tu precio −{active.discountPercent}%</Badge>
                : hasDiscount && <Badge bg="danger">Oferta</Badge>}
            </div>
            <div className="text-muted small mb-3">por metro</div>

            {/* Stock */}
            <div className="mb-3">
              {outOfStock
                ? <Badge bg="secondary">Sin stock</Badge>
                : active.availableStock <= 5
                  ? <Badge bg="warning" text="dark">¡Solo quedan {active.availableStock}!</Badge>
                  : <Badge bg="success">En stock</Badge>}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Variante</Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {product.variants.map(v => (
                    <Button
                      key={v.id}
                      variant={selectedVariant?.id === v.id ? 'primary' : 'outline-secondary'}
                      size="sm"
                      disabled={v.availableStock <= 0}
                      onClick={() => { setSelectedVariant(v); setSelectedImage(0); setQuantity(MIN_QTY); }}
                    >
                      {v.typeValue ?? v.name}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            )}

            {/* Quantity */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Cantidad (m)</Form.Label>
              <Form.Control
                type="number"
                min={MIN_QTY}
                step={STEP_QTY}
                value={quantity}
                onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= MIN_QTY) setQuantity(v); }}
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
            <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>{product.description}</div>
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default ProductDetailPage;
