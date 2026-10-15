import React, { useEffect, useState } from 'react'
import { formatBRL } from '../../utils/formatters'
import { ArrowRight } from 'lucide-react'

export function ProductCard({ product, onSelect }) {
  const { name, category, price, images = [], sizes = [], colors = [] } = product
  const imageUrl = images[0] || ''
  const [imageUnavailable, setImageUnavailable] = useState(!imageUrl)
  const priceAvailable = Number.isFinite(price) && price > 0

  useEffect(() => setImageUnavailable(!imageUrl), [imageUrl])

  const openProduct = () => onSelect(product)
  return (
    <div
      className="card card-interactive"
      onClick={openProduct}
      style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%', backgroundColor: 'var(--bg-surface)' }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '105%', backgroundColor: '#f5f0ec', overflow: 'hidden' }}>
        {imageUrl && !imageUnavailable && (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageUnavailable(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
          />
        )}
        {imageUnavailable && (
          <div role="img" aria-label={`Foto de exemplo não disponível para ${name}`} style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '20px',
            textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', background: 'var(--bg-subtle)'
          }}>
            Foto de demonstração indisponível
          </div>
        )}
        <span style={{
          position: 'absolute', top: '10px', left: '10px', background: 'rgba(255, 255, 255, 0.94)',
          color: '#624D29', fontSize: '0.6875rem', fontWeight: 700, padding: '4px 8px', borderRadius: '999px',
          border: '1px solid #E8D7B0'
        }}>
          Exemplo
        </span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {category}
          </span>
          <h3 style={{
            fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5em'
          }}>
            {name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
            {sizes.length > 0 && sizes[0] !== 'Único' && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                Tamanhos ilustrativos: {sizes.join(', ')}
              </span>
            )}
            {colors.length > 0 && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                {colors.length} {colors.length === 1 ? 'cor' : 'cores'} de exemplo
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>
              {priceAvailable ? 'Preço demonstrativo' : 'Preço não informado'}
            </span>
            {priceAvailable && (
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {formatBRL(price)}
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-soft btn-sm"
            aria-label={`Escolher ${name}`}
            style={{ padding: '6px 10px', borderRadius: 'var(--radius-full)', flexShrink: 0 }}
            onClick={event => {
              event.stopPropagation()
              openProduct()
            }}
          >
            <span>Ver item</span>
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
