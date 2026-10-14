import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { Drawer } from '../../components/common/Drawer'
import { formatBRL, formatDateShort, cleanPhoneForWa } from '../../utils/formatters'
import {
  ShoppingBag,
  Search,
  DollarSign,
  Truck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react'

export function VendasPage() {
  const { sales, updateSaleStatus, recordPayment } = useApp()

  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSale, setSelectedSale] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Form de pagamento
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('Pix')
  const [payNote, setPayNote] = useState('')

  const filteredSales = sales.filter(s => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus
    const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerPhone.includes(searchTerm)

    return matchesStatus && matchesSearch
  })

  // Mantém selectedSale atualizado
  const activeSale = selectedSale ? (sales.find(s => s.id === selectedSale.id) || selectedSale) : null

  const handleOpenPayment = (sale) => {
    setSelectedSale(sale)
    setPayAmount(sale.balanceDue > 0 ? sale.balanceDue.toString() : '')
    setPayMethod('Pix')
    setPayNote('')
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!activeSale) return

    const amount = parseFloat(payAmount)
    if (!amount || amount <= 0) return

    recordPayment(activeSale.id, {
      amount,
      method: payMethod,
      note: payNote
    })

    setIsPaymentModalOpen(false)
  }

  const handleAdvanceStatus = (saleId, nextStatus) => {
    updateSaleStatus(saleId, nextStatus)
  }

  return (
    <AdminLayout
      title="Gestão de Vendas & Encomendas"
      subtitle="Acompanhe o ciclo de vida dos pedidos: compra em JP, entrega e quitação de saldo"
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
            {/* Abas */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Todas', count: sales.length },
                { id: 'awaiting_purchase', label: 'Aguardando Compra', count: sales.filter(s => s.status === 'awaiting_purchase').length },
                { id: 'purchased', label: 'Compradas em JP', count: sales.filter(s => s.status === 'purchased').length },
                { id: 'ready_for_delivery', label: 'Prontas p/ Entrega', count: sales.filter(s => s.status === 'ready_for_delivery').length },
                { id: 'delivered', label: 'Entregues', count: sales.filter(s => s.status === 'delivered').length }
              ].map(tab => {
                const isActive = filterStatus === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterStatus(tab.id)}
                    style={{
                      padding: '6px 12px',
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

            {/* Busca */}
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
                placeholder="Buscar código, cliente ou WhatsApp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', height: '36px' }}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Vendas */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Venda</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Data</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Itens</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Pago / Saldo</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Nenhuma venda encontrada para o filtro selecionado.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map(sale => {
                    const hasBalance = sale.balanceDue > 0
                    return (
                      <tr
                        key={sale.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onClick={() => setSelectedSale(sale)}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {sale.code}
                        </td>

                        <td style={{ padding: '14px 16px', fontSize: '0.8125rem' }}>
                          {formatDateShort(sale.createdAt)}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sale.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sale.customerPhone}</div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '0.8125rem' }}>
                            {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatBRL(sale.total)}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--status-success-text)', fontWeight: 600 }}>
                            Pago: {formatBRL(sale.totalPaid)}
                          </div>
                          {hasBalance ? (
                            <div style={{ fontSize: '0.75rem', color: '#b35e16', fontWeight: 700 }}>
                              Fiado: {formatBRL(sale.balanceDue)}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Quitado ✓
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge status={sale.status} type="sale" />
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {hasBalance && (
                              <Button
                                variant="soft"
                                size="sm"
                                icon={DollarSign}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenPayment(sale)
                                }}
                                title="Registrar pagamento ou abate do fiado"
                              >
                                Abater
                              </Button>
                            )}

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSale(sale)
                              }}
                            >
                              Ver
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawer de Detalhes da Venda */}
        <Drawer
          isOpen={!!activeSale}
          onClose={() => setSelectedSale(null)}
          title={`Venda ${activeSale?.code || ''}`}
          width="540px"
          footer={
            activeSale && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Botões de Avanço de Status */}
                {activeSale.status === 'awaiting_purchase' && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleAdvanceStatus(activeSale.id, 'purchased')}
                  >
                    Marcar como Comprado em João Pessoa
                  </Button>
                )}

                {activeSale.status === 'purchased' && (
                  <Button
                    variant="primary"
                    size="md"
                    icon={Truck}
                    onClick={() => handleAdvanceStatus(activeSale.id, 'ready_for_delivery')}
                  >
                    Avançar para Pronto para Entrega / Retirada
                  </Button>
                )}

                {activeSale.status === 'ready_for_delivery' && (
                  <Button
                    variant="success"
                    size="md"
                    icon={CheckCircle2}
                    onClick={() => handleAdvanceStatus(activeSale.id, 'delivered')}
                  >
                    Confirmar Entrega ao Cliente
                  </Button>
                )}

                {activeSale.balanceDue > 0 && (
                  <Button
                    variant="secondary"
                    size="md"
                    icon={DollarSign}
                    onClick={() => handleOpenPayment(activeSale)}
                  >
                    Registrar Pagamento / Abater Saldo ({formatBRL(activeSale.balanceDue)})
                  </Button>
                )}
              </div>
            )
          }
        >
          {activeSale && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Linha do Tempo Visual do Status */}
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Operacional</span>
                <div style={{ marginTop: '4px', marginBottom: '14px' }}>
                  <StatusBadge status={activeSale.status} type="sale" />
                </div>

                {/* Progress Tracker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[
                    { key: 'awaiting_purchase', label: 'Compra JP' },
                    { key: 'purchased', label: 'Comprado' },
                    { key: 'ready_for_delivery', label: 'Pronto' },
                    { key: 'delivered', label: 'Entregue' }
                  ].map((step, idx, arr) => {
                    const stepWeights = { awaiting_purchase: 1, purchased: 2, ready_for_delivery: 3, out_for_delivery: 3, delivered: 4, finished: 4 }
                    const currentWeight = stepWeights[activeSale.status] || 1
                    const isDone = currentWeight >= (idx + 1)

                    return (
                      <React.Fragment key={step.key}>
                        <div style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '6px 4px',
                          borderRadius: '4px',
                          background: isDone ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
                          color: isDone ? '#fff' : 'var(--text-muted)',
                          fontSize: '0.6875rem',
                          fontWeight: 700
                        }}>
                          {step.label}
                        </div>
                        {idx < arr.length - 1 && (
                          <div style={{ width: '8px', height: '2px', background: isDone ? 'var(--color-primary)' : '#ddd' }} />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>

              {/* Contato do Cliente */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Cliente & Entrega
                </h4>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{activeSale.customerName}</strong>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{activeSale.customerPhone}</div>
                    </div>
                    <a
                      href={`https://wa.me/${cleanPhoneForWa(activeSale.customerPhone)}?text=${encodeURIComponent(`Olá ${activeSale.customerName}! Aqui é Edvania da M_I Store referente ao seu pedido ${activeSale.code}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                      style={{ backgroundColor: '#25D366', color: '#fff', gap: '4px' }}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <strong>Tipo:</strong> {activeSale.deliveryType === 'delivery' ? 'Entrega em domicílio' : 'Retirada no local'}
                    {activeSale.customerCity && ` • ${activeSale.customerCity}`}
                    {activeSale.customerAddress && ` • ${activeSale.customerAddress}`}
                  </div>
                </div>
              </div>

              {/* Itens Comprados / A Comprar */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Itens da Venda ({activeSale.items.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeSale.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        alignItems: 'center'
                      }}
                    >
                      <img src={item.image} alt={item.productName} style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                          {item.productName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {item.size && item.size !== 'Único' && `Tam: ${item.size} • `}
                          {item.color && `Cor: ${item.color} • `}
                          Qtd: {item.quantity}
                        </div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {formatBRL(item.unitPrice * item.quantity)}
                        </div>
                      </div>
                      <StatusBadge status={item.shoppingStatus || 'pending'} type="shopping" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico Financeiro da Venda */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Controle de Pagamentos
                  </h4>
                  {activeSale.balanceDue > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenPayment(activeSale)}
                      style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}
                    >
                      + Novo Pagamento
                    </button>
                  )}
                </div>

                <div style={{
                  background: 'var(--bg-surface-subtle)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Valor Total da Venda</span>
                    <strong>{formatBRL(activeSale.total)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success-text)' }}>
                    <span>Total Já Recebido</span>
                    <strong>{formatBRL(activeSale.totalPaid)}</strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: activeSale.balanceDue > 0 ? '#b35e16' : 'var(--text-muted)',
                    fontWeight: 700,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '6px'
                  }}>
                    <span>Saldo em Aberto (Fiado)</span>
                    <span>{formatBRL(activeSale.balanceDue)}</span>
                  </div>
                </div>

                {/* Histórico de parcelas / pagamentos */}
                {activeSale.payments && activeSale.payments.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Extrato de Recebimentos:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      {activeSale.payments.map(p => (
                        <div
                          key={p.id}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '4px',
                            background: '#fff',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem'
                          }}
                        >
                          <div>
                            <strong>{formatBRL(p.amount)}</strong> • {p.method}
                            <div style={{ color: 'var(--text-muted)' }}>{p.note}</div>
                          </div>
                          <span style={{ color: 'var(--text-secondary)' }}>{formatDateShort(p.date)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>

        {/* Modal de Pagamento / Abater Fiado */}
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Registrar Recebimento: ${activeSale?.code || ''}`}
        >
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: 'var(--bg-surface-subtle)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem'
            }}>
              <span>Saldo em aberto do pedido:</span>
              <strong style={{ color: '#b35e16' }}>{formatBRL(activeSale?.balanceDue || 0)}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Valor Recebido (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={activeSale?.balanceDue || 9999}
                className="form-input"
                placeholder="0,00"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Forma de Pagamento</label>
              <select
                className="form-select"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
              >
                <option value="Pix">Pix</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Anotação / Comprovante (Opcional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Pago metade via Pix na entrega"
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsPaymentModalOpen(false)}
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
                Confirmar Recebimento
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
