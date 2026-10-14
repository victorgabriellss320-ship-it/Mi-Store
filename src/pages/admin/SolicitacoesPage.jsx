import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { Drawer } from '../../components/common/Drawer'
import { formatBRL, formatDateShort, cleanPhoneForWa } from '../../utils/formatters'
import {
  Inbox,
  Search,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react'

export function SolicitacoesPage() {
  const { requests, confirmOrderRequest, cancelOrderRequest, viewParams } = useApp()

  const [filterStatus, setFilterStatus] = useState('all') // all, new, waiting_response, confirmed, cancelled
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  // Form de Confirmação
  const [initialPayment, setInitialPayment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [confirmDeliveryFee, setConfirmDeliveryFee] = useState(0)
  const [confirmNotes, setConfirmNotes] = useState('')

  // Form de Cancelamento
  const [cancelReason, setCancelReason] = useState('Cliente desistiu da encomenda')
  const [cancelNotes, setCancelNotes] = useState('')

  // Abre automaticamente solicitação se veio de viewParams
  useEffect(() => {
    if (viewParams && viewParams.selectedRequestId) {
      const found = requests.find(r => r.id === viewParams.selectedRequestId)
      if (found) setSelectedRequest(found)
    }
  }, [viewParams, requests])

  // Mantém selectedRequest atualizado com o estado mais recente
  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find(r => r.id === selectedRequest.id)
      if (updated) setSelectedRequest(updated)
    }
  }, [requests])

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus
    const matchesSearch = req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customerPhone.includes(searchTerm)

    return matchesStatus && matchesSearch
  })

  const handleOpenConfirm = () => {
    if (!selectedRequest) return
    setInitialPayment('')
    setPaymentMethod('Pix')
    setConfirmDeliveryFee(selectedRequest.deliveryFee || 0)
    setConfirmNotes('')
    setIsConfirmModalOpen(true)
  }

  const handleConfirmSubmit = (e) => {
    e.preventDefault()
    if (!selectedRequest) return

    confirmOrderRequest(selectedRequest.id, {
      initialPayment: parseFloat(initialPayment) || 0,
      paymentMethod,
      deliveryFee: parseFloat(confirmDeliveryFee) || 0,
      notes: confirmNotes
    })

    setIsConfirmModalOpen(false)
  }

  const handleOpenCancel = () => {
    setCancelReason('Cliente desistiu da encomenda')
    setCancelNotes('')
    setIsCancelModalOpen(true)
  }

  const handleCancelSubmit = (e) => {
    e.preventDefault()
    if (!selectedRequest) return

    cancelOrderRequest(selectedRequest.id, {
      reason: cancelReason,
      note: cancelNotes
    })

    setIsCancelModalOpen(false)
  }

  return (
    <AdminLayout
      title="Solicitações de Encomenda"
      subtitle="Gerencie pedidos enviados pelo catálogo e confirme para inclusão na viagem de compras"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Barra de Filtros e Busca */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            {/* Abas de Status */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Todas', count: requests.length },
                { id: 'new', label: 'Novas', count: requests.filter(r => r.status === 'new').length, highlight: true },
                { id: 'confirmed', label: 'Confirmadas', count: requests.filter(r => r.status === 'confirmed').length },
                { id: 'cancelled', label: 'Canceladas', count: requests.filter(r => r.status === 'cancelled').length }
              ].map(tab => {
                const isActive = filterStatus === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterStatus(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'var(--color-primary)' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: '0.6875rem',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-subtle)',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      color: isActive ? '#fff' : 'inherit'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Campo de Busca */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar por código, cliente ou WhatsApp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', height: '36px' }}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Solicitações */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Código</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Data / Canal</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Itens Encomendados</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Nenhuma solicitação encontrada para o filtro selecionado.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(req => {
                    const isNew = req.status === 'new'
                    return (
                      <tr
                        key={req.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isNew ? '#fffcf7' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onClick={() => setSelectedRequest(req)}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = isNew ? '#fffcf7' : 'transparent' }}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {req.code}
                        </td>

                        <td style={{ padding: '14px 16px', fontSize: '0.8125rem' }}>
                          <div>{formatDateShort(req.createdAt)}</div>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{req.channel}</span>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{req.customerPhone}</div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 500 }}>
                            {req.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {req.items.length} {req.items.length === 1 ? 'modelo' : 'modelos'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatBRL(req.total)}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge status={req.status} type="request" />
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRequest(req)
                            }}
                          >
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawer de Detalhes da Solicitação */}
        <Drawer
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Solicitação ${selectedRequest?.code || ''}`}
          width="540px"
          footer={
            selectedRequest && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedRequest.status === 'new' && (
                  <>
                    <Button
                      variant="primary"
                      size="md"
                      icon={CheckCircle2}
                      onClick={handleOpenConfirm}
                      style={{ flex: 1 }}
                    >
                      Confirmar Venda
                    </Button>

                    <Button
                      variant="danger"
                      size="md"
                      icon={XCircle}
                      onClick={handleOpenCancel}
                    >
                      Cancelar
                    </Button>
                  </>
                )}

                {selectedRequest.status === 'confirmed' && (
                  <div style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--status-success-bg)',
                    color: 'var(--status-success-text)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    ✓ Esta solicitação já foi confirmada e seus itens estão na lista de compras!
                  </div>
                )}
              </div>
            )
          }
        >
          {selectedRequest && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header do Drawer */}
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status da Solicitação</span>
                  <div style={{ marginTop: '2px' }}>
                    <StatusBadge status={selectedRequest.status} type="request" />
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data de Envio</span>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: '2px' }}>
                    {formatDateShort(selectedRequest.createdAt)}
                  </div>
                </div>
              </div>

              {/* Contato do Cliente */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Dados do Cliente
                </h4>
                <div style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        {selectedRequest.customerName}
                      </strong>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {selectedRequest.customerPhone}
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${cleanPhoneForWa(selectedRequest.customerPhone)}?text=${encodeURIComponent(`Olá ${selectedRequest.customerName}! Aqui é Edvania da M_I Store. Recebi sua encomenda ${selectedRequest.code}!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                        fontWeight: 600,
                        gap: '6px'
                      }}
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                    <strong>Entrega / Local:</strong> {selectedRequest.deliveryType === 'delivery' ? 'Entrega em domicílio' : 'Retirada no local'}
                    {selectedRequest.customerCity && ` • ${selectedRequest.customerCity}`}
                    {selectedRequest.customerAddress && ` • ${selectedRequest.customerAddress}`}
                  </div>

                  {selectedRequest.notes && (
                    <div style={{ fontSize: '0.8125rem', color: '#b35e16', background: 'var(--status-warning-bg)', padding: '6px 10px', borderRadius: '4px' }}>
                      <strong>Observações do Cliente:</strong> "{selectedRequest.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de Itens Encomendados */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Itens da Encomenda ({selectedRequest.items.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedRequest.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {item.productName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {item.size && item.size !== 'Único' && `Tam: ${item.size} • `}
                          {item.color && `Cor: ${item.color} • `}
                          Qtd: {item.quantity}
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
                          {formatBRL(item.unitPrice * item.quantity)}
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '6px' }}>
                            (Custo est.: {formatBRL(item.estimatedCost * item.quantity)})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Financeiro da Solicitação */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>{formatBRL(selectedRequest.subtotal)}</span>
                </div>
                {selectedRequest.deliveryFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Taxa de Entrega</span>
                    <span>{formatBRL(selectedRequest.deliveryFee)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                  <span>Total da Solicitação</span>
                  <span>{formatBRL(selectedRequest.total)}</span>
                </div>
              </div>
            </div>
          )}
        </Drawer>

        {/* Modal para Confirmar Venda */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title={`Confirmar Venda: ${selectedRequest?.code || ''}`}
        >
          <form onSubmit={handleConfirmSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'var(--color-primary-light)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: 'var(--color-primary)'
            }}>
              Ao confirmar esta venda, os itens serão enviados <strong>automaticamente para a lista da Compra da Semana em João Pessoa</strong>.
            </div>

            <div className="form-group">
              <label className="form-label">Entrada Paga pelo Cliente (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={selectedRequest?.total || 9999}
                className="form-input"
                placeholder="0,00 se for Fiado Total"
                value={initialPayment}
                onChange={(e) => setInitialPayment(e.target.value)}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Deixe vazio ou zero caso o cliente vá pagar tudo na entrega (Fiado Total).
              </span>
            </div>

            {parseFloat(initialPayment) > 0 && (
              <div className="form-group">
                <label className="form-label">Forma de Pagamento da Entrada</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Taxa de Entrega (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={confirmDeliveryFee}
                onChange={(e) => setConfirmDeliveryFee(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Anotações Internas (Opcional)</label>
              <textarea
                className="form-textarea"
                placeholder="Ex: Cliente disse que prefere pagar a segunda parcela dia 10."
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                style={{ minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsConfirmModalOpen(false)}
                style={{ flex: 1 }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={CheckCircle2}
                style={{ flex: 2 }}
              >
                Confirmar e Enviar p/ Compra
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal para Cancelar Solicitação */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancelar Solicitação"
        >
          <form onSubmit={handleCancelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Motivo do Cancelamento</label>
              <select
                className="form-select"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Cliente desistiu da encomenda">Cliente desistiu da encomenda</option>
                <option value="Fornecedor sem estoque em JP">Fornecedor sem estoque em JP</option>
                <option value="Preço no fornecedor subiu demais">Preço no fornecedor subiu demais</option>
                <option value="Cliente não respondeu confirmação">Cliente não respondeu confirmação</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detalhes adicionais (Opcional)</label>
              <textarea
                className="form-textarea"
                placeholder="Escreva alguma observação se necessário..."
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                style={{ minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCancelModalOpen(false)}
                style={{ flex: 1 }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="danger"
                style={{ flex: 1 }}
              >
                Confirmar Cancelamento
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
