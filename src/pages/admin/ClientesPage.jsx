import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL, formatDateShort, cleanPhoneForWa } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
import {
  Users,
  Search,
  MessageCircle,
  Plus,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeAlert
} from 'lucide-react'

// Mapeamento estável de avatares com alta resolução para clientes
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
  const fallbacks = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  ]
  const hash = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return fallbacks[hash % fallbacks.length]
}

export function ClientesPage({ onToast, onNavigate }) {
  const {
    customers,
    sales,
    addCustomer,
    updateCustomer,
    recordPayment
  } = useApp()

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDebt, setFilterDebt] = useState('all') // 'all' | 'debt_only' | 'clean'
  const [filterCity, setFilterCity] = useState('Todas')

  // Modais e Detalhes
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentCustomer, setPaymentCustomer] = useState(null)

  // Form states de Cliente
  const [customerForm, setCustomerForm] = useState({
    name: '',
    whatsapp: '',
    city: 'Cuité de Mamanguape',
    address: '',
    reference: '',
    notes: ''
  })

  // Form states de Pagamento
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('Pix')
  const [payNote, setPayNote] = useState('')

  // Cidades únicas
  const cities = useMemo(() => {
    const set = new Set(customers.map(c => c.city).filter(Boolean))
    return ['Todas', ...Array.from(set)]
  }, [customers])

  // Métricas
  const totalCustomers = customers.length
  const customersWithDebt = customers.filter(c => (c.currentDebt || 0) > 0)
  const totalDebt = customers.reduce((acc, c) => acc + (c.currentDebt || 0), 0)
  const totalSpentAll = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0)

  // Filtragem
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const debt = c.currentDebt || 0
      const matchesDebt = filterDebt === 'all' ||
        (filterDebt === 'debt_only' && debt > 0) ||
        (filterDebt === 'clean' && debt <= 0)

      const matchesCity = filterCity === 'Todas' || c.city === filterCity

      const cleanSearch = searchTerm.toLowerCase().trim()
      const matchesSearch = !cleanSearch ||
        (c.name || '').toLowerCase().includes(cleanSearch) ||
        (c.whatsapp || '').includes(cleanSearch) ||
        (c.city || '').toLowerCase().includes(cleanSearch) ||
        (c.address || '').toLowerCase().includes(cleanSearch)

      return matchesDebt && matchesCity && matchesSearch
    }).sort((a, b) => {
      // Prioriza clientes com débito em aberto no topo
      return (b.currentDebt || 0) - (a.currentDebt || 0)
    })
  }, [customers, searchTerm, filterDebt, filterCity])

  // Pedidos e vendas da cliente selecionada
  const customerSales = useMemo(() => {
    if (!selectedCustomer) return []
    const custPhoneClean = (selectedCustomer.whatsapp || '').replace(/\D/g, '')
    return sales.filter(s =>
      s.customerId === selectedCustomer.id ||
      (s.customerPhone && s.customerPhone.replace(/\D/g, '') === custPhoneClean)
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [sales, selectedCustomer])

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    setEditingCustomer(null)
    setCustomerForm({
      name: '',
      whatsapp: '',
      city: 'Cuité de Mamanguape',
      address: '',
      reference: '',
      notes: ''
    })
    setIsCustomerModalOpen(true)
  }

  // Abrir modal de edição
  const handleOpenEditModal = (cust, e) => {
    if (e) e.stopPropagation()
    setEditingCustomer(cust)
    setCustomerForm({
      name: cust.name,
      whatsapp: cust.whatsapp || '',
      city: cust.city || 'Cuité de Mamanguape',
      address: cust.address || '',
      reference: cust.reference || '',
      notes: cust.notes || ''
    })
    setIsCustomerModalOpen(true)
  }

  // Salvar cliente
  const handleSaveCustomer = (e) => {
    e.preventDefault()
    if (!customerForm.name.trim()) {
      if (onToast) onToast('Informe o nome da cliente')
      return
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerForm)
      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        setSelectedCustomer(prev => ({ ...prev, ...customerForm }))
      }
      if (onToast) onToast(`Cliente "${customerForm.name}" atualizada com sucesso!`)
    } else {
      addCustomer(customerForm)
      if (onToast) onToast(`Cliente "${customerForm.name}" cadastrada com sucesso!`)
    }

    setIsCustomerModalOpen(false)
  }

  // Abrir modal de pagamento para dar baixa de fiado
  const handleOpenPaymentModal = (cust, e) => {
    if (e) e.stopPropagation()
    setPaymentCustomer(cust)
    setPayAmount(cust.currentDebt ? String(cust.currentDebt) : '')
    setPayMethod('Pix')
    setPayNote(`Baixa de fiado - ${cust.name}`)
    setIsPaymentModalOpen(true)
  }

  // Confirmar pagamento
  const handleConfirmPayment = (e) => {
    e.preventDefault()
    const amountNum = parseFloat(payAmount.replace(',', '.'))
    if (isNaN(amountNum) || amountNum <= 0) {
      if (onToast) onToast('Informe um valor de pagamento válido')
      return
    }

    if (!paymentCustomer) return

    // Procura venda em aberto dessa cliente para abater
    const custPhoneClean = (paymentCustomer.whatsapp || '').replace(/\D/g, '')
    const openSale = sales.find(s =>
      (s.customerId === paymentCustomer.id || (s.customerPhone && s.customerPhone.replace(/\D/g, '') === custPhoneClean)) &&
      s.balanceDue > 0
    )

    if (openSale) {
      recordPayment(openSale.id, {
        amount: amountNum,
        method: payMethod,
        note: payNote || `Recebimento direto (${payMethod})`
      })
    } else {
      // Abate direto no cadastro da cliente
      const newDebt = Math.max(0, (paymentCustomer.currentDebt || 0) - amountNum)
      updateCustomer(paymentCustomer.id, {
        currentDebt: newDebt,
        debtDueDate: newDebt === 0 ? null : paymentCustomer.debtDueDate
      })
      if (onToast) onToast(`Recebimento de R$ ${amountNum.toFixed(2).replace('.', ',')} registrado com sucesso!`)
    }

    // Se estiver no drawer de detalhes, atualiza em tempo real
    if (selectedCustomer && selectedCustomer.id === paymentCustomer.id) {
      const updatedDebt = Math.max(0, (selectedCustomer.currentDebt || 0) - amountNum)
      setSelectedCustomer(prev => ({
        ...prev,
        currentDebt: updatedDebt,
        debtDueDate: updatedDebt === 0 ? null : prev.debtDueDate
      }))
    }

    setIsPaymentModalOpen(false)
    setPaymentCustomer(null)
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
              Aba 6 · Gestão de Relacionamento
            </span>
            <span style={{ fontSize: '0.8rem', color: '#887B7D' }}>• Histórico e fiados de confiança</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
            Clientes & Recebíveis
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#685D60' }}>
            Consulte o histórico de compras, acompanhe saldos em aberto e registre baixas de fiado com facilidade.
          </p>
        </div>

        {/* Botão de Cadastro */}
        <button
          onClick={handleOpenCreateModal}
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
          <span>Cadastrar Nova Cliente</span>
        </button>
      </div>

      {/* Cards de Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '22px'
      }}>
        {/* Card 1: Total de Clientes */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#731A30', textTransform: 'uppercase' }}>
              Clientes Cadastradas
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2A2426' }}>
            {totalCustomers}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            compras e contatos na região
          </span>
        </div>

        {/* Card 2: Clientes com Fiado */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#80530E', textTransform: 'uppercase' }}>
              Com Saldo em Aberto
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFBF0', color: '#80530E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#80530E' }}>
            {customersWithDebt.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            clientes com fiado a receber
          </span>
        </div>

        {/* Card 3: Total em Aberto (Fiados) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A82B3E', textTransform: 'uppercase' }}>
              Total a Receber (Fiados)
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF0F2', color: '#A82B3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#A82B3E' }}>
            {formatBRL(totalDebt)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            saldo pendente de recebimento
          </span>
        </div>

        {/* Card 4: Total Histórico Comprado */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B6A43', textTransform: 'uppercase' }}>
              Total Histórico Vendido
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1B6A43' }}>
            {formatBRL(totalSpentAll)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            volume acumulado de compras
          </span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '14px 18px',
        border: '1px solid #ECE5DE',
        marginBottom: '18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Campo de Busca */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F9F7F5',
          border: '1px solid #E0D9D4',
          borderRadius: '8px',
          padding: '8px 12px',
          flex: '1 1 240px'
        }}>
          <Search size={16} color="#887B7D" />
          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp ou cidade..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#2A2426',
              width: '100%'
            }}
          />
        </div>

        {/* Filtro de Fiado / Débito */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#685D60' }}>Situação:</span>
          <select
            value={filterDebt}
            onChange={e => setFilterDebt(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #E0D9D4',
              background: '#F9F7F5',
              fontSize: '0.82rem',
              color: '#2A2426',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Todas as Clientes ({totalCustomers})</option>
            <option value="debt_only">Com Fiado em Aberto ({customersWithDebt.length})</option>
            <option value="clean">Sem Débitos / Em Dia ({totalCustomers - customersWithDebt.length})</option>
          </select>
        </div>

        {/* Filtro de Cidade */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#685D60' }}>Cidade:</span>
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #E0D9D4',
              background: '#F9F7F5',
              fontSize: '0.82rem',
              color: '#2A2426',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Clientes com Foto Circular + Nome */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #ECE5DE',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(42,36,38,0.03)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#FAF8F6', borderBottom: '1px solid #ECE5DE', color: '#685D60', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 18px' }}>Cliente (Foto & Nome)</th>
                <th style={{ padding: '14px 14px' }}>Contato & Localização</th>
                <th style={{ padding: '14px 14px' }}>Histórico Compras</th>
                <th style={{ padding: '14px 14px' }}>Situação do Fiado / Recebível</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center', color: '#887B7D' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#685D60', marginBottom: '4px' }}>
                      Nenhuma cliente encontrada
                    </div>
                    <span style={{ fontSize: '0.82rem' }}>
                      Ajuste os filtros de busca ou cadastre uma nova cliente.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const avatar = getCustomerAvatar(cust.name)
                  const debt = cust.currentDebt || 0
                  const hasDebt = debt > 0
                  const waNumber = cleanPhoneForWa(cust.whatsapp || '')

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      style={{
                        borderBottom: '1px solid #F4EFEB',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FCFAF8'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Coluna 1: Foto Circular + Nome */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={avatar}
                            alt={cust.name}
                            className="client-avatar"
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: hasDebt ? '2px solid #D97706' : '2px solid #E5E7EB',
                              flexShrink: 0
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2A2426' }}>
                              {cust.name}
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#887B7D' }}>
                              {cust.address ? cust.address.split('-')[0] : 'Endereço a cadastrar'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 2: Contato & WhatsApp */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4A3E42' }}>
                            {cust.whatsapp || 'Sem telefone'}
                          </span>
                          {waNumber && (
                            <a
                              href={`https://wa.me/${waNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={e => e.stopPropagation()}
                              title="Conversar no WhatsApp"
                              style={{
                                color: '#25D366',
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '2px'
                              }}
                            >
                              <MessageCircle size={15} />
                            </a>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#685D60', marginTop: '2px' }}>
                          <MapPin size={12} color="#887B7D" />
                          <span>{cust.city || 'Cuité de Mamanguape'}</span>
                        </div>
                      </td>

                      {/* Coluna 3: Histórico de Compras */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A2426' }}>
                          {cust.totalOrders || 0} {cust.totalOrders === 1 ? 'pedido' : 'pedidos'}
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#685D60' }}>
                          Total: {formatBRL(cust.totalSpent || 0)}
                        </span>
                      </td>

                      {/* Coluna 4: Situação de Fiado */}
                      <td style={{ padding: '14px 14px' }}>
                        {hasDebt ? (
                          <div>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: '#FFFBF0',
                              color: '#80530E',
                              padding: '3px 9px',
                              borderRadius: '12px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              border: '1px solid #F6E0A4'
                            }}>
                              <Clock size={12} />
                              <span>Fiado: {formatBRL(debt)}</span>
                            </span>
                            {cust.debtDueDate && (
                              <div style={{ fontSize: '0.7rem', color: '#887B7D', marginTop: '3px' }}>
                                Vence em: <strong>{formatDateShort(cust.debtDueDate)}</strong>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#F0F9F4',
                            color: '#1B6A43',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            <CheckCircle2 size={12} />
                            <span>Em dia (R$ 0,00)</span>
                          </span>
                        )}
                      </td>

                      {/* Coluna 5: Ações */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {hasDebt && (
                            <button
                              onClick={(e) => handleOpenPaymentModal(cust, e)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#1B6A43',
                                color: '#FFFFFF',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 1px 4px rgba(27,106,67,0.2)'
                              }}
                            >
                              <DollarSign size={13} />
                              <span>Baixar Fiado</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => handleOpenEditModal(cust, e)}
                            title="Editar dados da cliente"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid #ECE5DE',
                              background: '#FFFFFF',
                              color: '#731A30',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #ECE5DE',
                              background: '#F9F7F5',
                              color: '#4A3E42',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Ver Extrato
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tabela */}
        <div style={{
          background: '#FAF8F6',
          borderTop: '1px solid #ECE5DE',
          padding: '12px 18px',
          fontSize: '0.75rem',
          color: '#685D60',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span>
            Exibindo <strong>{filteredCustomers.length}</strong> de <strong>{totalCustomers}</strong> clientes
          </span>
          <span style={{ color: '#887B7D' }}>
            💡 Dica: Clique em qualquer cliente para abrir seu perfil completo e extrato detalhado de compras.
          </span>
        </div>
      </div>

      {/* Modal / Extrato Detalhado da Cliente */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title="Perfil & Extrato da Cliente"
          maxWidth="640px"
        >
          <div>
            {/* Header do Perfil com Foto Circular e Dados */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #ECE5DE',
              marginBottom: '16px'
            }}>
              <img
                src={getCustomerAvatar(selectedCustomer.name)}
                alt={selectedCustomer.name}
                className="client-avatar"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: (selectedCustomer.currentDebt || 0) > 0 ? '3px solid #D97706' : '3px solid #1B6A43'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                    {selectedCustomer.name}
                  </h3>
                  <button
                    onClick={() => handleOpenEditModal(selectedCustomer)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#731A30',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit size={13} />
                    <span>Editar dados</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.8rem', color: '#685D60' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={14} color="#25D366" />
                    <span>{selectedCustomer.whatsapp || 'Sem zap'}</span>
                    {selectedCustomer.whatsapp && (
                      <a
                        href={`https://wa.me/${cleanPhoneForWa(selectedCustomer.whatsapp)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#25D366', fontWeight: 700, marginLeft: '2px', textDecoration: 'none' }}
                      >
                        (Abrir conversa)
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#731A30" />
                    <span>{selectedCustomer.city || 'Cuité de Mamanguape'}</span>
                  </div>
                </div>

                {selectedCustomer.address && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#887B7D' }}>
                    {selectedCustomer.address} {selectedCustomer.reference ? `(${selectedCustomer.reference})` : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Painel Financeiro do Cliente */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <div style={{ background: '#FAF8F6', padding: '12px', borderRadius: '10px', border: '1px solid #ECE5DE' }}>
                <span style={{ fontSize: '0.72rem', color: '#887B7D', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total em Compras
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2A2426', marginTop: '2px' }}>
                  {formatBRL(selectedCustomer.totalSpent || 0)}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#685D60' }}>
                  {selectedCustomer.totalOrders || 0} pedidos feitos
                </span>
              </div>

              <div style={{
                background: (selectedCustomer.currentDebt || 0) > 0 ? '#FFF5F6' : '#F0F9F4',
                padding: '12px',
                borderRadius: '10px',
                border: (selectedCustomer.currentDebt || 0) > 0 ? '1px solid #F5D3D8' : '1px solid #C4E9D5'
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  color: (selectedCustomer.currentDebt || 0) > 0 ? '#A82B3E' : '#1B6A43',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}>
                  Saldo Devedor (Fiado)
                </span>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: (selectedCustomer.currentDebt || 0) > 0 ? '#A82B3E' : '#1B6A43',
                  marginTop: '2px'
                }}>
                  {formatBRL(selectedCustomer.currentDebt || 0)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#685D60' }}>
                    {(selectedCustomer.currentDebt || 0) > 0 ? 'Pendente' : 'Totalmente quitado'}
                  </span>
                  {(selectedCustomer.currentDebt || 0) > 0 && (
                    <button
                      onClick={() => handleOpenPaymentModal(selectedCustomer)}
                      style={{
                        background: '#1B6A43',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Dar Baixa
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Histórico / Extrato de Pedidos */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A2426', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} color="#731A30" />
                <span>Extrato Cronológico de Vendas da Cliente</span>
              </h4>

              {customerSales.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', background: '#F9F7F5', borderRadius: '10px', color: '#887B7D', fontSize: '0.8rem' }}>
                  Nenhum pedido registrado especificamente para esta cliente no sistema.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                  {customerSales.map(sale => (
                    <div
                      key={sale.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid #ECE5DE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#2A2426' }}>
                          Venda {sale.code} • {formatDateShort(sale.createdAt)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#685D60', marginTop: '2px' }}>
                          {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#2A2426' }}>
                          {formatBRL(sale.total)}
                        </div>
                        {sale.balanceDue > 0 ? (
                          <span style={{ fontSize: '0.7rem', color: '#A82B3E', fontWeight: 700 }}>
                            Fiado: {formatBRL(sale.balanceDue)}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#1B6A43', fontWeight: 700 }}>
                            Quitado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fechar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setSelectedCustomer(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid #ECE5DE',
                  background: '#FFFFFF',
                  color: '#685D60',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Cadastrar ou Editar Cliente */}
      {isCustomerModalOpen && (
        <Modal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          title={editingCustomer ? 'Editar Dados da Cliente' : 'Cadastrar Nova Cliente'}
          maxWidth="500px"
        >
          <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Nome Completo da Cliente *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Maria Clara Silva"
                value={customerForm.name}
                onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
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
                  WhatsApp / Celular
                </label>
                <input
                  type="text"
                  placeholder="(83) 99123-8844"
                  value={customerForm.whatsapp}
                  onChange={e => setCustomerForm({ ...customerForm, whatsapp: e.target.value })}
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
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="Cuité de Mamanguape"
                  value={customerForm.city}
                  onChange={e => setCustomerForm({ ...customerForm, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D8CFC8',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Endereço de Entrega
              </label>
              <input
                type="text"
                placeholder="Rua São Sebastião, 142 - Centro"
                value={customerForm.address}
                onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })}
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
                Ponto de Referência
              </label>
              <input
                type="text"
                placeholder="Próximo à padaria / Em frente à pracinha"
                value={customerForm.reference}
                onChange={e => setCustomerForm({ ...customerForm, reference: e.target.value })}
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
                Anotações Pessoais (preferências, tamanho, dia de pagamento)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Calça 37, prefere cores neutras, paga todo dia 20..."
                value={customerForm.notes}
                onChange={e => setCustomerForm({ ...customerForm, notes: e.target.value })}
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
                onClick={() => setIsCustomerModalOpen(false)}
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
                {editingCustomer ? 'Salvar Dados' : 'Cadastrar Cliente'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Baixa de Fiado / Pagamento */}
      {isPaymentModalOpen && paymentCustomer && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="Baixa de Fiado / Recebimento"
          maxWidth="460px"
        >
          <form onSubmit={handleConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              background: '#FFF5F6',
              border: '1px solid #F5D3D8'
            }}>
              <img
                src={getCustomerAvatar(paymentCustomer.name)}
                alt={paymentCustomer.name}
                className="client-avatar"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #731A30'
                }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2A2426' }}>
                  {paymentCustomer.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#A82B3E', fontWeight: 700 }}>
                  Saldo devedor atual: {formatBRL(paymentCustomer.currentDebt || 0)}
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Valor Recebido (R$) *
              </label>
              <input
                type="text"
                required
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                placeholder="Ex: 50,00"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#1B6A43'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#887B7D', marginTop: '2px', display: 'block' }}>
                Você pode receber o valor integral ou um pagamento parcial do fiado.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Forma de Pagamento
              </label>
              <select
                value={payMethod}
                onChange={e => setPayMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Pix">Pix</option>
                <option value="Dinheiro">Dinheiro em Espécie</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Anotação do Recebimento
              </label>
              <input
                type="text"
                value={payNote}
                onChange={e => setPayNote(e.target.value)}
                placeholder="Ex: Pagamento parcial do calçado no Pix"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
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
                  background: '#1B6A43',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(27,106,67,0.25)'
                }}
              >
                Confirmar Recebimento
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
