import React from 'react'
import { Drawer } from '../common/Drawer'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { formatBRL } from '../../utils/formatters'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity } = useApp()
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => (
    total + (Number.isFinite(item.price) && Number.isInteger(item.quantity) ? item.price * item.quantity : 0)
  ), 0)

  const footer = cart.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div role="note" style={{
        background: '#FFFAF0',
        color: '#624D29',
        border: '1px solid #E8D7B0',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        fontSize: '0.75rem',
        lineHeight: 1.45
      }}>
        Resumo fictício para demonstração. Nenhum pedido foi enviado, salvo ou reservado.
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <span>Subtotal demonstrativo</span>
        <span>{formatBRL(subtotal)}</span>
      </div>
      <Button variant="primary" size="lg" icon={ShoppingBag} onClick={onClose} style={{ width: '100%' }}>
        Voltar ao catálogo
      </Button>
    </div>
  ) : null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Sacola de demonstração (${cartCount} ${cartCount === 1 ? 'item' : 'itens'})`}
      footer={footer}
    >
      {cart.length === 0 ? (
        <div role="status" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-secondary)' }}>
          <ShoppingBag size={48} aria-hidden="true" style={{ color: 'var(--border-subtle)', margin: '0 auto 16px' }} />
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sua sacola está vazia</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            Escolha um ou mais itens do catálogo ilustrativo para conferir o resumo de demonstração.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(item => {
            const itemTotal = Number.isFinite(item.price) && Number.isInteger(item.quantity)
              ? formatBRL(item.price * item.quantity)
              : 'Preço indisponível'

            return (
              <article key={item.cartItemId} style={{
                display: 'flex', gap: '12px', padding: '10px', background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)', alignItems: 'center'
              }}>
                {item.image ? (
                  <img src={item.image} alt="" style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div aria-label={`Foto de ${item.productName} não disponível`} role="img" style={{
                    width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)',
                    display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontSize: '0.625rem', textAlign: 'center', flexShrink: 0
                  }}>Foto não disponível</div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.productName}
                  </h4>
                  {(item.size || item.color) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.size && <span>Tam.: {item.size}</span>}
                      {item.color && <span>Cor: {item.color}</span>}
                    </div>
                  )}
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                    {itemTotal}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <button type="button" onClick={() => removeFromCart(item.cartItemId)} aria-label={`Remover ${item.productName} da sacola`} style={{ color: 'var(--text-muted)', padding: '6px' }}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <button type="button" onClick={() => updateCartQuantity(item.cartItemId, -1)} aria-label={`Diminuir quantidade de ${item.productName}`} style={{ padding: '5px 8px', color: 'var(--text-secondary)' }}>
                      <Minus size={13} aria-hidden="true" />
                    </button>
                    <span aria-live="polite" style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: '22px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button type="button" onClick={() => updateCartQuantity(item.cartItemId, 1)} aria-label={`Aumentar quantidade de ${item.productName}`} style={{ padding: '5px 8px', color: 'var(--text-secondary)' }}>
                      <Plus size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </Drawer>
  )
}
