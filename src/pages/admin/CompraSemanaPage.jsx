import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL, cleanPhoneForWa } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
import {
  Luggage,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
  DollarSign,
  TrendingUp,
  MapPin,
  RefreshCw,
  Phone,
  MessageCircle,
  Filter,
  Check,
  Edit2,
  HelpCircle,
  Store,
  Clock,
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
  'Mariana Silva': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
  'Sabrina F.': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80'
}

function getAvatar(name) {
  return CUSTOMER_AVATARS[name] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
}

export function CompraSemanaPage({ onToast, onNavigate }) {
  const { currentTrip, updateTripItemStatus, suppliers = [] } = useApp()

  const [selectedSupplierId, setSelectedSupplierId] = useState('all')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all') // all, pending, purchased, not_found, substituted
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)

  // Form states do Modal de Ajuste de Item
  const [editStatus, setEditStatus] = useState('purchased')
  const [editCost, setEditCost] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editSupplierId, setEditSupplierId] = useState('')

  const items = currentTrip?.items || []

  // Métricas Dinâmicas
  const totalItems = items.length
  const purchasedCount = items.filter(i => i.status === 'purchased').length
  const pendingCount = items.filter(i => i.status === 'pending').length
  const notFoundCount = items.filter(i => i.status === 'not_found').length
  const substitutedCount = items.filter(i => i.status === 'substituted').length

  const totalEstimatedCost = useMemo(() => {
    return items.reduce((acc, i) => acc + ((parseFloat(i.estimatedCost) || 0) * (parseInt(i.quantity) || 1)), 0)
  }, [items])

  const totalActualCost = useMemo(() => {
    return items.reduce((acc, i) => {
      const cost = i.status === 'purchased' ? (parseFloat(i.actualCost) || parseFloat(i.estimatedCost) || 0) : (parseFloat(i.estimatedCost) || 0)
      return acc + (cost * (parseInt(i.quantity) || 1))
    }, 0)
  }, [items])

  const totalSaleValue = useMemo(() => {
    return items.reduce((acc, i) => acc + ((parseFloat(i.salePrice) || 0) * (parseInt(i.quantity) || 1)), 0)
  }, [items])

  const projectedProfit = totalSaleValue - totalActualCost
  const progressPercent = totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0

  // Fornecedores presentes na lista desta viagem
  const tripSuppliers = useMemo(() => {
    const suppMap = new Map()
    items.forEach(item => {
      const supp = suppliers.find(s => s.id === item.supplierId) || {
        id: item.supplierId,
        name: item.supplierName || 'Fornecedor JP',
        city: 'João Pessoa'
      }
      if (!suppMap.has(supp.id)) {
        suppMap.set(supp.id, {
          ...supp,
          itemsCount: 0,
          totalCost: 0
        })
      }
      const entry = suppMap.get(supp.id)
      entry.itemsCount += item.quantity
      entry.totalCost += (item.actualCost || item.estimatedCost) * item.quantity
    })
    return Array.from(suppMap.values())
  }, [items, suppliers])

  // Filtragem dos Itens
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedSupplierId !== 'all' && item.supplierId !== selectedSupplierId) return false
      if (selectedStatusFilter !== 'all' && item.status !== selectedStatusFilter) return false
      return true
    })
  }, [items, selectedSupplierId, selectedStatusFilter])

  // Agrupamento por Fornecedor para Exibição
  const groupedBySupplier = useMemo(() => {
    const groups = {}
    filteredItems.forEach(item => {
      const sId = item.supplierId || 'unknown'
      if (!groups[sId]) {
        const suppObj = suppliers.find(s => s.id === sId)
        groups[sId] = {
          supplier: suppObj || { id: sId, name: item.supplierName || 'Fornecedor JP', location: 'João Pessoa' },
          items: []
        }
      }
      groups[sId].items.push(item)
    })
    return Object.values(groups)
  }, [filteredItems, suppliers])

  // Handlers Rápidos
  const handleQuickMarkPurchased = (item) => {
    const newStatus = item.status === 'purchased' ? 'pending' : 'purchased'
    updateTripItemStatus(item.id, {
      status: newStatus,
      actualCost: item.actualCost !== null ? item.actualCost : item.estimatedCost
    })
    if (onToast) onToast(`Item "${item.productName}" marcado como ${newStatus === 'purchased' ? 'comprado' : 'a comprar'}!`)
  }

  const handleOpenEditModal = (item) => {
    setSelectedItemForEdit(item)
    setEditStatus(item.status || 'pending')
    setEditCost(item.actualCost !== null && item.actualCost !== undefined ? item.actualCost.toString() : item.estimatedCost.toString())
    setEditNotes(item.notes || '')
    setEditSupplierId(item.supplierId || suppliers[0]?.id || '')
  }

  const handleSaveItemEdit = (e) => {
    e.preventDefault()
    if (!selectedItemForEdit) return

    updateTripItemStatus(selectedItemForEdit.id, {
      status: editStatus,
      actualCost: editCost ? parseFloat(editCost) : selectedItemForEdit.estimatedCost,
      notes: editNotes,
      alternativeSupplierId: editSupplierId
    })

    setSelectedItemForEdit(null)
    if (onToast) onToast('Item da viagem atualizado com sucesso!')
  }

  // Helper de Status
  const getItemStatusBadge = (status) => {
    switch (status) {
      case 'purchased':
        return <span className="status-pill status-pill-success"><CheckCircle2 size={12} /> Comprado</span>
      case 'not_found':
        return <span className="status-pill status-pill-warning" style={{ background: '#FDEBEB', color: '#C03C54', borderColor: '#F7D4D7' }}><XCircle size={12} /> Não encontrado</span>
      case 'substituted':
        return <span className="status-pill status-pill-info"><RefreshCw size={12} /> Substituído</span>
      case 'pending':
      default:
        return <span className="status-pill status-pill-warning"><Clock size={12} /> A comprar</span>
    }
  }

  return (
    <div className="page-container" role="region" aria-label="Compra da Semana em João Pessoa">
      {/* 1. Header da Página */}
      <div className="page-header">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FDF5F5', color: '#731A30', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <Calendar size={13} /> Próxima Viagem: Quinta-feira, 30 de Maio de 2025 (Em 4 dias)
          </div>
          <h1 className="page-header-title">Compra da Semana em João Pessoa</h1>
          <p className="page-header-subtitle">
            Seu companheiro de viagem em JP: confira itens por fornecedor, registre custo real e garanta o lucro da loja.
          </p>
        </div>
      </div>

      {/* 2. Métricas da Viagem */}
      <div className="metrics-row">
        {/* Progresso de Peças */}
        <div className="metric-box">
          <span className="metric-box-title">Progresso da Viagem</span>
          <div className="metric-box-value" style={{ color: '#731A30' }}>
            {purchasedCount} de {totalItems} peças
          </div>
          <div style={{ width: '100%', height: '8px', background: '#EFE8E1', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#1D7A47', transition: 'width 0.4s ease' }} />
          </div>
          <span className="metric-box-desc" style={{ marginTop: '4px' }}>
            {progressPercent}% da lista já comprada ({pendingCount} restantes)
          </span>
        </div>

        {/* Custo Total */}
        <div className="metric-box">
          <span className="metric-box-title">Custo Total de Compras</span>
          <div className="metric-box-value">
            {formatBRL(totalActualCost)}
          </div>
          <span className="metric-box-desc">
            Estimado inicial: {formatBRL(totalEstimatedCost)}
          </span>
        </div>

        {/* Faturamento e Lucro */}
        <div className="metric-box" style={{ borderLeft: '4px solid #1D7A47' }}>
          <span className="metric-box-title">Lucro Projetado da Viagem</span>
          <div className="metric-box-value" style={{ color: '#1D7A47' }}>
            {formatBRL(projectedProfit)}
          </div>
          <span className="metric-box-desc">
            Valor de venda: {formatBRL(totalSaleValue)} (Margem {Math.round((projectedProfit / (totalSaleValue || 1)) * 100)}%)
          </span>
        </div>

        {/* Itens com Alerta */}
        <div className="metric-box">
          <span className="metric-box-title">Itens Não Encontrados</span>
          <div className="metric-box-value" style={{ color: notFoundCount > 0 ? '#C03C54' : 'var(--text-secondary)' }}>
            {notFoundCount}
          </div>
          <span className="metric-box-desc">
            {substitutedCount} itens substituídos
          </span>
        </div>
      </div>

      {/* 3. Filtros por Fornecedor (Agrupamento Inicial) */}
      <div className="filters-bar" style={{ gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#731A30', textTransform: 'uppercase' }}>
            Fornecedores em JP:
          </span>

          <button
            type="button"
            className={`filter-pill ${selectedSupplierId === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedSupplierId('all')}
          >
            Todos ({items.length})
          </button>

          {tripSuppliers.map(supp => (
            <button
              key={supp.id}
              type="button"
              className={`filter-pill ${selectedSupplierId === supp.id ? 'active' : ''}`}
              onClick={() => setSelectedSupplierId(supp.id)}
            >
              <Store size={13} />
              <span>{supp.name} ({supp.itemsCount})</span>
            </button>
          ))}
        </div>

        {/* Filtro secundário por status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #ECE5DE', width: '100%' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
          {[
            { id: 'all', label: 'Todos os Status' },
            { id: 'pending', label: 'A Comprar' },
            { id: 'purchased', label: 'Comprados' },
            { id: 'not_found', label: 'Não Encontrados' },
            { id: 'substituted', label: 'Substituídos' }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              className={`filter-pill ${selectedStatusFilter === st.id ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => setSelectedStatusFilter(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Lista Agrupada por Fornecedor */}
      {filteredItems.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-state-icon">
            <Luggage size={24} />
          </div>
          <div className="empty-state-title">Nenhum item com este filtro</div>
          <div className="empty-state-desc">
            Todos os itens deste fornecedor ou status já foram tratados ou não há peças correspondentes.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {groupedBySupplier.map(group => (
            <div key={group.supplier.id} className="table-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header do Fornecedor */}
              <div style={{
                background: '#FAF7F5',
                borderBottom: '1px solid #ECE5DE',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FCEEEE', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                      {group.supplier.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {group.supplier.location || group.supplier.address || 'João Pessoa - PB'}
                      {group.supplier.whatsapp && (
                        <span> • Tel: {group.supplier.whatsapp}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {group.supplier.whatsapp && (
                    <a
                      href={`https://wa.me/55${cleanPhoneForWa(group.supplier.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                      style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                    >
                      <MessageCircle size={12} /> WhatsApp Fornecedor
                    </a>
                  )}
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#731A30', background: '#FFF0F2', padding: '4px 10px', borderRadius: '12px', border: '1px solid #FAD1D6' }}>
                    {group.items.reduce((acc, i) => acc + i.quantity, 0)} peça(s) a buscar
                  </span>
                </div>
              </div>

              {/* Tabela de Itens deste Fornecedor */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>OK</th>
                      <th>Produto / Variação</th>
                      <th>Qtd</th>
                      <th>Cliente Relacionada</th>
                      <th>Custo Estimado</th>
                      <th>Custo Real Observado</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map(item => {
                      const avatarUrl = getAvatar(item.customerName)
                      const isBought = item.status === 'purchased'

                      return (
                        <tr
                          key={item.id}
                          style={{
                            backgroundColor: isBought ? '#F9FDF9' : item.status === 'not_found' ? '#FFF8F8' : 'transparent',
                            opacity: isBought ? 0.85 : 1
                          }}
                        >
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isBought}
                              onChange={() => handleQuickMarkPurchased(item)}
                              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#731A30' }}
                              title="Marcar como comprado"
                            />
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={item.image}
                                alt={item.productName}
                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ECE5DE' }}
                              />
                              <div>
                                <strong style={{ fontSize: '0.875rem', color: isBought ? '#1D7A47' : 'var(--text-primary)', textDecoration: isBought ? 'line-through' : 'none' }}>
                                  {item.productName}
                                </strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  Tam: <strong>{item.size}</strong> | Cor: <strong>{item.color}</strong>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {item.quantity}x
                          </td>

                          <td>
                            <div className="client-cell">
                              <img src={avatarUrl} alt={item.customerName} className="client-avatar" />
                              <div>
                                <span className="client-name">{item.customerName}</span>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.saleCode}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {formatBRL(item.estimatedCost)}
                            </span>
                          </td>

                          <td>
                            {item.actualCost !== null && item.actualCost !== undefined ? (
                              <strong style={{ fontSize: '0.9rem', color: '#731A30' }}>
                                {formatBRL(item.actualCost)}
                              </strong>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                A informar
                              </span>
                            )}
                          </td>

                          <td>{getItemStatusBadge(item.status)}</td>

                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleOpenEditModal(item)}
                              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                              title="Ajustar custo real, fornecedor ou status"
                            >
                              <Edit2 size={13} />
                              <span>Ajustar</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile para os Itens do Fornecedor */}
              <div className="mobile-order-cards" style={{ padding: '12px' }}>
                {group.items.map(item => {
                  const avatarUrl = getAvatar(item.customerName)
                  const isBought = item.status === 'purchased'

                  return (
                    <div
                      key={item.id}
                      className="mobile-order-card"
                      style={{
                        backgroundColor: isBought ? '#F9FDF9' : item.status === 'not_found' ? '#FFF8F8' : '#FFFFFF',
                        borderLeft: isBought ? '4px solid #1D7A47' : '1px solid #ECE5DE'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={isBought}
                            onChange={() => handleQuickMarkPurchased(item)}
                            style={{ width: '22px', height: '22px', accentColor: '#731A30' }}
                          />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isBought ? '#1D7A47' : '#2A2426' }}>
                            {isBought ? '✓ Comprado' : 'A Comprar'}
                          </span>
                        </div>
                        {getItemStatusBadge(item.status)}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '4px 0' }}>
                        <img src={item.image} alt={item.productName} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.productName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Tamanho: <strong>{item.size}</strong> | Cor: <strong>{item.color}</strong> | Qtd: <strong>{item.quantity}</strong>
                          </div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#731A30', marginTop: '2px' }}>
                            Custo Real: {item.actualCost ? formatBRL(item.actualCost) : formatBRL(item.estimatedCost)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F6F1EC' }}>
                        <div className="client-cell">
                          <img src={avatarUrl} alt={item.customerName} className="client-avatar" style={{ width: '26px', height: '26px' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{item.customerName}</span>
                        </div>

                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => handleOpenEditModal(item)}
                          style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                        >
                          <Edit2 size={12} /> Ajustar Custo
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Ajustar Item da Viagem (Custo Real, Troca de Fornecedor, Status) */}
      {selectedItemForEdit && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItemForEdit(null)}
          title="Ajustar Item da Compra"
          maxWidth="560px"
        >
          <form onSubmit={handleSaveItemEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#FDF9F7', padding: '12px', borderRadius: '8px', border: '1px solid #ECE5DE' }}>
              <img src={selectedItemForEdit.image} alt={selectedItemForEdit.productName} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{selectedItemForEdit.productName}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Tam {selectedItemForEdit.size} | Cor {selectedItemForEdit.color} | Qtd: {selectedItemForEdit.quantity}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#731A30', fontWeight: 600 }}>
                  Cliente: {selectedItemForEdit.customerName} ({selectedItemForEdit.saleCode})
                </div>
              </div>
            </div>

            {/* Status do Item (Os 4 Estados Obrigatórios) */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Status do Item na Viagem:
              </label>
              <select
                className="search-input"
                style={{ height: '42px', padding: '0 12px', marginTop: '4px' }}
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">A comprar (Aguardando)</option>
                <option value="purchased">✓ Comprado</option>
                <option value="not_found">✕ Não encontrado</option>
                <option value="substituted">⇄ Substituído</option>
              </select>
            </div>

            {/* Custo Real Observado */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Custo Real Pago ao Fornecedor (R$ por unidade):
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="search-input"
                style={{ height: '42px', padding: '0 12px', marginTop: '4px' }}
                value={editCost}
                onChange={(e) => setEditCost(e.target.value)}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Custo estimado inicial era: {formatBRL(selectedItemForEdit.estimatedCost)}. Ao alterar, o lucro da loja é recalculado na hora.
              </span>
            </div>

            {/* Troca de Fornecedor */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Fornecedor em João Pessoa:
              </label>
              <select
                className="search-input"
                style={{ height: '42px', padding: '0 12px', marginTop: '4px' }}
                value={editSupplierId}
                onChange={(e) => setEditSupplierId(e.target.value)}
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location || s.city})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Encontrou em outro box da galeria? Mude o fornecedor aqui para salvar onde comprou.
              </span>
            </div>

            {/* Observação */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Observação:</label>
              <input
                type="text"
                className="search-input"
                style={{ height: '38px', padding: '0 12px', marginTop: '4px' }}
                placeholder="Ex: Peguei tamanho 37 porque não tinha 36"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedItemForEdit(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                <Check size={16} /> Salvar Alterações
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
