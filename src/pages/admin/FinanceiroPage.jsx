import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL, formatDateShort } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
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
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Info,
  Filter,
  CreditCard,
  Banknote
} from 'lucide-react'

// Avatares de clientes para linha de recebimentos
const CUSTOMER_AVATARS = {
  'Maria Clara Silva': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'Ana Paula Medeiros': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'Juliana Fernandes': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Larissa Souza': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'Camila Barbosa': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  'Renata Vasconcelos': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
  'Beatriz Lima': 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
  'Patricia Kelly': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
}

function getCustomerAvatar(name) {
  if (CUSTOMER_AVATARS[name]) return CUSTOMER_AVATARS[name]
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
}

export function FinanceiroPage({ onToast, onNavigate }) {
  const { sales, expenses, addExpense, deleteExpense, recordPayment } = useApp()

  // Filtros
  const [activeSubTab, setActiveSubTab] = useState('todos') // 'todos' | 'recebimentos' | 'despesas'
  const [periodFilter, setPeriodFilter] = useState('tudo') // 'semana' | 'mes' | 'tudo'

  // Modais
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState(null)

  // Form states de Despesa
  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Combustível JP')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])
  const [expenseNotes, setExpenseNotes] = useState('')

  // Form states de Pagamento
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('Pix')
  const [payNote, setPayNote] = useState('')

  // Cálculos Financeiros
  const totalSold = useMemo(() => sales.reduce((acc, s) => acc + (s.total || 0), 0), [sales])
  const totalReceived = useMemo(() => sales.reduce((acc, s) => acc + (s.totalPaid || 0), 0), [sales])
  const totalBalanceDue = useMemo(() => sales.reduce((acc, s) => acc + (s.balanceDue || 0), 0), [sales])
  const totalGoodsCost = useMemo(() => sales.reduce((acc, s) => acc + (s.actualCost || s.estimatedCost || 0), 0), [sales])
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + (e.amount || 0), 0), [expenses])

  // Resultado Operacional em Caixa
  const cashBalance = totalReceived - totalGoodsCost - totalExpenses

  // Todos os lançamentos de recebimento extraídos das vendas
  const allReceipts = useMemo(() => {
    const list = []
    sales.forEach(sale => {
      if (sale.payments && sale.payments.length > 0) {
        sale.payments.forEach(pay => {
          list.push({
            id: pay.id || `pay-${sale.id}-${pay.amount}`,
            saleId: sale.id,
            saleCode: sale.code,
            customerName: sale.customerName,
            customerPhone: sale.customerPhone,
            date: pay.date || sale.createdAt,
            amount: pay.amount,
            method: pay.method || 'Pix',
            note: pay.note || 'Entrada / Baixa de pagamento'
          })
        })
      }
    })
    return list.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [sales])

  // Submissão de Despesa
  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    const amountNum = parseFloat(expenseAmount.replace(',', '.'))
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) {
      if (onToast) onToast('Informe um título e valor válido para a despesa')
      return
    }

    addExpense({
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: amountNum,
      date: expenseDate,
      notes: expenseNotes.trim()
    })

    if (onToast) onToast(`Despesa de ${formatBRL(amountNum)} lançada com sucesso!`)
    setExpenseTitle('')
    setExpenseAmount('')
    setExpenseNotes('')
    setIsExpenseModalOpen(false)
  }

  // Submissão de Pagamento
  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!selectedSaleForPayment) return
    const amountNum = parseFloat(payAmount.replace(',', '.'))
    if (isNaN(amountNum) || amountNum <= 0) {
      if (onToast) onToast('Informe um valor de recebimento válido')
      return
    }

    recordPayment(selectedSaleForPayment.id, {
      amount: amountNum,
      method: payMethod,
      note: payNote || `Recebimento direto (${payMethod})`
    })

    if (onToast) onToast(`Recebimento de ${formatBRL(amountNum)} registrado!`)
    setIsPaymentModalOpen(false)
    setSelectedSaleForPayment(null)
  }

  // Ícone por categoria de despesa
  const getExpenseIcon = (cat) => {
    switch (cat) {
      case 'Combustível JP':
      case 'Combustível':
        return <Car size={16} />
      case 'Alimentação na Viagem':
      case 'Alimentação':
        return <Utensils size={16} />
      case 'Embalagens & Sacolas':
      case 'Embalagens':
        return <Package size={16} />
      default:
        return <Receipt size={16} />
    }
  }

  return (
    <div className="page-container" style={{ paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: '#FDF5F5',
              color: '#731A30',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Aba 8 · Fluxo de Caixa Operacional
            </span>
            <span style={{ fontSize: '0.8rem', color: '#887B7D' }}>• Entradas, custos de viagem e fiados</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
            Financeiro & Lançamentos
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#685D60' }}>
            Acompanhe o dinheiro recebido em caixa, controle os fiados a receber e registre custos de combustível e alimentação.
          </p>
        </div>

        {/* Botão de Registro de Despesa */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#731A30',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(115,26,48,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} />
            <span>Registrar Despesa</span>
          </button>
        </div>
      </div>

      {/* Cards Financeiros Estruturados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '22px'
      }}>
        {/* Card 1: Recebido em Caixa */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B6A43', textTransform: 'uppercase' }}>
              Recebido em Caixa
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1B6A43' }}>
            {formatBRL(totalReceived)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            entradas confirmadas no Pix / dinheiro
          </span>
        </div>

        {/* Card 2: Fiados / A Receber */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#80530E', textTransform: 'uppercase' }}>
              Fiados a Receber
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFBF0', color: '#80530E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#80530E' }}>
            {formatBRL(totalBalanceDue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            saldos combinados com clientes
          </span>
        </div>

        {/* Card 3: Custos de Mercadoria JP */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#731A30', textTransform: 'uppercase' }}>
              Custo das Peças (JP)
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2A2426' }}>
            {formatBRL(totalGoodsCost)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            pago nos boxes atacadistas de JP
          </span>
        </div>

        {/* Card 4: Despesas da Viagem & Loja */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A82B3E', textTransform: 'uppercase' }}>
              Despesas Operacionais
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF0F2', color: '#A82B3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#A82B3E' }}>
            {formatBRL(totalExpenses)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            combustível, refeições e sacolas
          </span>
        </div>
      </div>

      {/* Banner de Demonstração de Resultado */}
      <div style={{
        background: '#FAF8F6',
        borderRadius: '12px',
        padding: '14px 18px',
        border: '1px solid #ECE5DE',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={18} color="#731A30" />
          <div style={{ fontSize: '0.82rem', color: '#4A3E42' }}>
            <strong>Demonstrativo Operacional:</strong> Faturamento Bruto Vendido:{' '}
            <strong style={{ color: '#2A2426' }}>{formatBRL(totalSold)}</strong> | Saldo Líquido em Mãos (Recebido - Custos - Despesas):{' '}
            <strong style={{ color: cashBalance >= 0 ? '#1B6A43' : '#A82B3E' }}>
              {formatBRL(cashBalance)}
            </strong>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#887B7D', background: '#ECE5DE', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
          Rastreamento Local M_I Store
        </span>
      </div>

      {/* Navegação entre Sub-Abas do Financeiro */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #EAE3DE',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('todos')}
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeSubTab === 'todos' ? '#731A30' : '#685D60',
              border: 'none',
              borderBottom: activeSubTab === 'todos' ? '3px solid #731A30' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-2px'
            }}
          >
            <Layers size={16} />
            <span>Visão Integrada de Caixa</span>
          </button>

          <button
            onClick={() => setActiveSubTab('recebimentos')}
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeSubTab === 'recebimentos' ? '#731A30' : '#685D60',
              border: 'none',
              borderBottom: activeSubTab === 'recebimentos' ? '3px solid #731A30' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-2px'
            }}
          >
            <ArrowUpRight size={16} />
            <span>Recebimentos & Pix</span>
            <span style={{
              background: activeSubTab === 'recebimentos' ? '#FDF5F5' : '#ECE5DE',
              color: activeSubTab === 'recebimentos' ? '#731A30' : '#685D60',
              fontSize: '0.75rem',
              padding: '1px 7px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {allReceipts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('despesas')}
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeSubTab === 'despesas' ? '#731A30' : '#685D60',
              border: 'none',
              borderBottom: activeSubTab === 'despesas' ? '3px solid #731A30' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-2px'
            }}
          >
            <ArrowDownRight size={16} />
            <span>Despesas da Viagem & Loja</span>
            <span style={{
              background: activeSubTab === 'despesas' ? '#FDF5F5' : '#ECE5DE',
              color: activeSubTab === 'despesas' ? '#731A30' : '#685D60',
              fontSize: '0.75rem',
              padding: '1px 7px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {expenses.length}
            </span>
          </button>
        </div>
      </div>

      {/* Conteúdo: 2 Colunas (Recebimentos e Despesas) quando na visão integrada */}
      {activeSubTab === 'todos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Coluna 1: Últimos Recebimentos Confirmados */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #ECE5DE',
            padding: '18px',
            boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight size={16} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                  Entradas & Recebimentos
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B6A43' }}>
                Total: {formatBRL(totalReceived)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allReceipts.slice(0, 5).map(r => (
                <div
                  key={r.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#FAF8F6',
                    border: '1px solid #ECE5DE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={getCustomerAvatar(r.customerName)}
                      alt={r.customerName}
                      className="client-avatar"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#2A2426' }}>{r.customerName}</div>
                      <span style={{ fontSize: '0.72rem', color: '#685D60' }}>
                        {r.saleCode} • {r.method} • {formatDateShort(r.date)}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontWeight: 800, color: '#1B6A43', fontSize: '0.9rem' }}>
                    +{formatBRL(r.amount)}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveSubTab('recebimentos')}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ECE5DE',
                background: '#FFFFFF',
                color: '#731A30',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Ver todos os {allReceipts.length} recebimentos →
            </button>
          </div>

          {/* Coluna 2: Despesas da Viagem & Loja */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #ECE5DE',
            padding: '18px',
            boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FFF0F2', color: '#A82B3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowDownRight size={16} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                  Despesas da Operação
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A82B3E' }}>
                Total: {formatBRL(totalExpenses)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expenses.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#FAF8F6',
                    border: '1px solid #ECE5DE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #ECE5DE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#731A30' }}>
                      {getExpenseIcon(exp.category)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#2A2426' }}>{exp.title}</div>
                      <span style={{ fontSize: '0.72rem', color: '#685D60' }}>
                        {exp.category} • {formatDateShort(exp.date)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, color: '#A82B3E', fontSize: '0.9rem' }}>
                      -{formatBRL(exp.amount)}
                    </span>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      title="Excluir despesa"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#A82B3E',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsExpenseModalOpen(true)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                borderRadius: '8px',
                border: '1px dashed #731A30',
                background: '#FFF5F6',
                color: '#731A30',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              <span>Lançar Nova Despesa</span>
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo: Sub-Aba 2 - Apenas Recebimentos Detalhados */}
      {activeSubTab === 'recebimentos' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(42,36,38,0.03)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
              <thead>
                <tr style={{ background: '#FAF8F6', borderBottom: '1px solid #ECE5DE', color: '#685D60', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 18px' }}>Cliente (Foto & Nome)</th>
                  <th style={{ padding: '14px 14px' }}>Venda de Origem</th>
                  <th style={{ padding: '14px 14px' }}>Meio de Pagamento</th>
                  <th style={{ padding: '14px 14px' }}>Data do Recebimento</th>
                  <th style={{ padding: '14px 14px' }}>Anotação / Comprovante</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Valor Confirmado</th>
                </tr>
              </thead>
              <tbody>
                {allReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#887B7D' }}>
                      Nenhum recebimento registrado até o momento.
                    </td>
                  </tr>
                ) : (
                  allReceipts.map(rec => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #F4EFEB' }}>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={getCustomerAvatar(rec.customerName)}
                            alt={rec.customerName}
                            className="client-avatar"
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2A2426' }}>
                              {rec.customerName}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#887B7D' }}>{rec.customerPhone}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#731A30' }}>
                        {rec.saleCode}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#F0F9F4',
                          color: '#1B6A43'
                        }}>
                          {rec.method}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#4A3E42' }}>
                        {formatDateShort(rec.date)}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#685D60' }}>
                        {rec.note}
                      </td>

                      <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 800, fontSize: '0.95rem', color: '#1B6A43' }}>
                        +{formatBRL(rec.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo: Sub-Aba 3 - Apenas Despesas Detalhadas */}
      {activeSubTab === 'despesas' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(42,36,38,0.03)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
              <thead>
                <tr style={{ background: '#FAF8F6', borderBottom: '1px solid #ECE5DE', color: '#685D60', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 18px' }}>Despesa</th>
                  <th style={{ padding: '14px 14px' }}>Categoria</th>
                  <th style={{ padding: '14px 14px' }}>Data</th>
                  <th style={{ padding: '14px 14px' }}>Observações</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Valor Lançado</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#887B7D' }}>
                      Nenhuma despesa registrada.
                    </td>
                  </tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #F4EFEB' }}>
                      <td style={{ padding: '12px 18px', fontWeight: 700, fontSize: '0.88rem', color: '#2A2426' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FAF8F6', border: '1px solid #ECE5DE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#731A30' }}>
                            {getExpenseIcon(exp.category)}
                          </div>
                          <span>{exp.title}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#731A30', background: '#FDF5F5', padding: '2px 8px', borderRadius: '4px' }}>
                          {exp.category}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#4A3E42' }}>
                        {formatDateShort(exp.date)}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#685D60' }}>
                        {exp.notes || '—'}
                      </td>

                      <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 800, fontSize: '0.95rem', color: '#A82B3E' }}>
                        -{formatBRL(exp.amount)}
                      </td>

                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #ECE5DE',
                            background: '#FFFFFF',
                            color: '#A82B3E',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nova Despesa */}
      {isExpenseModalOpen && (
        <Modal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          title="Lançar Nova Despesa Operacional"
          maxWidth="460px"
        >
          <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Descrição da Despesa *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gasolina do carro (ida e volta JP)"
                value={expenseTitle}
                onChange={e => setExpenseTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                  Categoria
                </label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D8CFC8',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Combustível JP">Combustível JP</option>
                  <option value="Alimentação na Viagem">Alimentação na Viagem</option>
                  <option value="Embalagens & Sacolas">Embalagens & Sacolas</option>
                  <option value="Taxa de Entrega / Motoboy">Taxa Motoboy</option>
                  <option value="Outros">Outras Despesas</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                  Valor (R$) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 80,00"
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D8CFC8',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#A82B3E'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Data da Despesa
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Anotações / Observações
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Posto Mamanguape BR 101, tanque abastecido..."
                value={expenseNotes}
                onChange={e => setExpenseNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  background: '#FFFFFF',
                  color: '#685D60',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#731A30',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(115,26,48,0.2)'
                }}
              >
                Salvar Despesa
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
