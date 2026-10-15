import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL, cleanPhoneForWa, formatDateShort } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
import {
  Truck,
  Store,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Calendar,
  AlertCircle,
  Check,
  Search,
  Filter,
  Package,
  Navigation,
  ArrowRight
} from 'lucide-react'

// Avatares de clientes com fallback
const CUSTOMER_AVATARS = {
  'Maria Clara Silva': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'Ana Paula Medeiros': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'Juliana Costa': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'Carla Cristina': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'Roberta Lima': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
  'Camila Duarte': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80',
  'Fernanda Souza': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80',
  'Ana Beatriz': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
  'Carla Souza': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'Mariana Silva': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
}

function getAvatar(name) {
  return CUSTOMER_AVATARS[name] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
}

export function EntregasPage({ onToast, onNavigate }) {
  const { sales = [], updateSaleStatus } = useApp()

  // 1. Aba Interna: 'delivery' (Domicílio), 'pickup' (Retirada na Loja), 'completed' (Concluídas)
  const [activeTab, setActiveTab] = useState('delivery')
  const [searchTerm, setSearchTerm] = useState('')

  // Métricas
  const pendingDeliveryCount = sales.filter(s => s.deliveryType === 'delivery' && ['ready_for_delivery', 'out_for_delivery'].includes(s.status)).length
  const pendingPickupCount = sales.filter(s => s.deliveryType === 'pickup' && s.status === 'ready_for_delivery').length
  const completedCount = sales.filter(s => s.status === 'delivered').length
  const totalDeliveryFees = sales
    .filter(s => s.deliveryType === 'delivery')
    .reduce((acc, s) => acc + (parseFloat(s.deliveryFee) || 0), 0)

  // Filtragem dos Pedidos
  const targetSales = useMemo(() => {
    return sales.filter(s => {
      // Busca
      const matchSearch =
        (s.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.customerAddress || '').toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchSearch) return false

      if (activeTab === 'delivery') {
        return s.deliveryType === 'delivery' && ['ready_for_delivery', 'out_for_delivery'].includes(s.status)
      } else if (activeTab === 'pickup') {
        return s.deliveryType === 'pickup' && ['ready_for_delivery'].includes(s.status)
      } else if (activeTab === 'completed') {
        return s.status === 'delivered'
      }

      return true
    })
  }, [sales, activeTab, searchTerm])

  // Ações
  const handleMarkDelivered = (saleId, clientName) => {
    updateSaleStatus(saleId, 'delivered')
    if (onToast) onToast(`Atendimento de ${clientName} concluído com sucesso!`)
  }

  const handleMarkOutForDelivery = (saleId, clientName) => {
    updateSaleStatus(saleId, 'out_for_delivery')
    if (onToast) onToast(`Pedido de ${clientName} marcado como "Saiu para entrega"!`)
  }

  return (
    <div className="page-container" role="region" aria-label="Entregas e Retiradas">
      {/* 1. Header da Página */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Entregas & Retiradas</h1>
          <p className="page-header-subtitle">
            Separe pacotes, despache entregas em domicílio e avise clientes para retirada na loja.
          </p>
        </div>
      </div>

      {/* 2. Métricas de Atendimento */}
      <div className="metrics-row">
        <div className="metric-box" style={{ borderLeft: '4px solid #731A30' }}>
          <span className="metric-box-title">Entregas em Domicílio</span>
          <div className="metric-box-value" style={{ color: '#731A30' }}>{pendingDeliveryCount}</div>
          <span className="metric-box-desc">Pacotes aguardando motoboy / rota</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-title">Retiradas na Loja</span>
          <div className="metric-box-value" style={{ color: '#C26725' }}>{pendingPickupCount}</div>
          <span className="metric-box-desc">Prontos aguardando cliente vir buscar</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-title">Atendimentos Concluídos</span>
          <div className="metric-box-value" style={{ color: '#1D7A47' }}>{completedCount}</div>
          <span className="metric-box-desc">Pedidos entregues nesta remessa</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-title">Arrecadação de Fretes</span>
          <div className="metric-box-value">{formatBRL(totalDeliveryFees)}</div>
          <span className="metric-box-desc">Taxas de entrega em domicílio</span>
        </div>
      </div>

      {/* 3. Abas Internas (Segment Switcher) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '2px solid #EFE8E1',
        paddingBottom: '8px',
        marginTop: '6px'
      }}>
        <button
          type="button"
          onClick={() => { setActiveTab('delivery'); setSearchTerm(''); }}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'delivery' ? 800 : 600,
            color: activeTab === 'delivery' ? '#FFFFFF' : '#4A4240',
            backgroundColor: activeTab === 'delivery' ? '#731A30' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Truck size={17} />
          <span>Entrega em Domicílio ({pendingDeliveryCount})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('pickup'); setSearchTerm(''); }}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'pickup' ? 800 : 600,
            color: activeTab === 'pickup' ? '#FFFFFF' : '#4A4240',
            backgroundColor: activeTab === 'pickup' ? '#731A30' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Store size={17} />
          <span>Retirada na Loja ({pendingPickupCount})</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('completed'); setSearchTerm(''); }}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'completed' ? 800 : 600,
            color: activeTab === 'completed' ? '#FFFFFF' : '#4A4240',
            backgroundColor: activeTab === 'completed' ? '#731A30' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckCircle2 size={17} />
          <span>Histórico Concluído ({completedCount})</span>
        </button>
      </div>

      {/* 4. Busca Rápida */}
      <div className="filters-bar">
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={16} className="search-icon" style={{ left: '12px' }} />
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: '38px', height: '38px', fontSize: '0.8125rem' }}
            placeholder="Buscar por cliente, endereço ou código do pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          * O status de entrega é independente do recebimento de fiado.
        </div>
      </div>

      {/* 5. Lista de Atendimento */}
      {targetSales.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-state-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="empty-state-title">
            {activeTab === 'delivery' && 'Nenhuma entrega em domicílio pendente'}
            {activeTab === 'pickup' && 'Nenhuma retirada na loja aguardando'}
            {activeTab === 'completed' && 'Nenhum histórico no filtro selecionado'}
          </div>
          <div className="empty-state-desc">
            Todos os pacotes desta modalidade já foram entregues ou não há pedidos correspondentes no momento.
          </div>
        </div>
      ) : (
        <>
          {/* Tabela Desktop */}
          <div className="table-card recent-orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Venda</th>
                  <th>Cliente</th>
                  <th>Endereço / Localização</th>
                  <th>Itens do Pacote</th>
                  <th>Status de Recebimento</th>
                  <th>Situação</th>
                  <th style={{ textAlign: 'right' }}>Ações de Despacho</th>
                </tr>
              </thead>
              <tbody>
                {targetSales.map(sale => {
                  const avatarUrl = getAvatar(sale.customerName)
                  const hasDebt = (parseFloat(sale.balanceDue) || 0) > 0

                  return (
                    <tr key={sale.id}>
                      <td>
                        <strong style={{ color: '#731A30', fontSize: '0.85rem' }}>{sale.code}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {formatDateShort(sale.createdAt)}
                        </div>
                      </td>

                      <td>
                        <div className="client-cell">
                          <img src={avatarUrl} alt={sale.customerName} className="client-avatar" />
                          <div>
                            <div className="client-name">{sale.customerName}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              Tel: {sale.customerPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', color: '#731A30' }} /> {sale.customerAddress || 'Retirada na Loja'}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {sale.customerCity} {sale.deliveryFee > 0 ? `(Taxa ${formatBRL(sale.deliveryFee)})` : ''}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {sale.items.map((it, idx) => (
                            <span key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              <strong>{it.quantity}x</strong> {it.productName} ({it.size})
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        {hasDebt ? (
                          <span style={{ fontSize: '0.75rem', color: '#C03C54', fontWeight: 800 }}>
                            Fiado pendente: {formatBRL(sale.balanceDue)}
                          </span>
                        ) : (
                          <span className="status-pill status-pill-success">
                            <CheckCircle2 size={11} /> 100% Pago
                          </span>
                        )}
                      </td>

                      <td>
                        {sale.status === 'out_for_delivery' ? (
                          <span className="status-pill status-pill-warning">
                            <Truck size={12} /> Saiu p/ Entrega
                          </span>
                        ) : sale.status === 'delivered' ? (
                          <span className="status-pill status-pill-success">
                            <CheckCircle2 size={12} /> Entregue
                          </span>
                        ) : (
                          <span className="status-pill status-pill-wine">
                            <Clock size={12} /> Pacote Separado
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {/* Botão de WhatsApp */}
                          <a
                            href={activeTab === 'delivery'
                              ? `https://wa.me/55${cleanPhoneForWa(sale.customerPhone)}?text=${encodeURIComponent(`Olá ${sale.customerName}! Aqui é Edvania da M_I Store. Seu pedido ${sale.code} está pronto e saindo para entrega no seu endereço: ${sale.customerAddress}.`)}`
                              : `https://wa.me/55${cleanPhoneForWa(sale.customerPhone)}?text=${encodeURIComponent(`Olá ${sale.customerName}! Aqui é Edvania da M_I Store. Seu pedido ${sale.code} já chegou de João Pessoa e está prontinho esperando por você na loja!`)}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp"
                            style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                            title="Avisar cliente no WhatsApp"
                          >
                            <MessageCircle size={13} /> WhatsApp
                          </a>

                          {/* Ações de Despacho */}
                          {sale.status === 'ready_for_delivery' && sale.deliveryType === 'delivery' && (
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleMarkOutForDelivery(sale.id, sale.customerName)}
                              style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                            >
                              <Navigation size={12} /> Saiu p/ Rota
                            </button>
                          )}

                          {sale.status !== 'delivered' && (
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => handleMarkDelivered(sale.id, sale.customerName)}
                              style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                            >
                              <Check size={12} /> {sale.deliveryType === 'delivery' ? 'Entregue' : 'Retirado'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cards Mobile para Entregas */}
          <div className="mobile-order-cards">
            {targetSales.map(sale => {
              const avatarUrl = getAvatar(sale.customerName)
              const hasDebt = (parseFloat(sale.balanceDue) || 0) > 0

              return (
                <div key={sale.id} className="mobile-order-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#731A30' }}>{sale.code}</strong>
                    {sale.status === 'out_for_delivery' ? (
                      <span className="status-pill status-pill-warning">Saiu p/ Entrega</span>
                    ) : sale.status === 'delivered' ? (
                      <span className="status-pill status-pill-success">Concluído</span>
                    ) : (
                      <span className="status-pill status-pill-wine">Pronto na Loja</span>
                    )}
                  </div>

                  <div className="client-cell">
                    <img src={avatarUrl} alt={sale.customerName} className="client-avatar" />
                    <div>
                      <div className="client-name">{sale.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={11} style={{ display: 'inline' }} /> {sale.customerAddress || 'Retirada na Loja'}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '6px 0', borderTop: '1px solid #F6F1EC', borderBottom: '1px solid #F6F1EC', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 600 }}>Itens do pacote:</div>
                    {sale.items.map((it, idx) => (
                      <div key={idx} style={{ color: 'var(--text-secondary)' }}>
                        • {it.quantity}x {it.productName} ({it.size})
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    {hasDebt ? (
                      <span style={{ fontSize: '0.75rem', color: '#C03C54', fontWeight: 800 }}>
                        Fiado: {formatBRL(sale.balanceDue)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#1D7A47', fontWeight: 700 }}>
                        ✓ Pago
                      </span>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={`https://wa.me/55${cleanPhoneForWa(sale.customerPhone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp"
                      >
                        <MessageCircle size={13} />
                      </a>
                      {sale.status !== 'delivered' && (
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleMarkDelivered(sale.id, sale.customerName)}
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <Check size={12} /> Concluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
