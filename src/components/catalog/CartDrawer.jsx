import React, { useState } from 'react'
import { Drawer } from '../common/Drawer'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { formatBRL } from '../../utils/formatters'
import { Trash2, Plus, Minus, ShoppingBag, Send, MapPin, Store } from 'lucide-react'

export function CartDrawer({ isOpen, onClose, onOrderPlaced }) {
  const { cart, removeFromCart, updateCartQuantity, submitOrderRequest, settings } = useApp()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerCity, setCustomerCity] = useState(settings.store.city || 'Cuité de Mamanguape')
  const [customerAddress, setCustomerAddress] = useState('')
  const [deliveryType, setDeliveryType] = useState('pickup') // 'pickup' ou 'delivery'
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = deliveryType === 'delivery' ? settings.delivery.defaultDeliveryFee : 0
  const total = subtotal + deliveryFee

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!customerName.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.')
      return
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um WhatsApp válido com DDD.')
      return
    }
    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      setErrorMsg('Por favor, informe o endereço ou ponto de referência para entrega.')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    const result = submitOrderRequest({
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      deliveryType,
      notes
    })

    setIsSubmitting(false)
    onClose()
    if (onOrderPlaced && result) {
      onOrderPlaced(result)
    }
  }

  const footer = cart.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <span>Subtotal dos produtos</span>
        <span>{formatBRL(subtotal)}</span>
      </div>

      {deliveryType === 'delivery' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span>Taxa de entrega</span>
          <span>{formatBRL(deliveryFee)}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
        <span>Total da Encomenda</span>
        <span>{formatBRL(total)}</span>
      </div>

      <Button
        variant="primary"
        size="lg"
        icon={Send}
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ width: '100%', marginTop: '4px' }}
      >
        {isSubmitting ? 'Enviando...' : 'Finalizar Pedido no WhatsApp'}
      </Button>
    </div>
  ) : null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Minha Encomenda (${cart.reduce((a, b) => a + b.quantity, 0)} ${cart.length === 1 ? 'item' : 'itens'})`}
      footer={footer}
    >
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-secondary)' }}>
          <ShoppingBag size={48} style={{ color: 'var(--border-subtle)', margin: '0 auto 16px auto' }} />
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Sua sacola está vazia</h4>
          <p style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            Navegue pelo catálogo e escolha seus calçados, bolsas e looks favoritos para a viagem semanal!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Lista de Itens no Carrinho */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '10px',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  alignItems: 'center'
                }}
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.productName}
                  </h4>

                  <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.size && item.size !== 'Único' && <span>Tam: {item.size}</span>}
                    {item.color && <span>• Cor: {item.color}</span>}
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                    {formatBRL(item.price * item.quantity)}
                  </div>
                </div>

                {/* Controles de Quantidade */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{ color: 'var(--text-muted)', padding: '2px' }}
                    title="Remover item"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      style={{ padding: '3px 7px', color: 'var(--text-secondary)' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      style={{ padding: '3px 7px', color: 'var(--text-secondary)' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Opção de Entrega / Retirada */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <label className="form-label" style={{ marginBottom: '8px' }}>Forma de Recebimento</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: deliveryType === 'pickup' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: deliveryType === 'pickup' ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                  color: deliveryType === 'pickup' ? 'var(--color-primary)' : 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textAlign: 'center',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Store size={18} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Retirar no Local</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--status-success-text)' }}>Grátis</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: deliveryType === 'delivery' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: deliveryType === 'delivery' ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                  color: deliveryType === 'delivery' ? 'var(--color-primary)' : 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textAlign: 'center',
                  transition: 'var(--transition-fast)'
                }}
              >
                <MapPin size={18} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Entrega em Domicílio</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>+ {formatBRL(settings.delivery.defaultDeliveryFee)}</span>
              </button>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Seus Dados para Contato
            </h4>

            {errorMsg && (
              <div style={{
                background: 'var(--status-danger-bg)',
                color: 'var(--status-danger-text)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                marginBottom: '12px'
              }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Seu Nome Completo *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Maria Eduarda Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Seu WhatsApp com DDD *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Ex: (83) 99876-5432"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Edvania entrará em contato para confirmar a disponibilidade na viagem.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Cuité de Mamanguape"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
              />
            </div>

            {deliveryType === 'delivery' && (
              <div className="form-group">
                <label className="form-label">Endereço e Ponto de Referência *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Rua, número, bairro e ponto de referência"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  style={{ minHeight: '60px' }}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Observações sobre a encomenda (Opcional)</label>
              <textarea
                className="form-textarea"
                placeholder="Ex: Se não tiver dourada, pode ser na prata; avisar antes de comprar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: '60px' }}
              />
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
