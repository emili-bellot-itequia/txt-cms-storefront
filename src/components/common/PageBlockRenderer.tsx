import React from 'react';
import { Row, Col } from 'react-bootstrap';
import type { StorefrontPageBlock, StorefrontPageDetail, BlockStyle } from '../../types';
import { pageUrl } from '../../utils/pageUrl';

// ─── Style helpers ────────────────────────────────────────────────────────────
const FONT_SIZE: Record<string, string> = {
  sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
};
const FONT_WEIGHT: Record<string, string> = {
  normal: '400', semibold: '600', bold: '700',
};
const LETTER_SPACING: Record<string, string> = {
  normal: 'normal', wide: '0.05em', wider: '0.1em',
};
const PADDING: Record<string, string> = {
  none: '0', sm: '0.5rem 0', md: '1.25rem 0', lg: '2.5rem 0',
};

function buildStyle(style?: BlockStyle): React.CSSProperties {
  if (!style) return {};
  return {
    textAlign: style.textAlign ?? undefined,
    color: style.color || undefined,
    backgroundColor: style.backgroundColor || undefined,
    fontSize: style.fontSize ? FONT_SIZE[style.fontSize] : undefined,
    fontWeight: style.fontWeight ? FONT_WEIGHT[style.fontWeight] : undefined,
    fontStyle: style.fontStyle === 'italic' ? 'italic' : undefined,
    textDecoration: style.textDecoration === 'underline' ? 'underline' : undefined,
    letterSpacing: style.letterSpacing ? LETTER_SPACING[style.letterSpacing] : undefined,
    padding: style.padding ? PADDING[style.padding] : undefined,
  };
}

// ─── Block renderers ──────────────────────────────────────────────────────────
const HeaderBlock: React.FC<{ config: any }> = ({ config }) => {
  const Tag = (config.level ?? 'h2') as keyof JSX.IntrinsicElements;
  return <Tag style={buildStyle(config.style)}>{config.text}</Tag>;
};

const ParagraphBlock: React.FC<{ config: any }> = ({ config }) => (
  <p style={{ whiteSpace: 'pre-wrap', ...buildStyle(config.style) }}>{config.text}</p>
);

const ImageBlock: React.FC<{ config: any }> = ({ config }) => {
  if (!config.imageUrl) return null;
  const img = (
    <img
      src={config.imageUrl}
      alt={config.altText ?? ''}
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
    />
  );
  return (
    <figure style={{ margin: 0, ...buildStyle(config.style) }}>
      {config.linkUrl ? <a href={config.linkUrl} target="_blank" rel="noopener noreferrer">{img}</a> : img}
      {config.caption && <figcaption style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: 4 }}>{config.caption}</figcaption>}
    </figure>
  );
};

const ImageTextBlock: React.FC<{ config: any }> = ({ config }) => {
  const imageLeft = (config.imagePosition ?? 'left') === 'left';
  const imgCol = config.imageUrl ? (
    <Col md={5}>
      <img src={config.imageUrl} alt={config.title ?? ''} style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }} />
    </Col>
  ) : null;
  const textCol = (
    <Col md={config.imageUrl ? 7 : 12} style={buildStyle(config.style)}>
      {config.title && <h3>{config.title}</h3>}
      {config.text && <p style={{ whiteSpace: 'pre-wrap' }}>{config.text}</p>}
      {config.buttonText && config.buttonUrl && (
        <a href={config.buttonUrl} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
          {config.buttonText}
        </a>
      )}
    </Col>
  );
  return (
    <Row className="align-items-center g-4">
      {imageLeft ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
    </Row>
  );
};

const DividerBlock: React.FC<{ config: any }> = ({ config }) => (
  <hr style={{ borderColor: config.style?.color || '#dee2e6', ...buildStyle(config.style), padding: undefined, margin: config.style?.padding ? PADDING[config.style.padding] : '0.75rem 0' }} />
);

const GalleryBlock: React.FC<{ config: any }> = ({ config }) => {
  const images: any[] = config.images ?? [];
  const cols = config.columns ?? 3;
  if (images.length === 0) return null;
  return (
    <div style={buildStyle(config.style)}>
      <Row xs={2} sm={cols} className="g-3">
        {images.map((img, i) => (
          <Col key={i}>
            {img.linkUrl
              ? <a href={img.linkUrl} target="_blank" rel="noopener noreferrer">
                  <img src={img.imageUrl} alt={img.altText ?? ''} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4 }} />
                </a>
              : <img src={img.imageUrl} alt={img.altText ?? ''} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4 }} />
            }
          </Col>
        ))}
      </Row>
    </div>
  );
};

const FormFieldBlock: React.FC<{ config: any }> = ({ config }) => (
  <div style={buildStyle(config.style)}>
    <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
      {config.label}
      {config.required && <span style={{ color: '#dc3545', marginLeft: 2 }}>*</span>}
    </label>
    {config.fieldType === 'textarea' ? (
      <textarea
        className="form-control"
        placeholder={config.placeholder}
        required={config.required}
        rows={4}
      />
    ) : config.fieldType === 'select' ? (
      <select className="form-select" required={config.required}>
        <option value="">{config.placeholder || 'Selecciona una opción'}</option>
        {(config.options ?? '').split('\n').filter(Boolean).map((opt: string, i: number) => (
          <option key={i} value={opt.trim()}>{opt.trim()}</option>
        ))}
      </select>
    ) : config.fieldType === 'checkbox' ? (
      <div className="form-check">
        <input className="form-check-input" type="checkbox" required={config.required} id={`field-${config.label}`} />
        <label className="form-check-label" htmlFor={`field-${config.label}`}>{config.placeholder}</label>
      </div>
    ) : (
      <input
        className="form-control"
        type={config.fieldType ?? 'text'}
        placeholder={config.placeholder}
        required={config.required}
      />
    )}
  </div>
);

