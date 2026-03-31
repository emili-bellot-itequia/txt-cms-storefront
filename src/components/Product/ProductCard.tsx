import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import type { StorefrontProduct } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../common/FavoriteButton';
import './ProductCard.css';

interface Props { product: StorefrontProduct; }

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const outOfStock = product.availableStock <= 0;
  const hasSaleDiscount = product.originalPrice > product.price;
  const hasGroupDiscount = (product.discountPercent ?? 0) > 0;
  const hasDiscount = hasSaleDiscount || hasGroupDiscount;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!product.hasVariants) await addItem(product.id, undefined, 1);
    else navigate(`/product/${product.slug}`);
  };

  return (
    <Card className="product-card h-100">
      <div className="product-card-img-wrapper">
        <Link to={`/product/${product.slug}`} className="product-card-img-link">
          {product.thumbnailUrl
            ? <Card.Img variant="top" src={product.thumbnailUrl} className="product-card-img" />
            : <div className="product-card-placeholder">📦</div>}
          {hasDiscount && <Badge bg="danger" className="discount-badge">{hasGroupDiscount ? `−${product.discountPercent}%` : 'OFERTA'}</Badge>}
          {outOfStock && <div className="out-of-stock-overlay">Sin stock</div>}
        </Link>
        <FavoriteButton productId={product.id} size="sm" className="product-card-fav" />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="product-card-type">{product.productTypeName}</div>
        <Card.Title as="h6" className="product-card-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </Card.Title>
        <div className="mt-auto">
          <div className="product-card-price">
            <span className="price-current">€{product.price.toFixed(2)}</span>
            {hasDiscount && <span className="price-original">€{product.originalPrice.toFixed(2)}</span>}
          </div>
          {hasGroupDiscount && (
            <div className="small text-success" style={{ fontSize: '0.75rem' }}>Tu precio (grupo -{product.discountPercent}%)</div>
          )}
          <Button
            variant={outOfStock ? 'outline-secondary' : 'primary'}
            size="sm"
            className="w-100 mt-2"
            disabled={outOfStock || loading}
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="me-1" />
            {outOfStock ? 'Sin stock' : product.hasVariants ? 'Ver opciones' : 'Añadir'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
