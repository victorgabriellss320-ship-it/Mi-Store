import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/common/Button'
import { Drawer } from '../../components/common/Drawer'
import { formatBRL, formatDateShort, cleanPhoneForWa } from '../../utils/formatters'
import {
  Users,
  Search,
  MessageCircle,
  MapPin,
  ShoppingBag,
  Wallet,
  Clock,
  ArrowRight
} from 'lucide-react'

export function ClientesPage() {
  const { customers, sales, navigateTo } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDebt, setFilterDebt] = useState('all') // 'all', 'debt_only', 'clean'
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = customers.filter(c => {
    const hasDebt = (c.currentDebt || 0) > 0
    const matchesDebt = filterDebt === 'all' || (filterDebt === 'debt_only' && hasDebt) || (filterDebt === 'clean' && !hasDebt)
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.whatsapp.includes(searchTerm) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesDebt && matchesSearch
  })

  // Pedidos do cliente selecionado
  const customerSales = selectedCustomer
    ? sales.filter(s => s.customerId === selectedCustomer.id || s.customerPhone.replace(/\D/g, '') === selectedCustomer.whatsapp.replace(/\D/g, ''))
    : []

  return (
    <AdminLayout
      title="Clientes & Histórico de Compras"
      subtitle="Carteira de clientes, histórico de encomendas, endereços de entrega e controle de saldo"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Barra de Busca e Filtros */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: 'Todos os Clientes', count: customers.length },
                { id: 'debt_only', label: 'Com Fiado em Aberto', count: customers.filter(c => c.currentDebt > 0).length, highlight: true },
                { id: 'clean', label: 'Sem Pendências', count: customers.filter(c => !c.currentDebt || c.currentDebt === 0).length }
              ].map(tab => {
                const isActive = filterDebt === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterDebt(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'var(--color-primary)' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    <span>{tab.label}</span>
                    <span style={{
                      fontSize: '0.6875rem',
                      marginLeft: '6px',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface-subtle)',
                      color: isActive ? '#fff' : 'inherit'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar cliente, WhatsApp ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', height: '36px' }}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>WhatsApp</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cidade / Endereço</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total Comprado</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Saldo em Aberto (Fiado)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(cust => {
                  const hasDebt = (cust.currentDebt || 0) > 0
                  return (
                    <tr
                      key={cust.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: hasDebt ? '#fffcf9' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onClick={() => setSelectedCustomer(cust)}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = hasDebt ? '#fffcf9' : 'transparent' }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cust.name}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {cust.totalOrders || 1} {cust.totalOrders === 1 ? 'pedido' : 'pedidos'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {cust.whatsapp}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'var(--text-primary)' }}>{cust.city}</div>
                        {cust.address && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cust.address}</div>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatBRL(cust.totalSpent || 0)}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        {hasDebt ? (
                          <span style={{
                            background: 'var(--status-warning-bg)',
                            color: 'var(--status-warning-text)',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Wallet size={12} /> {formatBRL(cust.currentDebt)}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--status-success-text)', fontWeight: 600 }}>
                            Em dia ✓
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCustomer(cust)
                          }}
                        >
                          Perfil 360º
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drawer Perfil 360º do Cliente */}
        <Drawer
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Perfil de ${selectedCustomer?.name || ''}`}
          width="540px"
          footer={
            selectedCustomer && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://wa.me/${cleanPhoneForWa(selectedCustomer.whatsapp)}?text=${encodeURIComponent(`Olá ${selectedCustomer.name}! Aqui é Edvania da M_I Store.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md"
                  style={{ flex: 1, backgroundColor: '#25D366', borderColor: '#25D366' }}
                >
                  <MessageCircle size={16} /> WhatsApp da Cliente
                </a>

                {selectedCustomer.currentDebt > 0 && (
                  <Button
                    variant="soft"
                    size="md"
                    onClick={() => {
                      setSelectedCustomer(null)
                      navigateTo('admin-a-receber')
                    }}
                  >
                    Ver no A Receber
                  </Button>
                )}
              </div>
            )
          }
        >
          {selectedCustomer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Card Resumo do Cliente */}
              <div style={{
                background: 'var(--bg-surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedCustomer.name}
                  </h3>
                  {selectedCustomer.currentDebt > 0 ? (
                    <span className="badge badge-warning">Fiado em Aberto</span>
                  ) : (
                    <span className="badge badge-success">Cliente em Dia</span>
                  )}
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div><strong>WhatsApp:</strong> {selectedCustomer.whatsapp}</div>
                  <div><strong>Cidade:</strong> {selectedCustomer.city}</div>
                  {selectedCustomer.address && <div><strong>Endereço:</strong> {selectedCustomer.address}</div>}
                </div>

                {selectedCustomer.notes && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    Nota de Edvania: "{selectedCustomer.notes}"
                  </div>
                )}
              </div>

              {/* Indicadores de Compras */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Já Comprado</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {formatBRL(selectedCustomer.totalSpent || 0)}
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  background: selectedCustomer.currentDebt > 0 ? 'var(--status-warning-bg)' : 'transparent'
                }}>
                  <span style={{ fontSize: '0.75rem', color: selectedCustomer.currentDebt > 0 ? 'var(--status-warning-text)' : 'var(--text-muted)' }}>
                    Saldo em Aberto (Dívida)
                  </span>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: selectedCustomer.currentDebt > 0 ? 'var(--status-warning-text)' : 'var(--status-success-text)',
                    marginTop: '2px'
                  }}>
                    {formatBRL(selectedCustomer.currentDebt || 0)}
                  </div>
                </div>
              </div>

              {/* Histórico de Pedidos / Vendas */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Histórico de Pedidos ({customerSales.length})
                </h4>

                {customerSales.length === 0 ? (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '14px', textAlign: 'center', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
                    Nenhuma venda registrada para este cliente ainda.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {customerSales.map(sale => (
                      <div
                        key={sale.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <div>
                          <strong>{sale.code}</strong> • {formatDateShort(sale.createdAt)}
                          <div style={{ color: 'var(--text-secondary)' }}>
                            {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatBRL(sale.total)}</div>
                          <span style={{ fontSize: '0.6875rem', color: sale.balanceDue > 0 ? '#b35e16' : 'var(--status-success-text)' }}>
                            {sale.balanceDue > 0 ? `Devendo: ${formatBRL(sale.balanceDue)}` : 'Quitado ✓'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </AdminLayout>
  )
}
