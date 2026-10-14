import React from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ActionCard } from '../../components/admin/ActionCard'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { Button } from '../../components/common/Button'
import { formatBRL, formatDateShort } from '../../utils/formatters'
import {
  Inbox,
  Luggage,
  Truck,
  Wallet,
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  PhoneCall
} from 'lucide-react'

export function DashboardPage() {
  const { requests, sales, currentTrip, customers, navigateTo } = useApp()

  // 1. Métricas do Bloco "Hoje"
  const pendingRequests = requests.filter(r => r.status === 'new')
  const pendingTripItems = currentTrip?.items?.filter(i => i.status === 'pending') || []
  const readyDeliveries = sales.filter(s => s.status === 'ready_for_delivery' || s.status === 'out_for_delivery')
  const totalDebt = customers.reduce((acc, c) => acc + (c.currentDebt || 0), 0)

  // 2. Métricas da Próxima Viagem JP
  const tripSuppliersCount = new Set(currentTrip?.items?.map(i => i.supplierId)).size
  const tripTotalEstimatedCost = currentTrip?.items?.reduce((acc, i) => acc + (i.estimatedCost * i.quantity), 0) || 0
  const tripTotalSaleValue = currentTrip?.items?.reduce((acc, i) => acc + (i.salePrice * i.quantity), 0) || 0
  const tripProjectedProfit = tripTotalSaleValue - tripTotalEstimatedCost

  // 3. Resumo Financeiro Geral
  const totalSalesValue = sales.reduce((acc, s) => acc + s.total, 0)
  const totalReceivedInHand = sales.reduce((acc, s) => acc + s.totalPaid, 0)
  const totalBalanceDue = sales.reduce((acc, s) => acc + s.balanceDue, 0)
  const totalCost = sales.reduce((acc, s) => acc + (s.actualCost || s.estimatedCost || 0), 0)
  const totalProfitRealized = totalReceivedInHand - totalCost

  return (
    <AdminLayout
      title="Painel Operacional — Hoje"
      subtitle="Visão prática e acionável do dia a dia da M_I Store e da viagem semanal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Bloco 1: Ações Prioritárias de Hoje */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Atenção Prioritária (Hoje)
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            <ActionCard
              title="Solicitações Pendentes"
              count={pendingRequests.length}
              subtitle={pendingRequests.length > 0 ? 'Clientes aguardando confirmação no WhatsApp' : 'Nenhuma solicitação pendente'}
              icon={Inbox}
              variant={pendingRequests.length > 0 ? 'warning' : 'neutral'}
              badgeText={pendingRequests.length > 0 ? 'Ação necessária' : 'Tudo em dia'}
              onClick={() => navigateTo('admin-solicitacoes')}
            />

            <ActionCard
              title="Itens p/ Compra em JP"
              count={pendingTripItems.length}
              subtitle={`Distribuídos em ${tripSuppliersCount} fornecedores`}
              icon={Luggage}
              variant={pendingTripItems.length > 0 ? 'primary' : 'neutral'}
              badgeText={currentTrip ? `Viagem: ${currentTrip.date}` : null}
              onClick={() => navigateTo('admin-compra-semana')}
            />

            <ActionCard
              title="Prontos p/ Entrega"
              count={readyDeliveries.length}
              subtitle="Encomendas compradas aguardando entrega ou retirada"
              icon={Truck}
              variant={readyDeliveries.length > 0 ? 'info' : 'neutral'}
              onClick={() => navigateTo('admin-entregas')}
            />

            <ActionCard
              title="Total em Fiados / A Receber"
              count={formatBRL(totalDebt)}
              subtitle={`${customers.filter(c => c.currentDebt > 0).length} clientes com saldo em aberto`}
              icon={Wallet}
              variant={totalDebt > 0 ? 'warning' : 'success'}
              badgeText="Cobranças"
              onClick={() => navigateTo('admin-a-receber')}
            />
          </div>
        </div>

        {/* Bloco 2: Painel Central da Próxima Compra em João Pessoa */}
        {currentTrip && (
          <div style={{
            background: 'linear-gradient(135deg, #2b2326 0%, #1e191b 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid #44373a'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{
                  background: 'rgba(200, 157, 92, 0.25)',
                  border: '1px solid #c89d5c',
                  color: '#f0c888',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  textTransform: 'uppercase'
                }}>
                  <Calendar size={12} /> Próxima Viagem Programada
                </span>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                  Compras da Semana em João Pessoa • {currentTrip.date}
                </h3>
              </div>

              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={() => navigateTo('admin-compra-semana')}
                style={{ backgroundColor: '#c89d5c', color: '#1f1b1d', fontWeight: 700 }}
              >
                Abrir Checklist da Viagem
              </Button>
            </div>

            {/* Métricas da Viagem */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Total de Peças Encomendadas</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {currentTrip.items.length} itens
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#88e0a3' }}>
                  {currentTrip.items.filter(i => i.status === 'purchased').length} já comprados
                </span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Fornecedores a Visitar</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {tripSuppliersCount} parceiros
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#d1c7bc' }}>
                  Box JP Calçados, Bella Atacado...
                </span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Custo Estimado da Mercadoria</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0b080', marginTop: '4px' }}>
                  {formatBRL(tripTotalEstimatedCost)}
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#a89d96' }}>
                  Capital a levar na viagem
                </span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: '#a89d96' }}>Lucro Bruto Projetado</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9ce0b5', marginTop: '4px' }}>
                  {formatBRL(tripProjectedProfit)}
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#a89d96' }}>
                  Margem média de {tripTotalSaleValue > 0 ? Math.round((tripProjectedProfit / tripTotalSaleValue) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bloco 3: Resumo Financeiro Real vs Previsto */}
        <div className="card">
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
                Saúde Financeira da Loja
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Separação transparente entre vendido, dinheiro efetivamente na mão e fiado em aberto
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigateTo('admin-financeiro')}
            >
              Ver Extrato Completo
            </Button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px'
          }}>
            <div style={{ padding: '14px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Vendido em Pedidos</span>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {formatBRL(totalSalesValue)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                {sales.length} vendas registradas
              </span>
            </div>

            <div style={{ padding: '14px', background: 'var(--status-success-bg)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-success-text)' }}>Dinheiro no Bolso (Recebido)</span>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--status-success-text)', marginTop: '4px' }}>
                {formatBRL(totalReceivedInHand)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--status-success-text)' }}>
                Efetivamente pago via Pix/Dinheiro
              </span>
            </div>

            <div style={{ padding: '14px', background: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-warning-text)' }}>Fiado / A Receber</span>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--status-warning-text)', marginTop: '4px' }}>
                {formatBRL(totalBalanceDue)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--status-warning-text)' }}>
                A receber após a entrega
              </span>
            </div>

            <div style={{ padding: '14px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>Lucro Realizado no Bolso</span>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                {formatBRL(totalProfitRealized)}
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-primary)' }}>
                Já descontado o custo pago
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 4: Solicitações Recentes para Ação Imediata */}
        <div className="card">
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
                Solicitações de Encomenda Recentes
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Pedidos recebidos através do catálogo online aguardando contato
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigateTo('admin-solicitacoes')}
            >
              Ver Todas ({requests.length})
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {requests.slice(0, 4).map(req => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                      {req.code}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {req.customerName}
                    </span>
                    <StatusBadge status={req.status} type="request" />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {req.items.length} {req.items.length === 1 ? 'item' : 'itens'} • {formatBRL(req.total)} • {req.customerCity}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => navigateTo('admin-solicitacoes', { selectedRequestId: req.id })}
                  >
                    Gerenciar Solicitação
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
