import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { Button } from '../../components/common/Button'
import { formatBRL, cleanPhoneForWa } from '../../utils/formatters'
import {
  Truck,
  Store,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  Clock
} from 'lucide-react'

export function EntregasPage() {
  const { sales, updateSaleStatus } = useApp()

  const [deliveryTab, setDeliveryTab] = useState('delivery') // 'delivery' ou 'pickup'

  const targetSales = sales.filter(s => {
    const isReadyOrDelivered = ['ready_for_delivery', 'out_for_delivery', 'delivered'].includes(s.status)
    const matchesType = deliveryTab === 'delivery' ? s.deliveryType === 'delivery' : s.deliveryType === 'pickup'
    return isReadyOrDelivered && matchesType
  })

  const pendingDeliveryCount = sales.filter(s => s.deliveryType === 'delivery' && ['ready_for_delivery', 'out_for_delivery'].includes(s.status)).length
  const pendingPickupCount = sales.filter(s => s.deliveryType === 'pickup' && s.status === 'ready_for_delivery').length

  const handleMarkDelivered = (saleId) => {
    updateSaleStatus(saleId, 'delivered')
  }

  const handleMarkOutForDelivery = (saleId) => {
    updateSaleStatus(saleId, 'out_for_delivery')
  }

  return (
    <AdminLayout
      title="Entregas & Retiradas no Local"
      subtitle="Organize as rotas de entrega e os pedidos aguardando retirada pelas clientes"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Abas Superiores */}
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setDeliveryTab('delivery')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: deliveryTab === 'delivery' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                background: deliveryTab === 'delivery' ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                color: deliveryTab === 'delivery' ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'var(--transition-fast)'
              }}
            >
              <Truck size={18} />
              <span>Entregas em Domicílio</span>
              {pendingDeliveryCount > 0 && (
                <span style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  {pendingDeliveryCount} pendentes
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDeliveryTab('pickup')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: deliveryTab === 'pickup' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                background: deliveryTab === 'pickup' ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                color: deliveryTab === 'pickup' ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'var(--transition-fast)'
              }}
            >
              <Store size={18} />
              <span>Aguardando Retirada na Loja</span>
              {pendingPickupCount > 0 && (
                <span style={{
                  background: 'var(--status-info-text)',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  {pendingPickupCount} prontas
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {targetSales.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--status-success-text)', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Nenhum pedido pendente nesta categoria</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Todas as encomendas deste fluxo já foram finalizadas ou ainda aguardam compra em João Pessoa.
              </p>
            </div>
          ) : (
            targetSales.map(sale => {
              const isDelivered = sale.status === 'delivered'
              const isOut = sale.status === 'out_for_delivery'

              return (
                <div
                  key={sale.id}
                  className="card"
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: isDelivered ? '5px solid #28a745' : isOut ? '5px solid #17a2b8' : '5px solid #85334c'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9375rem' }}>
                        {sale.code}
                      </span>
                      <StatusBadge status={sale.status} type="sale" />
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {sale.customerName}
                    </h4>

                    {/* Detalhes de Endereço */}
                    <div style={{
                      marginTop: '8px',
                      padding: '10px',
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                        <span>{sale.customerCity} {sale.customerAddress && `• ${sale.customerAddress}`}</span>
                      </div>
                      {sale.deliveryFee > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '20px' }}>
                          Taxa de Entrega: {formatBRL(sale.deliveryFee)}
                        </div>
                      )}
                    </div>

                    {/* Lista de Peças */}
                    <div style={{ marginTop: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Itens do Pacote:</span>
                      <ul style={{ listStyle: 'none', padding: 0, marginTop: '4px', fontSize: '0.8125rem' }}>
                        {sale.items.map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                            <span>{item.quantity}x {item.productName} ({item.size})</span>
                            <span style={{ fontWeight: 600 }}>{formatBRL(item.unitPrice * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Situação do Pagamento */}
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem'
                    }}>
                      <span>Receber na Entrega:</span>
                      <strong style={{ color: sale.balanceDue > 0 ? '#b35e16' : 'var(--status-success-text)' }}>
                        {sale.balanceDue > 0 ? formatBRL(sale.balanceDue) : 'Já Quitado ✓'}
                      </strong>
                    </div>
                  </div>

                  {/* Ações */}
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <a
                      href={`https://wa.me/${cleanPhoneForWa(sale.customerPhone)}?text=${encodeURIComponent(`Olá ${sale.customerName}! Seu pedido ${sale.code} na M_I Store já está pronto!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: '#25D366', color: '#128C7E' }}
                    >
                      <MessageCircle size={14} style={{ color: '#25D366' }} /> WhatsApp
                    </a>

                    {!isDelivered && (
                      <Button
                        variant="success"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleMarkDelivered(sale.id)}
                        style={{ flex: 1 }}
                      >
                        {deliveryTab === 'delivery' ? 'Confirmar Entrega' : 'Confirmar Retirada'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
