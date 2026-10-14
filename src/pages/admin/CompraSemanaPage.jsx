import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { formatBRL } from '../../utils/formatters'
import {
  Luggage,
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
  Phone
} from 'lucide-react'

export function CompraSemanaPage() {
  const { currentTrip, updateTripItemStatus, suppliers } = useApp()

  const [selectedSupplierId, setSelectedSupplierId] = useState('all')
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)
  const [editStatus, setEditStatus] = useState('purchased')
  const [editCost, setEditCost] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editSupplierId, setEditSupplierId] = useState('')

  if (!currentTrip) {
    return (
      <AdminLayout title="Compra da Semana em João Pessoa">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Luggage size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
          <h3>Nenhuma viagem programada no momento</h3>
        </div>
      </AdminLayout>
    )
  }

  const items = currentTrip.items || []

  // Métricas dinâmicas da viagem
  const totalItems = items.length
  const purchasedCount = items.filter(i => i.status === 'purchased').length
  const pendingCount = items.filter(i => i.status === 'pending').length
  const notFoundCount = items.filter(i => i.status === 'not_found').length

  const totalEstimatedCost = items.reduce((acc, i) => acc + (i.estimatedCost * i.quantity), 0)
  const totalActualCost = items.reduce((acc, i) => {
    const cost = i.status === 'purchased' ? (i.actualCost || i.estimatedCost) : i.estimatedCost
    return acc + (cost * i.quantity)
  }, 0)
  const totalSaleValue = items.reduce((acc, i) => acc + (i.salePrice * i.quantity), 0)
  const projectedProfit = totalSaleValue - totalActualCost

  // Fornecedores presentes na viagem
  const tripSupplierIds = Array.from(new Set(items.map(i => i.supplierId)))
  const tripSuppliers = tripSupplierIds.map(id => suppliers.find(s => s.id === id)).filter(Boolean)

  // Itens filtrados por fornecedor
  const filteredItems = selectedSupplierId === 'all'
    ? items
    : items.filter(i => i.supplierId === selectedSupplierId)

  const handleQuickMarkPurchased = (item) => {
    updateTripItemStatus(item.id, {
      status: 'purchased',
      actualCost: item.actualCost || item.estimatedCost
    })
  }

  const handleOpenEditModal = (item) => {
    setSelectedItemForEdit(item)
    setEditStatus(item.status || 'purchased')
    setEditCost(item.actualCost !== null ? item.actualCost.toString() : item.estimatedCost.toString())
    setEditNotes(item.notes || '')
    setEditSupplierId(item.supplierId || '')
  }

  const handleSaveItemEdit = (e) => {
    e.preventDefault()
    if (!selectedItemForEdit) return

    updateTripItemStatus(selectedItemForEdit.id, {
      status: editStatus,
      actualCost: parseFloat(editCost) || selectedItemForEdit.estimatedCost,
      notes: editNotes,
      alternativeSupplierId: editSupplierId !== selectedItemForEdit.supplierId ? editSupplierId : null
    })

    setSelectedItemForEdit(null)
  }

  return (
    <AdminLayout
      title="Compra da Semana — João Pessoa"
      subtitle={`Checklist inteligente de compras por atacado • Viagem de ${currentTrip.date}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Painel de Métricas da Viagem */}
        <div style={{
          background: 'linear-gradient(135deg, #1f1b1d 0%, #291e23 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid #4a3840'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px'
          }}>
            <div>
              <span style={{
                background: 'rgba(200, 157, 92, 0.25)',
                color: '#f0c888',
                border: '1px solid #c89d5c',
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Calendar size={12} /> {currentTrip.date}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                Progresso das Compras em JP
              </h2>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#9de0b5'
            }}>
              {purchasedCount} de {totalItems} peças compradas ({totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0}%)
            </div>
          </div>

          {/* Cards de Métricas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Total de Peças</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                {totalItems} unidades
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#f0c888' }}>
                {pendingCount} pendentes • {notFoundCount} esgotados
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Custo Previsto vs Real</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0b080', marginTop: '4px' }}>
                {formatBRL(totalActualCost)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#a89d96' }}>
                Estimado inicial: {formatBRL(totalEstimatedCost)}
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Total a Arrecadar nas Vendas</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                {formatBRL(totalSaleValue)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#a89d96' }}>
                Preço final pago pelas clientes
              </span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Lucro Projetado da Viagem</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#88e0a3', marginTop: '4px' }}>
                {formatBRL(projectedProfit)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#88e0a3' }}>
                Margem de {totalSaleValue > 0 ? Math.round((projectedProfit / totalSaleValue) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Abas dos Fornecedores em JP */}
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '6px' }}>
              Filtrar por Fornecedor:
            </span>

            <button
              type="button"
              onClick={() => setSelectedSupplierId('all')}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: selectedSupplierId === 'all' ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                background: selectedSupplierId === 'all' ? 'var(--color-primary)' : 'var(--bg-surface)',
                color: selectedSupplierId === 'all' ? '#ffffff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap'
              }}
            >
              Todos ({items.length})
            </button>

            {tripSuppliers.map(supp => {
              const count = items.filter(i => i.supplierId === supp.id).length
              const isSelected = selectedSupplierId === supp.id

              return (
                <button
                  key={supp.id}
                  type="button"
                  onClick={() => setSelectedSupplierId(supp.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Building2 size={13} />
                  <span>{supp.name}</span>
                  <span style={{
                    fontSize: '0.6875rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-subtle)',
                    color: isSelected ? '#fff' : 'inherit'
                  }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Informações do Fornecedor Ativo se filtrado */}
        {selectedSupplierId !== 'all' && (
          (() => {
            const currentSupp = suppliers.find(s => s.id === selectedSupplierId)
            if (!currentSupp) return null
            return (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentSupp.name}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
                    <span>{currentSupp.address} • Box {currentSupp.boxNumber || 'Geral'}</span>
                  </div>
                </div>

                {currentSupp.whatsapp && (
                  <a
                    href={`https://wa.me/55${currentSupp.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ backgroundColor: '#25D366', color: '#fff', gap: '6px' }}
                  >
                    <Phone size={14} /> Contato Fornecedor ({currentSupp.contactName || currentSupp.whatsapp})
                  </a>
                )}
              </div>
            )
          })()
        )}

        {/* Checklist dos Itens da Viagem */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {filteredItems.map(item => {
            const isPurchased = item.status === 'purchased'
            const isNotFound = item.status === 'not_found'
            const hasPriceDiff = item.actualCost && item.actualCost !== item.estimatedCost

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: isPurchased ? '5px solid #28a745' : isNotFound ? '5px solid #dc3545' : '5px solid #c89d5c'
                }}
              >
                <div>
                  {/* Top: Status Badge + Fornecedor */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {item.supplierName}
                    </span>
                    <StatusBadge status={item.status} type="shopping" />
                  </div>

                  {/* Informações da Peça */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.productName}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        border: '1px solid var(--border-subtle)'
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                        {item.productName}
                      </h4>

                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', flexWrap: 'wrap' }}>
                        {item.size && item.size !== 'Único' && (
                          <span style={{ background: 'var(--bg-surface-subtle)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            Tam: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span style={{ background: 'var(--bg-surface-subtle)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            Cor: {item.color}
                          </span>
                        )}
                        <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {item.quantity} un
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        <strong>Destino:</strong> {item.customerName}
                      </div>
                    </div>
                  </div>

                  {/* Custo e Lucro deste item */}
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 10px',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8125rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', display: 'block' }}>Custo Previsto:</span>
                      <strong>{formatBRL(item.estimatedCost)}</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', display: 'block' }}>Custo Real Pago:</span>
                      <strong style={{ color: hasPriceDiff ? 'var(--color-primary)' : 'inherit' }}>
                        {formatBRL(item.actualCost || item.estimatedCost)}
                      </strong>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', display: 'block' }}>Venda Cliente:</span>
                      <strong style={{ color: 'var(--color-primary)' }}>{formatBRL(item.salePrice)}</strong>
                    </div>
                  </div>

                  {item.notes && (
                    <div style={{ fontSize: '0.75rem', color: '#8c5d1c', marginTop: '6px', fontStyle: 'italic' }}>
                      Nota: {item.notes}
                    </div>
                  )}
                </div>

                {/* Ações Rápidas no Card */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  {item.status !== 'purchased' ? (
                    <Button
                      variant="success"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleQuickMarkPurchased(item)}
                      style={{ flex: 1 }}
                    >
                      Comprado
                    </Button>
                  ) : (
                    <Button
                      variant="soft"
                      size="sm"
                      icon={RefreshCw}
                      onClick={() => handleOpenEditModal(item)}
                      style={{ flex: 1 }}
                    >
                      Ajustar Custo
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(item)}
                  >
                    Opções
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal de Ajuste de Custo Real / Status do Item */}
        <Modal
          isOpen={!!selectedItemForEdit}
          onClose={() => setSelectedItemForEdit(null)}
          title={`Atualizar Item da Compra`}
        >
          {selectedItemForEdit && (
            <form onSubmit={handleSaveItemEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedItemForEdit.productName}
                </h4>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Tam: {selectedItemForEdit.size} • Cor: {selectedItemForEdit.color} • Cliente: {selectedItemForEdit.customerName}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Situação na Viagem</label>
                <select
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="purchased">Comprado com Sucesso</option>
                  <option value="price_changed">Preço no Fornecedor Alterado</option>
                  <option value="not_found">Não Encontrado / Sem Estoque</option>
                  <option value="substituted">Substituído por Modelo/Fornecedor Alternativo</option>
                  <option value="pending">Ainda Pendente</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Custo Real Efetivamente Pago (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
                  placeholder="Ex: 48,00"
                  required
                />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Custo previsto original era: {formatBRL(selectedItemForEdit.estimatedCost)}. Ao alterar, o lucro da viagem é recalculado instantaneamente.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Fornecedor onde foi Comprado</label>
                <select
                  className="form-select"
                  value={editSupplierId}
                  onChange={(e) => setEditSupplierId(e.target.value)}
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.address})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Observações da Compra (Opcional)</label>
                <textarea
                  className="form-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ex: Comprado no box vizinho pois o principal estava fechado."
                  style={{ minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedItemForEdit(null)}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={CheckCircle2}
                  style={{ flex: 2 }}
                >
                  Salvar Atualização
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </AdminLayout>
  )
}
