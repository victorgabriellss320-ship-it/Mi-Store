import React from 'react'
import { useApp } from '../../context/AppContext'
import { ShoppingBag } from 'lucide-react'

export function CatalogHeader({ onOpenCart }) {
  const { cart } = useApp()
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <header className="catalog-header" style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'static',
      zIndex: 90,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div role="note" style={{
        background: '#FFFAF0', color: '#624D29', borderBottom: '1px solid #E8D7B0',
        padding: '7px 16px', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.4
      }}>
        Demonstração: preços, produtos e condições são ilustrativos. Nenhum pedido é enviado ou reservado.
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-primary)', lineHeight: 1 }}>
            M_I Store
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Catálogo demonstrativo
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenCart}
          aria-label={`Abrir sacola de demonstração, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
          style={{ position: 'relative', paddingLeft: '14px', paddingRight: '14px', flexShrink: 0 }}
        >
          <ShoppingBag size={16} aria-hidden="true" />
          <span>Minha sacola</span>
          {cartCount > 0 && (
            <span aria-live="polite" style={{
              background: '#ffffff', color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.75rem',
              minWidth: '18px', height: '18px', borderRadius: '999px', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', marginLeft: '4px', padding: '0 4px'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