const BannerBlock: React.FC<{ config: any }> = ({ config }) => (
  <div
    style={{
      position: 'relative',
      minHeight: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: config.imageUrl ? `url(${config.imageUrl})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: config.imageUrl ? undefined : '#343a40',
      borderRadius: 8,
      overflow: 'hidden',
      ...buildStyle(config.style),
    }}
  >
    {config.imageUrl && (
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
    )}
    <div style={{ position: 'relative', textAlign: 'center', color: '#fff', padding: '2rem' }}>
      {config.title && <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{config.title}</h2>}
      {config.subtitle && <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>{config.subtitle}</p>}
      {config.ctaText && config.ctaUrl && (
        <a href={config.ctaUrl} className="btn btn-light btn-lg">{config.ctaText}</a>
      )}
    </div>
  </div>
);

const SubPagesBlock: React.FC<{ config: any; pageDetail?: StorefrontPageDetail }> = ({ config, pageDetail }) => {
  const children = pageDetail?.childPages ?? [];
  const cols = config.columns ?? 3;
  if (children.length === 0) return null;
  return (
    <div style={buildStyle(config.style)}>
      <Row xs={1} sm={2} md={cols} className="g-4">
        {children.map(child => (
          <Col key={child.id}>
            <a href={pageUrl(child.type, child.slug)} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden', height: '100%' }}>
                {child.imageUrl && (
                  <img src={child.imageUrl} alt={child.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{child.name}</div>
                  {child.description && <p style={{ fontSize: '0.875rem', color: '#6c757d', margin: 0 }}>{child.description}</p>}
                </div>
              </div>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const ProductsBlock: React.FC<{ config: any; pageDetail?: StorefrontPageDetail }> = ({ config, pageDetail }) => {
  const items = pageDetail?.items ?? [];
  const cols = config.columns ?? 4;
  if (items.length === 0) return null;
  return (
    <div style={buildStyle(config.style)}>
      <Row xs={2} sm={cols > 2 ? 3 : 2} md={cols} className="g-3">
        {items.map(item => (
          <Col key={item.variantId}>
            <a href={`/products/${item.productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden', height: '100%' }}>
                {item.thumbnailUrl && (
                  <img src={item.thumbnailUrl} alt={item.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ color: '#0d6efd', fontWeight: 700 }}>{item.price.toFixed(2)} €</div>
                </div>
              </div>
            </a>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const FeaturedProductsBlock: React.FC<{ config: any }> = ({ config }) => {
  // productIds are stored in config; the storefront would need to fetch them.
  // This renders a placeholder if no data is injected externally.
  const title = config.title;
  const ids: number[] = config.productIds ?? [];
  if (ids.length === 0 && !title) return null;
  return (
    <div style={buildStyle(config.style)}>
      {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
      {ids.length === 0 && <p className="text-muted">No hay productos destacados configurados.</p>}
    </div>
  );
};

// ─── Registry ─────────────────────────────────────────────────────────────────
const RENDERERS: Record<string, React.FC<{ config: any; pageDetail?: StorefrontPageDetail }>> = {
  Header: ({ config }) => <HeaderBlock config={config} />,
  Paragraph: ({ config }) => <ParagraphBlock config={config} />,
  Image: ({ config }) => <ImageBlock config={config} />,
  ImageText: ({ config }) => <ImageTextBlock config={config} />,
  Divider: ({ config }) => <DividerBlock config={config} />,
  Gallery: ({ config }) => <GalleryBlock config={config} />,
  FormField: ({ config }) => <FormFieldBlock config={config} />,
  Banner: ({ config }) => <BannerBlock config={config} />,
  SubPages: ({ config, pageDetail }) => <SubPagesBlock config={config} pageDetail={pageDetail} />,
  Products: ({ config, pageDetail }) => <ProductsBlock config={config} pageDetail={pageDetail} />,
  FeaturedProducts: ({ config }) => <FeaturedProductsBlock config={config} />,
};

// ─── Main export ──────────────────────────────────────────────────────────────
interface PageBlockRendererProps {
  blocks: StorefrontPageBlock[];
  pageDetail?: StorefrontPageDetail;
}

const PageBlockRenderer: React.FC<PageBlockRendererProps> = ({ blocks, pageDetail }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="page-blocks">
      {blocks.map(block => {
        const Renderer = RENDERERS[block.type];
        if (!Renderer) return null;
        const bgColor = block.config?.style?.backgroundColor;
        return (
          <div
            key={block.id}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
          >
            <Renderer config={block.config} pageDetail={pageDetail} />
          </div>
        );
      })}
    </div>
  );
};

export default PageBlockRenderer;
