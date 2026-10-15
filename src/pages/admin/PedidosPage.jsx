import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL, formatDateShort, cleanPhoneForWa } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
import {
  ShoppingBag,
  Inbox,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  MessageCircle,
  XCircle,
  Eye,
  AlertCircle,
  Check,
  Calendar,
  MapPin,
  RefreshCw,
  X,
  CreditCard,
  User,
  ShoppingBasket
} from 'lucide-react'

// Mapeamento de avatares com fallback
const CUSTOMER_AVATARS = {
  'Maria Clara Silva': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'Ana Paula Medeiros': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'Juliana Costa': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'Carla Cristina': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'Roberta Lima': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
  'Camila Duarte': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80',
  'Fernanda Souza': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80'
}

function getAvatar(name) {
  return CUSTOMER_AVATARS[name] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
}

export function PedidosPage({ onToast, onNavigate }) {
  const {
    sales = [],
    requests = [],
    customers = [],
    products = [],
    addSale,
    confirmOrderRequest,
    cancelOrderRequest,
    updateSaleStatus,
    recordPayment
  } = useApp()

  // 1. Aba Interna Ativa: 'vendas' ou 'solicitacoes'
  const [internalTab, setInternalTab] = useState('vendas')

  // 2. Busca e Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [salesFilter, setSalesFilter] = useState('all') // all, awaiting_purchase, bought, ready_for_delivery, delivered, with_debt
  const [requestsFilter, setRequestsFilter] = useState('all') // all, new, confirmed, cancelled

  // 3. Modais de Ação
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const [selectedSaleForDetail, setSelectedSaleForDetail] = useState(null)
  const [selectedRequestForConfirm, setSelectedRequestForConfirm] = useState(null)
  const [selectedRequestForCancel, setSelectedRequestForCancel] = useState(null)

  // 4. Form Nova Venda
  const [newSaleCustomerType, setNewSaleCustomerType] = useState('existing') // 'existing' | 'new'
  const [newSaleCustomerId, setNewSaleCustomerId] = useState(customers[0]?.id || '')
  const [newSaleCustomerName, setNewSaleCustomerName] = useState('')
  const [newSaleCustomerPhone, setNewSaleCustomerPhone] = useState('')
  const [newSaleSelectedProduct, setNewSaleSelectedProduct] = useState(products[0]?.id || '')
  const [newSaleSize, setNewSaleSize] = useState('36')
  const [newSaleColor, setNewSaleColor] = useState('Padrão')
  const [newSaleQuantity, setNewSaleQuantity] = useState(1)
  const [newSalePrice, setNewSalePrice] = useState(products[0]?.salePrice || 99.90)
  const [newSaleDeliveryType, setNewSaleDeliveryType] = useState('pickup')
  const [newSaleInitialPayment, setNewSaleInitialPayment] = useState('')
  const [newSalePaymentMethod, setNewSalePaymentMethod] = useState('Pix')
  const [newSaleNotes, setNewSaleNotes] = useState('')

  // 5. Form Baixa de Pagamento
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [paymentNote, setPaymentNote] = useState('')

  // 6. Form Confirmação de Solicitação
  const [confirmInitialPay, setConfirmInitialPay] = useState('')
  const [confirmPayMethod, setConfirmPayMethod] = useState('Pix')
  const [confirmDeliveryFee, setConfirmDeliveryFee] = useState('5.00')

  // 7. Form Cancelamento de Solicitação
  const [cancelReason, setCancelReason] = useState('Produto esgotado no fornecedor de JP')
  const [cancelNote, setCancelNote] = useState('')

  // Métricas de Cabeçalho
  const totalSalesValue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0)
  }, [sales])

  const totalReceivedValue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (parseFloat(s.totalPaid) || 0), 0)
  }, [sales])

  const totalDebtValue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (parseFloat(s.balanceDue) || 0), 0)
  }, [sales])

  const pendingRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'new' || r.status === 'waiting_reply').length
  }, [requests])

  // Filtragem de Vendas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchSearch =
        (sale.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.items || []).some(i => (i.productName || '').toLowerCase().includes(searchTerm.toLowerCase()))

      if (!matchSearch) return false

      if (salesFilter === 'awaiting_purchase') return sale.status === 'awaiting_purchase'
      if (salesFilter === 'bought') return sale.status === 'bought'
      if (salesFilter === 'ready_for_delivery') return sale.status === 'ready_for_delivery'
      if (salesFilter === 'delivered') return sale.status === 'delivered'
      if (salesFilter === 'with_debt') return (parseFloat(sale.balanceDue) || 0) > 0

      return true
    })
  }, [sales, searchTerm, salesFilter])

  // Filtragem de Solicitações
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchSearch =
        (req.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.items || []).some(i => (i.productName || '').toLowerCase().includes(searchTerm.toLowerCase()))

      if (!matchSearch) return false

      if (requestsFilter === 'new') return req.status === 'new' || req.status === 'waiting_reply'
      if (requestsFilter === 'confirmed') return req.status === 'confirmed'
      if (requestsFilter === 'cancelled') return req.status === 'cancelled'

      return true
    })
  }, [requests, searchTerm, requestsFilter])

  // Handlers
  const handleCreateSale = (e) => {
    e.preventDefault()
    let clientName = newSaleCustomerName
    let clientPhone = newSaleCustomerPhone
    let clientId = newSaleCustomerId

    if (newSaleCustomerType === 'existing') {
      const found = customers.find(c => c.id === newSaleCustomerId)
      if (found) {
        clientName = found.name
        clientPhone = found.whatsapp
      }
    }

    if (!clientName.trim()) {
      alert('Por favor, informe o nome da cliente.')
      return
    }

    const prodObj = products.find(p => p.id === newSaleSelectedProduct) || products[0]

    addSale({
      customerId: clientId,
      customerName: clientName,
      customerPhone: clientPhone,
      deliveryType: newSaleDeliveryType,
      deliveryFee: newSaleDeliveryType === 'delivery' ? 5.00 : 0,
      initialPayment: parseFloat(newSaleInitialPayment) || 0,
      paymentMethod: newSalePaymentMethod,
      notes: newSaleNotes,
      items: [
        {
          productId: prodObj?.id || 'prod-custom',
          productName: prodObj?.name || 'Item Personalizado',
          image: prodObj?.images?.[0] || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
          size: newSaleSize,
          color: newSaleColor,
          quantity: parseInt(newSaleQuantity) || 1,
          unitPrice: parseFloat(newSalePrice) || 99.90,
          estimatedCost: (parseFloat(newSalePrice) || 99.90) * 0.5,
          supplierId: prodObj?.supplierIds?.[0] || 'supp-1'
        }
      ]
    })

    setIsNewSaleOpen(false)
    setNewSaleCustomerName('')
    setNewSaleCustomerPhone('')
    setNewSaleInitialPayment('')
    setNewSaleNotes('')
    if (onToast) onToast('Nova venda registrada com sucesso!')
  }

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault()
    if (!selectedSaleForDetail) return

    const amt = parseFloat(paymentAmount)
    if (!amt || amt <= 0) {
      alert('Informe um valor de pagamento válido.')
      return
    }

    recordPayment(selectedSaleForDetail.id, {
      amount: amt,
      method: paymentMethod,
      note: paymentNote
    })

    setPaymentAmount('')
    setPaymentNote('')
    setSelectedSaleForDetail(null)
  }

  const handleConfirmRequestSubmit = (e) => {
    e.preventDefault()
    if (!selectedRequestForConfirm) return

    confirmOrderRequest(selectedRequestForConfirm.id, {
      initialPayment: parseFloat(confirmInitialPay) || 0,
      paymentMethod: confirmPayMethod,
      deliveryFee: parseFloat(confirmDeliveryFee) || 0
    })

    setSelectedRequestForConfirm(null)
    setConfirmInitialPay('')
  }

  const handleCancelRequestSubmit = (e) => {
    e.preventDefault()
    if (!selectedRequestForCancel) return

    cancelOrderRequest(selectedRequestForCancel.id, {
      reason: cancelReason,
      note: cancelNote
    })

    setSelectedRequestForCancel(null)
    setCancelNote('')
  }

  // Helper de Status das Vendas
  const getSaleStatusBadge = (status) => {
    switch (status) {
      case 'awaiting_purchase':
        return <span className="status-pill status-pill-warning"><Clock size={12} /> Aguardando Compra JP</span>
      case 'bought':
        return <span className="status-pill status-pill-info"><ShoppingBag size={12} /> Comprado em JP</span>
      case 'ready_for_delivery':
        return <span className="status-pill status-pill-wine"><Truck size={12} /> Pronto p/ Entrega</span>
      case 'delivered':
        return <span className="status-pill status-pill-success"><CheckCircle2 size={12} /> Entregue / Finalizado</span>
      default:
        return <span className="status-pill status-pill-gray">{status}</span>
    }
  }

  // Helper de Status das Solicitações
  const getRequestStatusBadge = (status) => {
    switch (status) {
      case 'new':
      case 'waiting_reply':
        return <span className="status-pill status-pill-warning"><Clock size={12} /> Nova Solicitação</span>
      case 'confirmed':
        return <span className="status-pill status-pill-success"><CheckCircle2 size={12} /> Confirmada</span>
      case 'cancelled':
        return <span className="status-pill status-pill-gray"><XCircle size={12} /> Cancelada</span>
      default:
        return <span className="status-pill status-pill-gray">{status}</span>
    }
  }

  return (
    <div className="page-container" role="region" aria-label="Gestão de Pedidos e Solicitações">
      {/* 1. Header da Página */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Pedidos</h1>
          <p className="page-header-subtitle">
            Acompanhe vendas confirmadas, pedidos sob encomenda e solicitações do catálogo online.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsNewSaleOpen(true)}
            aria-label="Anotar nova venda direta"
          >
            <Plus size={16} />
            <span>Anotar Nova Venda</span>
          </button>
        </div>
      </div>

      {/* 2. Métricas no Topo */}
      <div className="metrics-row">
        <div className="metric-box">
          <span className="metric-box-title">Vendas Confirmadas</span>
          <div className="metric-box-value">{formatBRL(totalSalesValue)}</div>
          <span className="metric-box-desc">{sales.length} vendas registradas</span>
        </div>

        <div className="metric-box" style={{ borderLeft: '4px solid #731A30' }}>
          <span className="metric-box-title">Solicitações Pendentes</span>
          <div className="metric-box-value" style={{ color: '#731A30' }}>{pendingRequestsCount}</div>
          <span className="metric-box-desc">Aguardando confirmação</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-title">Total Recebido (Caixa)</span>
          <div className="metric-box-value" style={{ color: '#1D7A47' }}>{formatBRL(totalReceivedValue)}</div>
          <span className="metric-box-desc">Pix e dinheiro em caixa</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-title">Fiados em Aberto</span>
          <div className="metric-box-value" style={{ color: '#C03C54' }}>{formatBRL(totalDebtValue)}</div>
          <span className="metric-box-desc">Saldo a receber das clientes</span>
        </div>
      </div>

      {/* 3. Seletor de Abas Internas: Vendas vs Solicitações */}
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
          onClick={() => { setInternalTab('vendas'); setSearchTerm(''); }}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: internalTab === 'vendas' ? 800 : 600,
            color: internalTab === 'vendas' ? '#FFFFFF' : '#4A4240',
            backgroundColor: internalTab === 'vendas' ? '#731A30' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <ShoppingBag size={18} />
          <span>Vendas Confirmadas ({sales.length})</span>
        </button>

        <button
          type="button"
          onClick={() => { setInternalTab('solicitacoes'); setSearchTerm(''); }}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: internalTab === 'solicitacoes' ? 800 : 600,
            color: internalTab === 'solicitacoes' ? '#FFFFFF' : '#4A4240',
            backgroundColor: internalTab === 'solicitacoes' ? '#731A30' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Inbox size={18} />
          <span>Solicitações de Compra</span>
          {pendingRequestsCount > 0 && (
            <span style={{
              background: internalTab === 'solicitacoes' ? '#FFFFFF' : '#731A30',
              color: internalTab === 'solicitacoes' ? '#731A30' : '#FFFFFF',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* 4. Barra de Busca e Filtros */}
      <div className="filters-bar">
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={16} className="search-icon" style={{ left: '12px' }} />
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: '38px', height: '38px', fontSize: '0.8125rem' }}
            placeholder="Buscar por cliente, código (#MI-...) ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {internalTab === 'vendas' ? (
          <div className="filters-group">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Filtro:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'awaiting_purchase', label: 'Aguardando Compra' },
              { id: 'bought', label: 'Compradas em JP' },
              { id: 'ready_for_delivery', label: 'Prontas p/ Entrega' },
              { id: 'with_debt', label: 'Com Fiado em Aberto' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                className={`filter-pill ${salesFilter === f.id ? 'active' : ''}`}
                onClick={() => setSalesFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="filters-group">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Filtro:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'new', label: 'Novas / Pendentes' },
              { id: 'confirmed', label: 'Confirmadas' },
              { id: 'cancelled', label: 'Canceladas' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                className={`filter-pill ${requestsFilter === f.id ? 'active' : ''}`}
                onClick={() => setRequestsFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Conteúdo: Lista de Vendas ou Solicitações */}
      {internalTab === 'vendas' ? (
        /* ================= VENDAS CONFIRMADAS ================= */
        filteredSales.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon">
              <ShoppingBag size={24} />
            </div>
            <div className="empty-state-title">Nenhuma venda encontrada</div>
            <div className="empty-state-desc">
              Não encontramos nenhuma venda com os filtros atuais. Clique em "+ Anotar Nova Venda" para registrar um pedido.
            </div>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
            <div className="table-card recent-orders-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Itens do Pedido</th>
                    <th>Total da Venda</th>
                    <th>Pagamento</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => {
                    const avatarUrl = getAvatar(sale.customerName)
                    const hasDebt = (parseFloat(sale.balanceDue) || 0) > 0

                    return (
                      <tr key={sale.id}>
                        <td>
                          <span style={{ fontWeight: 800, color: '#731A30', fontSize: '0.85rem' }}>
                            {sale.code}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {formatDateShort(sale.createdAt)}
                          </div>
                        </td>

                        <td>
                          <div className="client-cell">
                            <img src={avatarUrl} alt={sale.customerName} className="client-avatar" />
                            <div>
                              <div className="client-name">{sale.customerName}</div>
                              <a
                                href={`https://wa.me/55${cleanPhoneForWa(sale.customerPhone)}?text=${encodeURIComponent(`Olá ${sale.customerName}! Aqui é Edvania da M_I Store referente à sua venda ${sale.code}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '0.72rem', color: '#25D366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              >
                                <MessageCircle size={11} /> WhatsApp
                              </a>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sale.items.map((it, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={it.image}
                                  alt={it.productName}
                                  style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                  <strong>{it.quantity}x</strong> {it.productName} <span style={{ color: 'var(--text-secondary)' }}>(Tam {it.size})</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {formatBRL(sale.total)}
                          </div>
                          {sale.deliveryFee > 0 && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              (Inclui taxa de entrega {formatBRL(sale.deliveryFee)})
                            </span>
                          )}
                        </td>

                        <td>
                          {hasDebt ? (
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#1D7A47', fontWeight: 700 }}>
                                Pago: {formatBRL(sale.totalPaid)}
                              </span>
                              <div style={{ fontSize: '0.8rem', color: '#C03C54', fontWeight: 800, marginTop: '2px' }}>
                                Fiado: {formatBRL(sale.balanceDue)}
                              </div>
                            </div>
                          ) : (
                            <span className="status-pill status-pill-success">
                              <CheckCircle2 size={12} /> 100% Pago
                            </span>
                          )}
                        </td>

                        <td>{getSaleStatusBadge(sale.status)}</td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setSelectedSaleForDetail(sale)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            <Eye size={13} />
                            <span>Detalhes</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile para Vendas */}
            <div className="mobile-order-cards">
              {filteredSales.map((sale) => {
                const avatarUrl = getAvatar(sale.customerName)
                const hasDebt = (parseFloat(sale.balanceDue) || 0) > 0

                return (
                  <div
                    key={sale.id}
                    className="mobile-order-card"
                    onClick={() => setSelectedSaleForDetail(sale)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#731A30', fontSize: '0.9rem' }}>{sale.code}</span>
                      {getSaleStatusBadge(sale.status)}
                    </div>

                    <div className="client-cell">
                      <img src={avatarUrl} alt={sale.customerName} className="client-avatar" />
                      <div>
                        <div className="client-name">{sale.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{formatDateShort(sale.createdAt)}</div>
                      </div>
                    </div>

                    <div style={{ padding: '6px 0', borderTop: '1px solid #F6F1EC', borderBottom: '1px solid #F6F1EC', fontSize: '0.8rem' }}>
                      {sale.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{it.quantity}x {it.productName}</span>
                          <span style={{ color: 'var(--text-muted)' }}>Tam {it.size}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total da Venda</span>
                        <div style={{ fontWeight: 800, color: '#731A30' }}>{formatBRL(sale.total)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {hasDebt ? (
                          <span style={{ fontSize: '0.75rem', color: '#C03C54', fontWeight: 800 }}>
                            Fiado: {formatBRL(sale.balanceDue)}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#1D7A47', fontWeight: 700 }}>
                            ✓ Quitado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )
      ) : (
        /* ================= SOLICITAÇÕES DE COMPRA ================= */
        filteredRequests.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon">
              <Inbox size={24} />
            </div>
            <div className="empty-state-title">Nenhuma solicitação pendente</div>
            <div className="empty-state-desc">
              Todas as solicitações de compra enviadas pelas clientes já foram confirmadas ou tratadas.
            </div>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
            <div className="table-card recent-orders-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Peças Solicitadas</th>
                    <th>Valor Estimado</th>
                    <th>Canal / Entrega</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Decisão da Loja</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const avatarUrl = getAvatar(req.customerName)

                    return (
                      <tr key={req.id}>
                        <td>
                          <span style={{ fontWeight: 800, color: '#731A30', fontSize: '0.85rem' }}>
                            {req.code}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {formatDateShort(req.createdAt)}
                          </div>
                        </td>

                        <td>
                          <div className="client-cell">
                            <img src={avatarUrl} alt={req.customerName} className="client-avatar" />
                            <div>
                              <div className="client-name">{req.customerName}</div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                {req.customerCity}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {req.items.map((it, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={it.image}
                                  alt={it.productName}
                                  style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                  <strong>{it.quantity}x</strong> {it.productName} <span style={{ color: 'var(--text-secondary)' }}>(Tam {it.size})</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {formatBRL(req.subtotal + (req.deliveryFee || 0))}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {req.deliveryType === 'delivery' ? 'Entrega em Domicílio' : 'Retirada na Loja'}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Via {req.channel}
                          </span>
                        </td>

                        <td>{getRequestStatusBadge(req.status)}</td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <a
                              href={`https://wa.me/55${cleanPhoneForWa(req.customerPhone)}?text=${encodeURIComponent(`Olá ${req.customerName}! Aqui é Edvania da M_I Store. Recebi sua solicitação do modelo ${req.items[0]?.productName || ''}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-whatsapp"
                              title="Conversar com a cliente no WhatsApp"
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>

                            {(req.status === 'new' || req.status === 'waiting_reply') && (
                              <>
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => setSelectedRequestForConfirm(req)}
                                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                  title="Confirmar pedido e enviar para a Compra da Semana"
                                >
                                  <Check size={13} /> Confirmar
                                </button>

                                <button
                                  type="button"
                                  className="btn-secondary"
                                  onClick={() => setSelectedRequestForCancel(req)}
                                  style={{ padding: '6px 8px', fontSize: '0.75rem', color: '#A33' }}
                                  title="Recusar ou cancelar"
                                >
                                  <X size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile para Solicitações */}
            <div className="mobile-order-cards">
              {filteredRequests.map((req) => {
                const avatarUrl = getAvatar(req.customerName)

                return (
                  <div key={req.id} className="mobile-order-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#731A30' }}>{req.code}</span>
                      {getRequestStatusBadge(req.status)}
                    </div>

                    <div className="client-cell">
                      <img src={avatarUrl} alt={req.customerName} className="client-avatar" />
                      <div>
                        <div className="client-name">{req.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{req.customerCity}</div>
                      </div>
                    </div>

                    <div style={{ padding: '6px 0', borderTop: '1px solid #F6F1EC', borderBottom: '1px solid #F6F1EC', fontSize: '0.8rem' }}>
                      {req.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{it.quantity}x {it.productName}</span>
                          <span style={{ color: 'var(--text-muted)' }}>Tam {it.size}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                      <strong style={{ color: '#731A30' }}>{formatBRL(req.subtotal + (req.deliveryFee || 0))}</strong>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`https://wa.me/55${cleanPhoneForWa(req.customerPhone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp"
                        >
                          <MessageCircle size={13} />
                        </a>
                        {(req.status === 'new' || req.status === 'waiting_reply') && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => setSelectedRequestForConfirm(req)}
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            <Check size={13} /> Confirmar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )
      )}

      {/* =====================================================================
          MODAIS OPERACIONAIS DA ABA PEDIDOS
          ===================================================================== */}

      {/* MODAL 1: Anotar Nova Venda Direta */}
      <Modal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
        title="Anotar Nova Venda"
        maxWidth="620px"
      >
        <form onSubmit={handleCreateSale} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tipo de Cliente */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #ECE5DE', paddingBottom: '12px' }}>
            <button
              type="button"
              className={`filter-pill ${newSaleCustomerType === 'existing' ? 'active' : ''}`}
              onClick={() => setNewSaleCustomerType('existing')}
            >
              Cliente Cadastrada
            </button>
            <button
              type="button"
              className={`filter-pill ${newSaleCustomerType === 'new' ? 'active' : ''}`}
              onClick={() => setNewSaleCustomerType('new')}
            >
              + Nova Cliente
            </button>
          </div>

          {newSaleCustomerType === 'existing' ? (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Selecione a Cliente:
              </label>
              <select
                className="search-input"
                style={{ height: '42px', padding: '0 12px', marginTop: '4px' }}
                value={newSaleCustomerId}
                onChange={(e) => setNewSaleCustomerId(e.target.value)}
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.whatsapp}) - {c.city}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Nome da Cliente:</label>
                <input
                  type="text"
                  required
                  className="search-input"
                  style={{ height: '40px', padding: '0 12px', marginTop: '4px' }}
                  placeholder="Ex: Amanda Bezerra"
                  value={newSaleCustomerName}
                  onChange={(e) => setNewSaleCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>WhatsApp:</label>
                <input
                  type="text"
                  required
                  className="search-input"
                  style={{ height: '40px', padding: '0 12px', marginTop: '4px' }}
                  placeholder="Ex: 83991223344"
                  value={newSaleCustomerPhone}
                  onChange={(e) => setNewSaleCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Seleção do Produto */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Produto:</label>
            <select
              className="search-input"
              style={{ height: '42px', padding: '0 12px', marginTop: '4px' }}
              value={newSaleSelectedProduct}
              onChange={(e) => {
                setNewSaleSelectedProduct(e.target.value)
                const p = products.find(prod => prod.id === e.target.value)
                if (p) setNewSalePrice(p.salePrice)
              }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - R$ {p.salePrice?.toFixed(2).replace('.', ',')}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Tamanho:</label>
              <input
                type="text"
                className="search-input"
                style={{ height: '40px', padding: '0 10px', marginTop: '4px' }}
                value={newSaleSize}
                onChange={(e) => setNewSaleSize(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Cor:</label>
              <input
                type="text"
                className="search-input"
                style={{ height: '40px', padding: '0 10px', marginTop: '4px' }}
                value={newSaleColor}
                onChange={(e) => setNewSaleColor(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Qtd:</label>
              <input
                type="number"
                min="1"
                className="search-input"
                style={{ height: '40px', padding: '0 10px', marginTop: '4px' }}
                value={newSaleQuantity}
                onChange={(e) => setNewSaleQuantity(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Valor de Venda (R$):</label>
              <input
                type="number"
                step="0.01"
                required
                className="search-input"
                style={{ height: '40px', padding: '0 12px', marginTop: '4px' }}
                value={newSalePrice}
                onChange={(e) => setNewSalePrice(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Modalidade:</label>
              <select
                className="search-input"
                style={{ height: '40px', padding: '0 12px', marginTop: '4px' }}
                value={newSaleDeliveryType}
                onChange={(e) => setNewSaleDeliveryType(e.target.value)}
              >
                <option value="pickup">Retirada na Loja (R$ 0,00)</option>
                <option value="delivery">Entrega em Domicílio (+ R$ 5,00)</option>
              </select>
            </div>
          </div>

          {/* Pagamento e Fiado */}
          <div style={{ background: '#FDF9F7', padding: '14px', borderRadius: '10px', border: '1px solid #ECE5DE' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#731A30', textTransform: 'uppercase' }}>
              Condição de Pagamento:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '8px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Entrada Paga Agora (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  className="search-input"
                  style={{ height: '38px', padding: '0 12px', marginTop: '4px' }}
                  placeholder="0 para fiado integral"
                  value={newSaleInitialPayment}
                  onChange={(e) => setNewSaleInitialPayment(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Forma da Entrada:</label>
                <select
                  className="search-input"
                  style={{ height: '38px', padding: '0 12px', marginTop: '4px' }}
                  value={newSalePaymentMethod}
                  onChange={(e) => setNewSalePaymentMethod(e.target.value)}
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão">Cartão</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              O valor restante vira fiado automaticamente com vencimento em 15 dias.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsNewSaleOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Salvar e Enviar p/ Compra
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Detalhes da Venda & Baixa de Pagamento */}
      {selectedSaleForDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSaleForDetail(null)}
          title={`Venda ${selectedSaleForDetail.code}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header da Venda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #ECE5DE', paddingBottom: '12px' }}>
              <img
                src={getAvatar(selectedSaleForDetail.customerName)}
                alt={selectedSaleForDetail.customerName}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedSaleForDetail.customerName}
                  </h3>
                  {getSaleStatusBadge(selectedSaleForDetail.status)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Tel: {selectedSaleForDetail.customerPhone} • {formatDateShort(selectedSaleForDetail.createdAt)}
                </div>
              </div>
            </div>

            {/* Peças Encomendadas */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Itens da Venda:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {selectedSaleForDetail.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FDF9F7', borderRadius: '8px', border: '1px solid #ECE5DE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={it.image} alt={it.productName} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{it.productName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Tam: {it.size} | Cor: {it.color} | Qtd: {it.quantity}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#731A30', fontSize: '0.9rem' }}>
                      {formatBRL(it.unitPrice * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financeiro e Saldo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#FDF5F5', padding: '14px', borderRadius: '10px', border: '1px solid #FAD1D6' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total da Venda</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatBRL(selectedSaleForDetail.total)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Já Pago</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1D7A47' }}>
                  {formatBRL(selectedSaleForDetail.totalPaid)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Saldo Devedor (Fiado)</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#C03C54' }}>
                  {formatBRL(selectedSaleForDetail.balanceDue)}
                </div>
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Histórico de Pagamentos:
              </span>
              {(selectedSaleForDetail.payments || []).length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '8px 0' }}>
                  Nenhum pagamento registrado ainda (fiado integral).
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {selectedSaleForDetail.payments.map((p, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#FFFFFF', border: '1px solid #ECE5DE', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <span><strong>{formatBRL(p.amount)}</strong> via {p.method} ({formatDateShort(p.date)})</span>
                      <span style={{ color: 'var(--text-muted)' }}>{p.note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Abater Fiado (se houver saldo) */}
            {selectedSaleForDetail.balanceDue > 0 && (
              <form onSubmit={handleRecordPaymentSubmit} style={{ borderTop: '1px solid #ECE5DE', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#731A30' }}>
                  + Dar Baixa em Pagamento (Abater Fiado):
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <input
                    type="number"
                    step="0.01"
                    max={selectedSaleForDetail.balanceDue}
                    required
                    className="search-input"
                    style={{ height: '38px', padding: '0 12px' }}
                    placeholder={`Valor até ${formatBRL(selectedSaleForDetail.balanceDue)}`}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />

                  <select
                    className="search-input"
                    style={{ height: '38px', padding: '0 12px' }}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary">
                    <Check size={14} /> Registrar Pagamento
                  </button>
                </div>
              </form>
            )}

            {/* Alternar Status da Venda */}
            <div style={{ borderTop: '1px solid #ECE5DE', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mudar etapa da venda:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  onClick={() => {
                    updateSaleStatus(selectedSaleForDetail.id, 'bought')
                    setSelectedSaleForDetail(prev => ({ ...prev, status: 'bought' }))
                  }}
                >
                  Marcar Comprado
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  onClick={() => {
                    updateSaleStatus(selectedSaleForDetail.id, 'ready_for_delivery')
                    setSelectedSaleForDetail(prev => ({ ...prev, status: 'ready_for_delivery' }))
                  }}
                >
                  Pronto p/ Entrega
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  onClick={() => {
                    updateSaleStatus(selectedSaleForDetail.id, 'delivered')
                    setSelectedSaleForDetail(prev => ({ ...prev, status: 'delivered' }))
                  }}
                >
                  Finalizar Venda
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: Confirmar Solicitação de Compra */}
      {selectedRequestForConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequestForConfirm(null)}
          title={`Confirmar Solicitação ${selectedRequestForConfirm.code}`}
          maxWidth="560px"
        >
          <form onSubmit={handleConfirmRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Ao confirmar, a solicitação vira uma <strong>Venda Confirmada</strong> e as peças entram automaticamente na <strong>Compra da Semana em João Pessoa</strong>.
            </p>

            <div style={{ background: '#FDF9F7', padding: '12px', borderRadius: '8px', border: '1px solid #ECE5DE' }}>
              <div className="client-cell">
                <img src={getAvatar(selectedRequestForConfirm.customerName)} alt={selectedRequestForConfirm.customerName} className="client-avatar" />
                <div>
                  <div className="client-name">{selectedRequestForConfirm.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedRequestForConfirm.customerCity}</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                <strong>Itens:</strong> {selectedRequestForConfirm.items.map(i => `${i.quantity}x ${i.productName} (${i.size})`).join(', ')}
              </div>
              <div style={{ marginTop: '4px', fontSize: '0.9rem', fontWeight: 800, color: '#731A30' }}>
                Valor Total: {formatBRL(selectedRequestForConfirm.subtotal + (selectedRequestForConfirm.deliveryFee || 0))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Entrada Paga no Pix (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="search-input"
                  style={{ height: '38px', padding: '0 12px', marginTop: '4px' }}
                  placeholder="0 para fiado total"
                  value={confirmInitialPay}
                  onChange={(e) => setConfirmInitialPay(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Taxa de Entrega (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="search-input"
                  style={{ height: '38px', padding: '0 12px', marginTop: '4px' }}
                  value={confirmDeliveryFee}
                  onChange={(e) => setConfirmDeliveryFee(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedRequestForConfirm(null)}
              >
                Voltar
              </button>
              <button type="submit" className="btn-primary">
                <Check size={16} /> Confirmar Pedido
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 4: Recusar / Cancelar Solicitação */}
      {selectedRequestForCancel && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequestForCancel(null)}
          title={`Recusar Solicitação ${selectedRequestForCancel.code}`}
          maxWidth="500px"
        >
          <form onSubmit={handleCancelRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Informe o motivo para justificar a recusa à cliente {selectedRequestForCancel.customerName}:
            </p>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Motivo:</label>
              <select
                className="search-input"
                style={{ height: '40px', padding: '0 12px', marginTop: '4px' }}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Produto esgotado no fornecedor de JP">Produto esgotado no fornecedor de JP</option>
                <option value="Tamanho ou cor indisponível">Tamanho ou cor indisponível</option>
                <option value="Cliente desistiu da compra">Cliente desistiu da compra</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Observação Interna:</label>
              <textarea
                className="search-input"
                style={{ height: '70px', padding: '8px 12px', marginTop: '4px' }}
                placeholder="Detalhes adicionais..."
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <a
                href={`https://wa.me/55${cleanPhoneForWa(selectedRequestForCancel.customerPhone)}?text=${encodeURIComponent(`Olá ${selectedRequestForCancel.customerName}! Aqui é Edvania da M_I Store. Infelizmente o modelo solicitado não está disponível nesta remessa (${cancelReason}). Podemos ver outra opção linda para você?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle size={14} /> Avisar no WhatsApp
              </a>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedRequestForCancel(null)}
                >
                  Voltar
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#A33' }}>
                  Recusar Pedido
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
