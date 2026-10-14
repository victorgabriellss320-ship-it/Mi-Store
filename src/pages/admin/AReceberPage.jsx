import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { formatBRL, formatDateShort, cleanPhoneForWa } from '../../utils/formatters'
import {
  Wallet,
  DollarSign,
  MessageCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react'

export function AReceberPage() {
  const { sales, recordPayment, customers } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSaleForPay, setSelectedSaleForPay] = useState(null)

  // Payment form states
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('Pix')
  const [payNote, setPayNote] = useState('')

  // Apenas vendas com saldo devedor positivo
  const salesWithDebt = sales.filter(s => s.balanceDue > 0)

  const filteredDebts = salesWithDebt.filter(s => {
    return s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerPhone.includes(searchTerm)
  })

  // Totais
  const totalDebt = salesWithDebt.reduce((acc, s) => acc + s.balanceDue, 0)
  const uniqueDebtorsCount = new Set(salesWithDebt.map(s => s.customerId)).size
  const averageDebt = uniqueDebtorsCount > 0 ? (totalDebt / uniqueDebtorsCount) : 0

  const handleOpenPayModal = (sale) => {
    setSelectedSaleForPay(sale)
    setPayAmount(sale.balanceDue.toString())
    setPayMethod('Pix')
    setPayNote('')
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!selectedSaleForPay) return

    const amount = parseFloat(payAmount)
    if (!amount || amount <= 0) return

    recordPayment(selectedSaleForPay.id, {
      amount,
      method: payMethod,
      note: payNote
    })

    setSelectedSaleForPay(null)
  }

  return (
    <AdminLayout
      title="A Receber & Gestão de Fiados"
      subtitle="Controle humanizado de saldos em aberto, entradas e pagamentos parciais das clientes"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Painel Superior de Indicadores de Fiado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fdf4eb 0%, #faebdd 100%)',
            border: '1px solid #f3d1b3',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b35e16', textTransform: 'uppercase' }}>
                Total Geral a Receber
              </span>
              <div style={{ background: '#f8dec3', padding: '6px', borderRadius: '8px', color: '#b35e16' }}>
                <Wallet size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#8f4609', lineHeight: 1.1 }}>
              {formatBRL(totalDebt)}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#b35e16', marginTop: '6px', display: 'block' }}>
              Distribuído em {salesWithDebt.length} pedidos em aberto
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clientes com Pendência</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {uniqueDebtorsCount} clientes
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Com compras sob encomenda ativas
            </span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Média por Devedora</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {formatBRL(averageDebt)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Ticket médio de fiado pendente
            </span>
          </div>
        </div>

        {/* Busca */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ position: 'relative', maxWidth: '420px' }}>
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
              placeholder="Buscar cliente ou código da venda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {/* Tabela de Fiados / Vendas com Saldo Devedor */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Pedido</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total do Pedido</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Já Pago</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Saldo Devedor (Fiado)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Vencimento Previsto</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Ações Rápidas</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--status-success-text)', fontWeight: 600 }}>
                      ✓ Maravilha! Não há nenhum saldo em aberto ou fiado pendente no momento.
                    </td>
                  </tr>
                ) : (
                  filteredDebts.map(sale => {
                    const waMessage = `Olá ${sale.customerName}! Tudo bem? Passando para te lembrar do saldo restante de ${formatBRL(sale.balanceDue)} do pedido ${sale.code} na M_I Store. Se quiser pagar via Pix, posso te enviar a chave agora!`
                    const waUrl = `https://wa.me/${cleanPhoneForWa(sale.customerPhone)}?text=${encodeURIComponent(waMessage)}`

                    return (
                      <tr
                        key={sale.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: '#fffdfb'
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sale.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sale.customerPhone}</div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{sale.code}</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {formatDateShort(sale.createdAt)}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                          {formatBRL(sale.total)}
                        </td>

                        <td style={{ padding: '14px 16px', color: 'var(--status-success-text)', fontWeight: 600 }}>
                          {formatBRL(sale.totalPaid)}
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '0.9375rem',
                            fontWeight: 800,
                            color: '#b35e16',
                            background: '#fdf3e7',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)'
                          }}>
                            {formatBRL(sale.balanceDue)}
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px', fontSize: '0.8125rem' }}>
                          {sale.dueDate ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                              <Calendar size={13} />
                              {formatDateShort(sale.dueDate)}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Na entrega</span>
                          )}
                        </td>

                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={DollarSign}
                              onClick={() => handleOpenPayModal(sale)}
                            >
                              Abater
                            </Button>

                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ borderColor: '#25D366', color: '#128C7E', gap: '4px' }}
                              title="Enviar lembrete amigável no WhatsApp"
                            >
                              <MessageCircle size={14} style={{ color: '#25D366' }} />
                              <span>Lembrar</span>
                            </a>
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

        {/* Modal de Abate de Saldo */}
        <Modal
          isOpen={!!selectedSaleForPay}
          onClose={() => setSelectedSaleForPay(null)}
          title={`Abater Fiado: ${selectedSaleForPay?.customerName || ''}`}
        >
          {selectedSaleForPay && (
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem'
              }}>
                <span>Saldo em aberto do pedido ({selectedSaleForPay.code}):</span>
                <strong style={{ color: '#b35e16' }}>{formatBRL(selectedSaleForPay.balanceDue)}</strong>
              </div>

              <div className="form-group">
                <label className="form-label">Valor do Pagamento Recebido (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedSaleForPay.balanceDue}
                  className="form-input"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0,00"
                  required
                />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Pode ser o valor total ou qualquer quantia parcial paga pela cliente.
                </span>
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
                <label className="form-label">Observação / Comprovante</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Pago no Pix após entrega"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedSaleForPay(null)}
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
                  Confirmar Abate de Saldo
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </AdminLayout>
  )
}
