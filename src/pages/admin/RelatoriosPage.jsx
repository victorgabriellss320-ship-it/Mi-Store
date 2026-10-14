import React from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { formatBRL } from '../../utils/formatters'
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  ShoppingBag,
  Building2,
  Sparkles
} from 'lucide-react'

export function RelatoriosPage() {
  const { sales, products, suppliers, customers } = useApp()

  // 1. Contabiliza produtos mais vendidos
  const productCountMap = {}
  sales.forEach(s => {
    s.items.forEach(i => {
      productCountMap[i.productName] = (productCountMap[i.productName] || 0) + i.quantity
    })
  })

  const topProducts = Object.entries(productCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const maxProductCount = topProducts[0]?.count || 1

  // 2. Melhores Clientes
  const sortedCustomers = [...customers].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0)).slice(0, 5)

  // 3. Fornecedores mais comprados
  const supplierSpentMap = {}
  sales.forEach(s => {
    s.items.forEach(i => {
      const suppId = i.supplierId || 'supp-1'
      const cost = (i.actualCost || i.estimatedCost || 0) * i.quantity
      supplierSpentMap[suppId] = (supplierSpentMap[suppId] || 0) + cost
    })
  })

  const topSuppliers = Object.entries(supplierSpentMap)
    .map(([id, spent]) => {
      const supp = suppliers.find(s => s.id === id)
      return {
        name: supp ? supp.name : 'Atacadista JP',
        spent
      }
    })
    .sort((a, b) => b.spent - a.spent)

  return (
    <AdminLayout
      title="Relatórios & Inteligência de Negócio"
      subtitle="Métricas simples e práticas para apoiar decisões de compra e mix de produtos"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Grid de Relatórios Práticos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px'
        }}>
          {/* Top Produtos Mais Pedidos */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Award size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Top 5 Produtos Mais Pedidos
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topProducts.map((p, idx) => {
                const percentage = Math.round((p.count / maxProductCount) * 100)
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {idx + 1}. {p.name}
                      </span>
                      <strong style={{ color: 'var(--color-primary)' }}>{p.count} unid.</strong>
                    </div>

                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #85334c 0%, #aa4b68 100%)',
                        borderRadius: '999px'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Melhores Clientes por Faturamento */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Users size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Melhores Clientes (Fidelidade)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedCustomers.map((cust, idx) => (
                <div
                  key={cust.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-subtle)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cust.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{cust.city}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                      {formatBRL(cust.totalSpent || 0)}
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {cust.totalOrders || 1} pedidos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fornecedores com Maior Volume de Compra */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Volume Comprado por Fornecedor em João Pessoa
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px'
            }}>
              {topSuppliers.map((supp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-subtle)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Atacadista JP</span>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {supp.name}
                  </h4>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '6px' }}>
                    {formatBRL(supp.spent)}
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    Total de mercadorias adquiridas
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
