import React, { useState } from 'react';
import { Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCheck, FaTimes } from 'react-icons/fa';
import type { StorefrontVariant } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../common/FavoriteButton';
import './ProductCard.css';

const MIN_QTY = 0.3;
const STEP_QTY = 0.05;

interface Props { variant: StorefrontVariant; }

const VariantCard: React.FC<Props> = ({ variant }) => {
  const { addItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showQtyForm, setShowQtyForm] = useState(false);
  const [quantity, setQuantity] = useState(MIN_QTY);

  const outOfStock = variant.availableStock <= 0;
  const hasSaleDiscount = variant.originalPrice > variant.price;
  const hasGroupDiscount = (variant.discountPercent ?? 0) > 0;
  const hasDiscount = hasSaleDiscount || hasGroupDiscount;

  const handleOpenQty = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setQuantity(MIN_QTY);
    setShowQtyForm(true);
  };

  const handleConfirm = async () => {
    await addItem(undefined, variant.id, quantity);
    setShowQtyForm(false);
    setQuantity(MIN_QTY);
  };

  const handleCancel = () => {
    setShowQtyForm(false);
    setQuantity(MIN_QTY);
  };

  const adjust = (delta: number) => {
    setQuantity(prev => Math.max(MIN_QTY, Math.round((prev + delta) * 100) / 100));
  };

  return (
    <Card className="product-card h-100">
      {/* Image area — Link + absolute FavoriteButton outside the anchor */}
      <div className="product-card-img-wrapper">
        <Link to={`/variant/${variant.id}`} className="product-card-img-link">
          {variant.thumbnailUrl
            ? <Card.Img variant="top" src={variant.thumbnailUrl} className="product-card-img" />
            : <div className="product-card-placeholder">📦</div>}
          {hasDiscount && (
            <Badge bg="danger" className="discount-badge">
              {hasGroupDiscount ? `−${variant.discountPercent}%` : 'OFERTA'}
            </Badge>
          )}
          {outOfStock && <div className="out-of-stock-overlay">Sin stock</div>}
        </Link>
        <FavoriteButton variantId={variant.id} size="sm" className="product-card-fav" />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="product-card-type">{variant.productTypeName ?? variant.typeValue}</div>
        <Card.Title as="h6" className="product-card-name">
          <Link to={`/variant/${variant.id}`}>
            {variant.productName}
            {variant.name !== variant.productName && (
              <span className="text-muted fw-normal"> · {variant.name}</span>
            )}
          </Link>
        </Card.Title>

        <div className="mt-auto">
          <div className="product-card-price">
            <span className="price-current">€{variant.price.toFixed(2)}</span>
            {hasDiscount && <span className="price-original">€{variant.originalPrice.toFixed(2)}</span>}
          </div>
          {hasGroupDiscount && (
            <div className="small text-success" style={{ fontSize: '0.75rem' }}>Tu precio (grupo -{variant.discountPercent}%)</div>
          )}

          {showQtyForm ? (
            <div className="variant-qty-form mt-2">
              <InputGroup size="sm" className="mb-1">
                <Button variant="outline-secondary" onClick={() => adjust(-STEP_QTY)} disabled={quantity <= MIN_QTY}>−</Button>
                <Form.Control
                  type="number"
                  min={MIN_QTY}
                  step={STEP_QTY}
                  value={quantity}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= MIN_QTY) setQuantity(Math.round(v * 100) / 100);
                  }}
                  className="text-center"
                  style={{ minWidth: 0 }}
                />
                <Button variant="outline-secondary" onClick={() => adjust(STEP_QTY)}>+</Button>
              </InputGroup>
              <div className="d-flex gap-1">
                <Button variant="primary" size="sm" className="flex-grow-1" disabled={loading} onClick={handleConfirm}>
                  <FaCheck className="me-1" />Añadir
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={handleCancel}>
                  <FaTimes />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant={outOfStock ? 'outline-secondary' : 'primary'}
              size="sm"
              className="w-100 mt-2"
              disabled={outOfStock || loading}
              onClick={handleOpenQty}
            >
              <FaShoppingCart className="me-1" />
              {outOfStock ? 'Sin stock' : 'Añadir'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default VariantCard;
