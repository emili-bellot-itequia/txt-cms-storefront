import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Pagination, Alert, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import MainLayout from '../../components/Layout/MainLayout';
import { getPageBySlug } from '../../services/pageService';
import { useCart } from '../../contexts/CartContext';
import type { StorefrontPageDetail, StorefrontPageItem } from '../../types';

const PAGE_SIZE = 12;

// ── Variant card ──────────────────────────────────────────────────────────────
const PageItemCard: React.FC<{ item: StorefrontPageItem }> = ({ item }) => {
  const { addItem } = useCart();
  const hasDiscount = item.originalPrice > 0 && item.originalPrice > item.price;
  const outOfStock = item.availableStock <= 0;

  return (
    <div className={`card h-100 border-0 shadow-sm${outOfStock ? ' opacity-75' : ''}`} style={{ transition: 'box-shadow .2s' }}>
      <Link to={`/variant/${item.variantId}`} className="text-decoration-none">
        <div className="position-relative" style={{ paddingTop: '100%', background: '#f8f9fa', overflow: 'hidden' }}>
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted" style={{ fontSize: 32 }}>
              📦
            </div>
          )}
          {hasDiscount && (
            <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
              -{Math.round((1 - item.price / item.originalPrice) * 100)}%
            </Badge>
          )}
          {outOfStock && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ background: 'rgba(255,255,255,.6)' }}>
              <span className="badge bg-secondary fs-6">Sin stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="card-body d-flex flex-column p-3">
        <Link to={`/variant/${item.variantId}`} className="text-decoration-none text-dark">
          <p className="mb-1 small fw-semibold" style={{ lineHeight: 1.3 }}>{item.name}</p>
          {item.typeValue && <p className="mb-1 text-muted" style={{ fontSize: 11 }}>{item.typeValue}</p>}
        </Link>
        <div className="mt-auto pt-2 d-flex align-items-center justify-content-between">
          <div>
            <span className="fw-bold">€{item.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-muted text-decoration-line-through ms-1" style={{ fontSize: 12 }}>
                €{item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={outOfStock}
            onClick={() => addItem(undefined, item.variantId, 1)}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const PageCatalogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [pageDetail, setPageDetail] = useState<StorefrontPageDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { setCurrentPage(1); }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    getPageBySlug(slug, currentPage, PAGE_SIZE)
      .then(data => {
        if (data.type === 'ExternalLink' && data.externalUrl) {
          window.location.href = data.externalUrl;
          return;
        }
        setPageDetail(data);
      })
      .catch(e => { if (e?.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [slug, currentPage]);

  if (loading) return (
    <MainLayout>
      <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>
    </MainLayout>
  );

  if (notFound) return (
    <MainLayout>
      <Container className="py-5"><Alert variant="warning">Página no encontrada.</Alert></Container>
    </MainLayout>
  );

  if (!pageDetail) return null;

  return (
    <MainLayout>
      <div className="bg-light border-bottom py-4 mb-4">
        <Container>
          {pageDetail.imageUrl && (
            <img src={pageDetail.imageUrl} alt={pageDetail.name} className="mb-3 rounded"
              style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'cover', width: '100%' }} />
          )}
          <h1 className="fw-bold mb-1">{pageDetail.name}</h1>
          {pageDetail.description && <p className="text-muted mb-0">{pageDetail.description}</p>}
        </Container>
      </div>

      <Container className="pb-5">
        {pageDetail.totalItems === 0 ? (
          <p className="text-muted text-center py-5">No hay productos en esta sección.</p>
        ) : (
          <>
            <p className="text-muted small mb-3">{pageDetail.totalItems} artículo{pageDetail.totalItems !== 1 ? 's' : ''}</p>
            <Row xs={2} sm={2} md={3} lg={4} className="g-3">
              {pageDetail.items.map(item => (
                <Col key={item.variantId}>
                  <PageItemCard item={item} />
                </Col>
              ))}
            </Row>

            {pageDetail.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
                  {Array.from({ length: pageDetail.totalPages }, (_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next disabled={currentPage === pageDetail.totalPages} onClick={() => setCurrentPage(p => p + 1)} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default PageCatalogPage;
