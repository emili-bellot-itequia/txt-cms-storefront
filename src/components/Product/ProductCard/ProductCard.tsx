import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import type { StorefrontProduct } from '../../../types';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../../common/FavoriteButton/FavoriteButton';
import { formatComposition } from '../../../utils/composition';
import './ProductCard.css';

interface Props { product: StorefrontProduct; }

const ProductCard: React.FC<Props> = ({ product }) => {
  const { t } = useTranslation();
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
          {hasDiscount && <Badge bg="danger" className="discount-badge">{hasGroupDiscount ? `−${product.discountPercent}%` : t('product.offer')}</Badge>}
          {outOfStock && <div className="out-of-stock-overlay">{t('product.outOfStock')}</div>}
        </Link>
        <FavoriteButton productId={product.id} size="sm" className="product-card-fav" />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="product-card-type">{product.productTypeName}</div>
        <Card.Title as="h6" className="product-card-name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </Card.Title>
        {(product.width && product.width > 0 || product.composition) && (
          <div className="product-card-meta text-muted">
            {product.width && product.width > 0 && <span>{product.width} cm</span>}
            {product.width && product.width > 0 && product.composition && <span className="mx-1">·</span>}
            {formatComposition(product.composition) && <span>{formatComposition(product.composition)}</span>}
          </div>
        )}
        <div className="mt-auto">
          <div className="product-card-price">
            <span className="price-current">€{product.price.toFixed(2)}</span>
            {hasDiscount && <span className="price-original">€{product.originalPrice.toFixed(2)}</span>}
          </div>
          {hasGroupDiscount && (
            <div className="small text-success product-card-group-price">{t('product.groupPrice', { percent: product.discountPercent })}</div>
          )}
          <Button
            variant={outOfStock ? 'outline-secondary' : 'primary'}
            size="sm"
            className="w-100 mt-2"
            disabled={outOfStock || loading}
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="me-1" />
            {outOfStock ? t('product.outOfStock') : product.hasVariants ? t('product.viewOptions') : t('product.add')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
