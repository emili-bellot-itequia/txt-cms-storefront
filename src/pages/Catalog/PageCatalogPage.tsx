import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Pagination, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import VariantCard from '../../components/Product/VariantCard';
import { getPageBySlug } from '../../services/pageService';
import type { StorefrontPageDetail, StorefrontPageItem, StorefrontVariant } from '../../types';

const PAGE_SIZE = 12;

function toVariant(item: StorefrontPageItem): StorefrontVariant {
  const discountPercent = item.originalPrice > 0 && item.originalPrice > item.price
    ? Math.round((1 - item.price / item.originalPrice) * 10000) / 100
    : 0;
  return {
    id: item.variantId,
    name: item.name,
    code: item.code,
    price: item.price,
    originalPrice: item.originalPrice,
    discountPercent,
    availableStock: item.availableStock,
    thumbnailUrl: item.thumbnailUrl,
    typeValue: item.typeValue,
    productId: item.productId,
    productName: item.name,
    productSlug: item.productSlug,
  };
}

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
            <p className="text-muted small mb-3">
              {pageDetail.totalItems} artículo{pageDetail.totalItems !== 1 ? 's' : ''}
            </p>
            <Row xs={2} sm={2} md={3} lg={4} className="g-3">
              {pageDetail.items.map(item => (
                <Col key={item.variantId}>
                  <VariantCard variant={toVariant(item)} />
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
