import React from 'react'
import { useApp } from '../../context/AppContext'
import { ShoppingBag, MessageCircle, Sparkles, MapPin, Calendar } from 'lucide-react'
import { cleanPhoneForWa } from '../../utils/formatters'

export function CatalogHeader({ onOpenCart }) {
  const { cart, settings } = useApp()
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const waStoreUrl = `https://wa.me/${cleanPhoneForWa(settings.store.whatsapp)}?text=${encodeURIComponent('Olá Edvania! Estou olhando o catálogo da M_I Store e gostaria de tirar uma dúvida sobre uma encomenda.')}`

  return (
    <header className="catalog-header" style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: '37px', // Abaixo da demo-switch-bar
      zIndex: 90,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top Banner Informativo de Encomenda */}
      <div style={{
        background: 'linear-gradient(90deg, #85334c 0%, #6e283d 100%)',
        color: '#ffffff',
        padding: '6px 16px',
        fontSize: '0.75rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textAlign: 'center'
      }}>
        <Sparkles size={13} style={{ color: '#ffdfa0', flexShrink: 0 }} />
        <span>
          <strong>Semana de Compras em João Pessoa:</strong> Encomendas abertas até quarta às 18h • Compras quinta-feira
        </span>
      </div>

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        paddingBottom: '12px'
      }}>
        {/* Logo / Marca */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-primary)',
              lineHeight: 1
            }}>
              M_I Store
            </h1>
            <span style={{
              background: 'var(--color-gold-light)',
              color: '#8c5d1c',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid #ebd8be',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Sob Encomenda
            </span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginTop: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <MapPin size={11} style={{ color: 'var(--color-primary)' }} />
            {settings.store.city} / {settings.store.state}
          </span>
        </div>

        {/* Ações: WhatsApp + Carrinho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href={waStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: '#25D366',
              color: '#128C7E',
              fontWeight: 600
            }}
            title="Falar com Edvania no WhatsApp"
          >
            <MessageCircle size={15} style={{ color: '#25D366' }} />
            <span style={{ display: 'none', md: 'inline' }}>WhatsApp</span>
          </a>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenCart}
            style={{ position: 'relative', paddingLeft: '14px', paddingRight: '14px' }}
          >
            <ShoppingBag size={16} />
            <span>Minha Encomenda</span>
            {cartCount > 0 && (
              <span style={{
                background: '#ffffff',
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '0.75rem',
                minWidth: '18px',
                height: '18px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px',
                padding: '0 4px'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
