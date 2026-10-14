import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { formatBRL, formatDateShort } from '../../utils/formatters'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  Wallet,
  Receipt,
  Car,
  Utensils,
  Package,
  Layers
} from 'lucide-react'

export function FinanceiroPage() {
  const { sales, expenses, addExpense, deleteExpense } = useApp()

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Combustível')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])
  const [expenseNotes, setExpenseNotes] = useState('')

  // Métricas
  const totalSold = sales.reduce((acc, s) => acc + s.total, 0)
  const totalReceived = sales.reduce((acc, s) => acc + s.totalPaid, 0)
  const totalBalanceDue = sales.reduce((acc, s) => acc + s.balanceDue, 0)
  const totalGoodsCost = sales.reduce((acc, s) => acc + (s.actualCost || s.estimatedCost || 0), 0)
  const totalTripExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  // Lucro Líquido Real no Bolso
  const netProfitInHand = totalReceived - totalGoodsCost - totalTripExpenses

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(expenseAmount)
    if (!expenseTitle.trim() || !amount) return

    addExpense({
      title: expenseTitle,
      category: expenseCategory,
      amount,
      date: expenseDate,
      notes: expenseNotes
    })

    setExpenseTitle('')
    setExpenseAmount('')
    setExpenseNotes('')
    setIsExpenseModalOpen(false)
  }

  return (
    <AdminLayout
      title="Financeiro & Despesas de Viagem"
      subtitle="Separação clara entre dinheiro na mão, fiados a receber, custos de atacado e despesas operacionais"
      actionButton={
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsExpenseModalOpen(true)}
        >
          Nova Despesa de Viagem
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Painel de Indicadores Financeiros Reais */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px'
        }}>
          <div className="card" style={{ padding: '18px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vendido Total (Bruto)</span>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {formatBRL(totalSold)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Soma de todas as vendas
            </span>
          </div>

          <div style={{
            background: 'var(--status-success-bg)',
            border: '1px solid #c8ebd4',
            borderRadius: 'var(--radius-lg)',
            padding: '18px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-success-text)', fontWeight: 600 }}>
              Dinheiro na Mão (Recebido)
            </span>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--status-success-text)', marginTop: '4px' }}>
              {formatBRL(totalReceived)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-success-text)' }}>
              Pix, Dinheiro ou Cartão recebidos
            </span>
          </div>

          <div style={{
            background: 'var(--status-warning-bg)',
            border: '1px solid #f8dec3',
            borderRadius: 'var(--radius-lg)',
            padding: '18px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)', fontWeight: 600 }}>
              Fiado / A Receber
            </span>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--status-warning-text)', marginTop: '4px' }}>
              {formatBRL(totalBalanceDue)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>
              Saldos restantes com clientes
            </span>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Despesas da Viagem em JP</span>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#c24b4b', marginTop: '4px' }}>
              {formatBRL(totalTripExpenses)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Combustível, lanches e fretes
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #85334c 0%, #6e283d 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#ffcad8', fontWeight: 600 }}>
              Lucro Líquido Realizado
            </span>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              {formatBRL(netProfitInHand)}
            </div>
            <span style={{ fontSize: '0.6875rem', color: '#ffd5e0' }}>
              Recebido - Mercadoria - Despesas
            </span>
          </div>
        </div>

        {/* Bloco de Despesas Operacionais da Viagem */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Despesas das Viagens a João Pessoa
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Custos de transporte, alimentação e embalagens que afetam o lucro real de Edvania
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setIsExpenseModalOpen(true)}
            >
              Registrar Despesa
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Data</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Descrição</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Categoria</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Nenhuma despesa registrada.
                    </td>
                  </tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {formatDateShort(exp.date)}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {exp.title}
                        {exp.notes && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 400 }}>
                            {exp.notes}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          background: 'var(--bg-surface-subtle)',
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)'
                        }}>
                          {exp.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#c24b4b' }}>
                        {formatBRL(exp.amount)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => deleteExpense(exp.id)}
                          style={{ color: 'var(--text-muted)', padding: '4px' }}
                          title="Excluir despesa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Nova Despesa */}
        <Modal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          title="Registrar Despesa Operacional"
        >
          <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Descrição da Despesa *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Gasolina ida e volta João Pessoa"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                >
                  <option value="Combustível">Combustível</option>
                  <option value="Alimentação">Alimentação / Lanche</option>
                  <option value="Passagem / Frete">Passagem / Frete</option>
                  <option value="Embalagens & Sacolas">Embalagens & Sacolas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="0,00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Data da Despesa</label>
              <input
                type="date"
                className="form-input"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Anotações (Opcional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Posto no caminho na BR"
                value={expenseNotes}
                onChange={(e) => setExpenseNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsExpenseModalOpen(false)}
                style={{ flex: 1 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                style={{ flex: 2 }}
              >
                Salvar Despesa
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
