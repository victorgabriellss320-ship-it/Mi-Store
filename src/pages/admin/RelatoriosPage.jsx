import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL } from '../../utils/formatters'
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  ShoppingBag,
  Building2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Package,
  Layers,
  Clock,
  CheckCircle2,
  PieChart,
  Tag
} from 'lucide-react'

// Avatares das clientes para o ranking
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

export function RelatoriosPage({ onToast, onNavigate }) {
  const { sales, requests, products, suppliers, customers, expenses } = useApp()

  const [period, setPeriod] = useState('mes') // 'semana' | 'mes' | 'tudo'

  // Métricas Consolidadas
  const totalSalesCount = sales.length
  const totalSalesRevenue = sales.reduce((acc, s) => acc + (s.total || 0), 0)
  const totalRequestsCount = requests.length
  const totalReceivedCash = sales.reduce((acc, s) => acc + (s.totalPaid || 0), 0)
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + (e.amount || 0), 0)

  // 1. Ranking de Produtos Mais Vendidos
  const topProducts = useMemo(() => {
    const map = {}
    sales.forEach(s => {
      s.items.forEach(i => {
        if (!map[i.productName]) {
          map[i.productName] = {
            name: i.productName,
            image: i.image,
            quantity: 0,
            revenue: 0
          }
        }
        map[i.productName].quantity += i.quantity
        map[i.productName].revenue += (i.unitPrice * i.quantity)
      })
    })

    return Object.values(map)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }, [sales])

  const maxProductQty = topProducts[0]?.quantity || 1

  // 2. Ranking de Melhores Clientes
  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 5)
  }, [customers])

  // 3. Distribuição por Categoria
  const categoryStats = useMemo(() => {
    const map = {}
    sales.forEach(s => {
      s.items.forEach(i => {
        const prod = products.find(p => p.id === i.productId)
        const cat = prod?.category || 'Calçados'
        map[cat] = (map[cat] || 0) + i.quantity
      })
    })
    const totalItems = Object.values(map).reduce((a, b) => a + b, 0) || 1
    return Object.entries(map).map(([cat, qty]) => ({
      category: cat,
      quantity: qty,
      percentage: Math.round((qty / totalItems) * 100)
    })).sort((a, b) => b.quantity - a.quantity)
  }, [sales, products])

  // 4. Fornecedores Mais Acionados
  const topSuppliers = useMemo(() => {
    const map = {}
    sales.forEach(s => {
      s.items.forEach(i => {
        const suppId = i.supplierId || 'supp-1'
        const supp = suppliers.find(sup => sup.id === suppId)
        const suppName = supp ? supp.name : 'Fornecedor JP'
        const cost = (i.actualCost || i.estimatedCost || 0) * i.quantity
        if (!map[suppName]) {
          map[suppName] = { name: suppName, totalCost: 0, itemsCount: 0 }
        }
        map[suppName].totalCost += cost
        map[suppName].itemsCount += i.quantity
      })
    })
    return Object.values(map).sort((a, b) => b.totalCost - a.totalCost).slice(0, 4)
  }, [sales, suppliers])

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
              Aba 9 · Inteligência e Vendas
            </span>
            <span style={{ fontSize: '0.8rem', color: '#887B7D' }}>• Desempenho e preferências das clientes</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
            Relatórios & Indicadores
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#685D60' }}>
            Descubra as peças mais vendidas, clientes fiéis e categorias com maior volume de pedidos.
          </p>
        </div>

        {/* Seletor de Período */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#FFFFFF',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 1px 4px rgba(42,36,38,0.03)'
        }}>
          <button
            onClick={() => setPeriod('semana')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: period === 'semana' ? '#731A30' : 'transparent',
              color: period === 'semana' ? '#FFFFFF' : '#685D60',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriod('mes')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: period === 'mes' ? '#731A30' : 'transparent',
              color: period === 'mes' ? '#FFFFFF' : '#685D60',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Este Mês
          </button>
          <button
            onClick={() => setPeriod('tudo')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: period === 'tudo' ? '#731A30' : 'transparent',
              color: period === 'tudo' ? '#FFFFFF' : '#685D60',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Todo o Histórico
          </button>
        </div>
      </div>

      {/* Cards de Indicadores Superiores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '22px'
      }}>
        {/* Card 1: Vendas Confirmadas */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#731A30', textTransform: 'uppercase' }}>
              Vendas Confirmadas
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2A2426' }}>
            {totalSalesCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            faturamento de {formatBRL(totalSalesRevenue)}
          </span>
        </div>

        {/* Card 2: Solicitações pelo Catálogo */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#80530E', textTransform: 'uppercase' }}>
              Solicitações na Fila
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFBF0', color: '#80530E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#80530E' }}>
            {totalRequestsCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            pedidos enviados pelas clientes
          </span>
        </div>

        {/* Card 3: Recebimentos Efetivos */}
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
              <ArrowUpRight size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1B6A43' }}>
            {formatBRL(totalReceivedCash)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            entradas sem risco de inadimplência
          </span>
        </div>

        {/* Card 4: Despesas Registradas */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#A82B3E', textTransform: 'uppercase' }}>
              Despesas da Operação
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF0F2', color: '#A82B3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#A82B3E' }}>
            {formatBRL(totalExpensesAmount)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            combustível, refeições e embalagens
          </span>
        </div>
      </div>

      {/* Grid Principal: Ranking de Produtos & Melhores Clientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '22px' }}>
        {/* Bloco 1: Produtos Mais Vendidos */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                Peças Mais Vendidas & Procuradas
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>Ranking por unidades encomendadas</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topProducts.map((p, idx) => {
              const widthPct = Math.round((p.quantity / maxProductQty) * 100)
              return (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#C89D5C' : '#F4EFEB',
                    color: idx === 0 ? '#FFFFFF' : '#685D60',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>

                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80'}
                    alt={p.name}
                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #ECE5DE', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A2426', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#731A30', flexShrink: 0 }}>
                        {p.quantity} {p.quantity === 1 ? 'par/peça' : 'pares/peças'}
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: '#F4EFEB', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${widthPct}%`, height: '100%', background: '#731A30', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bloco 2: Melhores Clientes (com FOTO CIRCULAR + NOME) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                Melhores Clientes da M_I Store
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>Clientes mais fiéis por volume de compra</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topCustomers.map((cust, idx) => {
              const avatar = getCustomerAvatar(cust.name)
              return (
                <div
                  key={cust.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#FAF8F6',
                    border: '1px solid #ECE5DE'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: idx === 0 ? '#C89D5C' : '#887B7D',
                      width: '16px'
                    }}>
                      #{idx + 1}
                    </span>

                    {/* Foto Circular do Cliente */}
                    <img
                      src={avatar}
                      alt={cust.name}
                      className="client-avatar"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #E5E7EB'
                      }}
                    />

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#2A2426' }}>
                        {cust.name}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#685D60' }}>
                        {cust.totalOrders || 0} compras • {cust.city || 'Cuité de Mamanguape'}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#1B6A43', fontSize: '0.9rem' }}>
                      {formatBRL(cust.totalSpent || 0)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#887B7D' }}>acumulado</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid Secundário: Categorias & Fornecedores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Bloco 3: Vendas por Categoria */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F5F2F0', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                Distribuição por Categoria
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>Participação nas vendas encomendadas</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryStats.map(cat => (
              <div key={cat.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#2A2426' }}>{cat.category}</span>
                  <span style={{ fontWeight: 800, color: '#731A30' }}>
                    {cat.quantity} peças ({cat.percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F4EFEB', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percentage}%`, height: '100%', background: '#731A30', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 4: Fornecedores Mais Acionados */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FAF8F6', color: '#685D60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                Boxes Mais Acionados em JP
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>Concentração de compras em viagens</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topSuppliers.map(sup => (
              <div
                key={sup.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#FAF8F6',
                  border: '1px solid #ECE5DE'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2A2426' }}>
                    {sup.name}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#685D60' }}>
                    {sup.itemsCount} itens comprados
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#731A30', fontSize: '0.88rem' }}>
                    {formatBRL(sup.totalCost)}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#887B7D' }}>em mercadoria</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
