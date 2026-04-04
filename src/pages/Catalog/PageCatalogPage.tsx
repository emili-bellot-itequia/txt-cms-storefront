import React, { useEffect, useState } from 'react';
import { Container, Spinner, Pagination, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import PageBlockRenderer from '../../components/common/PageBlockRenderer';
import { getPageBySlug } from '../../services/pageService';
import type { StorefrontPageDetail } from '../../types';

const PAGE_SIZE = 12;

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
      <Container className="pb-5">
        <h1 className="fw-bold my-4">{pageDetail.name}</h1>
        {pageDetail.blocks?.length > 0 && (
          <PageBlockRenderer blocks={pageDetail.blocks} pageDetail={pageDetail} />
        )}

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
      </Container>
    </MainLayout>
  );
};

export default PageCatalogPage;
