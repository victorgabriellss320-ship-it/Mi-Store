import React from 'react'
import { formatBRL } from '../../utils/formatters'
import { Sparkles, ArrowRight } from 'lucide-react'

export function ProductCard({ product, onSelect }) {
  const { name, category, price, images, sizes, colors, featured } = product

  return (
    <div
      className="card card-interactive"
      style={{
        padding: '0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
        backgroundColor: 'var(--bg-surface)'
      }}
      onClick={() => onSelect(product)}
    >
      {/* Imagem do Produto */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '105%', // Aspect ratio ~1:1 agradável
        backgroundColor: '#f5f0ec',
        overflow: 'hidden'
      }}>
        <img
          src={images[0]}
          alt={name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        />

        {/* Badges sobre a foto */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {featured && (
            <span style={{
              background: 'rgba(133, 51, 76, 0.9)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Sparkles size={11} /> Destaque
            </span>
          )}
          <span style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            color: '#8c5d1c',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '999px',
            border: '1px solid #ebd8be'
          }}>
            Sob Encomenda
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div style={{
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {category}
          </span>
          <h3 style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: '2px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em'
          }}>
            {name}
          </h3>

          {/* Variações disponíveis em miniatura */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '6px',
            flexWrap: 'wrap'
          }}>
            {sizes && sizes.length > 0 && sizes[0] !== 'Único' && (
              <span style={{
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface-subtle)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                Tam: {sizes.join(', ')}
              </span>
            )}
            {colors && colors.length > 0 && (
              <span style={{
                fontSize: '0.6875rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface-subtle)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {colors.length} {colors.length === 1 ? 'cor' : 'cores'}
              </span>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>
              Valor sob encomenda
            </span>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: 'var(--color-primary)'
            }}>
              {formatBRL(price)}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-soft btn-sm"
            style={{ padding: '6px 10px', borderRadius: 'var(--radius-full)' }}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(product)
            }}
          >
            <span>Escolher</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
