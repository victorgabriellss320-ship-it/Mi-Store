import React from 'react'
import { Menu, Plus, ShoppingBag, Calendar, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Button } from '../common/Button'

export function AdminHeader({ title, subtitle, onOpenMobileMenu, actionButton }) {
  const { navigateTo, currentTrip } = useApp()

  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '37px', // abaixo da viewSwitcher bar
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          className="admin-mobile-menu-btn"
          onClick={onOpenMobileMenu}
          style={{
            padding: '6px',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-surface-subtle)'
          }}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Badge da Próxima Viagem */}
        {currentTrip && (
          <div
            onClick={() => navigateTo('admin-compra-semana')}
            style={{
              cursor: 'pointer',
              display: 'none',
              background: 'var(--color-gold-light)',
              border: '1px solid #ebd8be',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#8c5d1c'
            }}
            className="trip-header-badge"
          >
            <Calendar size={13} />
            <span>Viagem JP: {currentTrip.date}</span>
          </div>
        )}

        {actionButton}

        <Button
          variant="secondary"
          size="sm"
          icon={ShoppingBag}
          onClick={() => navigateTo('catalog')}
          title="Ver o catálogo público como cliente"
        >
          <span className="hide-on-mobile">Ver Catálogo</span>
        </Button>
      </div>
    </header>
  )
}
