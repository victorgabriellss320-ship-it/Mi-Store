import React, { useState } from 'react'
import {
  FileText,
  ShoppingCart,
  Truck,
  Users,
  ChevronRight,
  Calendar,
  ShoppingBag,
  Share2,
  DollarSign,
  TrendingUp,
  Tag,
  BarChart2,
  ChevronDown,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  X,
  MessageCircle,
  Building2,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react'
import { Modal } from '../../components/common/Modal'

export function DashboardOverview({ onToast }) {
  // 1. Estados Dinâmicos dos Contadores Operacionais
  const [solicitacoesCount, setSolicitacoesCount] = useState(8)
  const [comprasCount, setComprasCount] = useState(24)
  const [prontosCount, setProntosCount] = useState(12)
  const [pendentesCount, setPendentesCount] = useState(6)

  // 2. Estado do Seletor de Período Financeiro
  const [selectedPeriod, setSelectedPeriod] = useState('Este mês (Maio)')
  const [isPeriodOpen, setIsPeriodOpen] = useState(false)

  // 3. Controle de Modais Operacionais
  const [activeModal, setActiveModal] = useState(null) // 'solicitacoes', 'compras', 'prontos', 'pendentes', 'compra_detalhes', 'calendario', 'pedido_detalhe'
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null)

  // Dados Financeiros por Período
  const financialPeriods = {
    'Este mês (Maio)': {
      vendas: 'R$ 12.850,00',
      pedidos: '48 pedidos',
      recebido: 'R$ 8.420,00',
      recebidoPct: '66% do total',
      aReceber: 'R$ 4.430,00',
      aReceberPct: '34% do total',
      custo: 'R$ 5.200,00',
      custoPct: '40% das vendas',
      custoBarPct: 40,
      lucro: 'R$ 7.650,00',
      lucroPct: '60% das vendas',
      lucroBarPct: 60
    },
    'Mês anterior (Abril)': {
      vendas: 'R$ 10.900,00',
      pedidos: '42 pedidos',
      recebido: 'R$ 10.450,00',
      recebidoPct: '96% do total',
      aReceber: 'R$ 450,00',
      aReceberPct: '4% do total',
      custo: 'R$ 4.360,00',
      custoPct: '40% das vendas',
      custoBarPct: 40,
      lucro: 'R$ 6.540,00',
      lucroPct: '60% das vendas',
      lucroBarPct: 60
    },
    'Últimos 90 dias': {
      vendas: 'R$ 34.200,00',
      pedidos: '128 pedidos',
      recebido: 'R$ 29.320,00',
      recebidoPct: '86% do total',
      aReceber: 'R$ 4.880,00',
      aReceberPct: '14% do total',
      custo: 'R$ 13.680,00',
      custoPct: '40% das vendas',
      custoBarPct: 40,
      lucro: 'R$ 20.520,00',
      lucroPct: '60% das vendas',
      lucroBarPct: 60
    }
  }

  const currentFin = financialPeriods[selectedPeriod] || financialPeriods['Este mês (Maio)']

  // Lista Dinâmica de Pedidos Recentes
  const [orders, setOrders] = useState([
    {
      id: 1,
      code: '#MI-1048',
      name: 'Juliana Costa',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '(83) 98877-1122',
      itemsCount: 1,
      itemsDesc: '1x Sandália Rasteira Trançada Dourada (Tam 37)',
      value: 'R$ 285,00',
      numericValue: 285,
      status: 'Confirmado',
      statusType: 'success',
      date: '26/05',
      address: 'Rua São José, Centro, Cuité de Mamanguape'
    },
    {
      id: 2,
      code: '#MI-1045',
      name: 'Mariana Silva',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      phone: '(83) 99655-3344',
      itemsCount: 3,
      itemsDesc: '1x Bolsa Tiracolo Matelassê + 2x Rasteirinhas Verniz',
      value: 'R$ 560,00',
      numericValue: 560,
      status: 'Confirmado',
      statusType: 'success',
      date: '26/05',
      address: 'Av. Brasil, 140, Cuité'
    },
    {
      id: 3,
      code: '#MI-1042',
      name: 'Ana Beatriz',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      phone: '(83) 99122-8877',
      itemsCount: 2,
      itemsDesc: '2x Sandália Salto Bloco Tiras Finas Nude (Tam 36)',
      value: 'R$ 410,00',
      numericValue: 410,
      status: 'Pagamento pendente',
      statusType: 'pending',
      date: '25/05',
      address: 'Bairro Novo, Cuité de Mamanguape'
    },
    {
      id: 4,
      code: '#MI-1040',
      name: 'Carla Souza',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      phone: '(83) 98711-4455',
      itemsCount: 4,
      itemsDesc: '1x Vestido Canelado + 1x Bolsa + 2x Brincos Festa',
      value: 'R$ 730,00',
      numericValue: 730,
      status: 'Pagamento pendente',
      statusType: 'pending',
      date: '25/05',
      address: 'Rua das Flores, 88'
    },
    {
      id: 5,
      code: '#MI-1038',
      name: 'Fernanda Lima',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      phone: '(83) 99888-7766',
      itemsCount: 1,
      itemsDesc: '1x Scarpin Salto Baixo Clássico Preto (Tam 38)',
      value: 'R$ 299,00',
      numericValue: 299,
      status: 'Pago',
      statusType: 'success',
      date: '24/05',
      address: 'Rua Bela Vista, Cuité'
    }
  ])

  // Lista de Solicitações para o Modal
  const [solicitacoesList, setSolicitacoesList] = useState([
    { id: 101, name: 'Juliana Alves', phone: '(83) 98877-6655', product: 'Sandália Rasteira Trançada Dourada (Tam 37)', value: 'R$ 89,90' },
    { id: 102, name: 'Renata Castro', phone: '(83) 99611-2233', product: 'Bolsa Tiracolo Matelassê Preta', value: 'R$ 129,90' },
    { id: 103, name: 'Camila Duarte', phone: '(83) 99344-5566', product: 'Salto Bloco Nude Rosé (Tam 36)', value: 'R$ 139,90' },
    { id: 104, name: 'Letícia Barbosa', phone: '(83) 99811-7788', product: 'Vestido Midi Canelado Terracota (Tam M)', value: 'R$ 149,90' },
    { id: 105, name: 'Priscila Mendes', phone: '(83) 98722-3344', product: 'Rasteira Pérola Off-White (Tam 38)', value: 'R$ 79,90' },
    { id: 106, name: 'Sabrina Ferreira', phone: '(83) 99188-4455', product: 'Bolsa Baguete Caramelo', value: 'R$ 119,90' },
    { id: 107, name: 'Tatiana Ribeiro', phone: '(83) 98833-2211', product: 'Mule Bico Fino Metalizada (Tam 37)', value: 'R$ 109,90' },
    { id: 108, name: 'Valéria Monteiro', phone: '(83) 99677-8899', product: 'Conjunto Colar + Argola Banhada', value: 'R$ 69,90' },
  ])

  // Itens para Compra na Viagem
  const [shoppingItems, setShoppingItems] = useState([
    { id: 1, supplier: 'JP Calçados (Box 14)', product: 'Rasteira Trançada Dourada', size: '37', qty: 3, client: 'Juliana Costa', cost: 48, bought: false },
    { id: 2, supplier: 'JP Calçados (Box 14)', product: 'Salto Bloco Tiras Finas Nude', size: '36', qty: 2, client: 'Ana Beatriz', cost: 72, bought: false },
    { id: 3, supplier: 'Bella Atacado (Rua Maciel Pinheiro)', product: 'Bolsa Tiracolo Matelassê', size: 'Único', qty: 2, client: 'Mariana Silva', cost: 68, bought: false },
    { id: 4, supplier: 'Bella Atacado (Rua Maciel Pinheiro)', product: 'Bolsa Baguete Caramelo', size: 'Único', qty: 1, client: 'Sabrina F.', cost: 60, bought: false },
    { id: 5, supplier: 'Moda Center JP', product: 'Vestido Midi Canelado', size: 'M', qty: 2, client: 'Carla Souza', cost: 75, bought: false },
    { id: 6, supplier: 'Mix Importados', product: 'Brincos Festa Dourados', size: 'Único', qty: 4, client: 'Carla Souza', cost: 22, bought: false }
  ])

  // Clientes com Fiado Pendente
  const [debtorsList, setDebtorsList] = useState([
    { id: 1, name: 'Ana Beatriz', phone: '(83) 99122-8877', order: '#MI-1042', due: 'R$ 410,00', date: '25/05' },
    { id: 2, name: 'Carla Souza', phone: '(83) 98711-4455', order: '#MI-1040', due: 'R$ 730,00', date: '25/05' },
    { id: 3, name: 'Patrícia Gomes', phone: '(83) 99311-5522', order: '#MI-1035', due: 'R$ 520,00', date: '22/05' },
    { id: 4, name: 'Camila Rocha', phone: '(83) 99877-3311', order: '#MI-1033', due: 'R$ 380,00', date: '20/05' },
    { id: 5, name: 'Vanessa Lima', phone: '(83) 98744-9988', order: '#MI-1030', due: 'R$ 890,00', date: '18/05' },
    { id: 6, name: 'Roberta Dias', phone: '(83) 99655-1100', order: '#MI-1028', due: 'R$ 1.500,00', date: '15/05' },
  ])

  // Pedidos Prontos para Entrega
  const [readyDeliveries, setReadyDeliveries] = useState([
    { id: 1, name: 'Mariana Silva', phone: '(83) 99655-3344', order: '#MI-1045', type: 'Entrega em Domicílio', address: 'Av. Brasil, 140' },
    { id: 2, name: 'Juliana Costa', phone: '(83) 98877-1122', order: '#MI-1048', type: 'Retirada na Loja', address: 'Loja M_I Store' },
    { id: 3, name: 'Letícia Lima', phone: '(83) 99123-4567', order: '#MI-1039', type: 'Entrega em Domicílio', address: 'Rua Nova, 54' },
    { id: 4, name: 'Gisele Santos', phone: '(83) 99888-2211', order: '#MI-1037', type: 'Retirada na Loja', address: 'Loja M_I Store' },
  ])

  // Ações Funcionais em Tempo Real
  const handleConfirmSolicitacao = (id, clientName) => {
    setSolicitacoesList(prev => prev.filter(s => s.id !== id))
    setSolicitacoesCount(c => Math.max(0, c - 1))
    setComprasCount(c => c + 1)
    if (onToast) onToast(`Solicitação de ${clientName} aprovada e enviada para a Compra da Semana!`)
  }

  const handleToggleBoughtItem = (id) => {
    setShoppingItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.bought
        if (nextState) {
          setComprasCount(c => Math.max(0, c - 1))
          if (onToast) onToast(`Item "${item.productName || item.product}" marcado como comprado!`)
        } else {
          setComprasCount(c => c + 1)
        }
        return { ...item, bought: nextState }
      }
      return item
    }))
  }

  const handlePayOrder = (orderId, clientName) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'Pago', statusType: 'success' }
      }
      return ord
    }))
    setPendentesCount(c => Math.max(0, c - 1))
    setDebtorsList(prev => prev.filter(d => d.name !== clientName))
    setActiveModal(null)
    if (onToast) onToast(`Pagamento de ${clientName} registrado com sucesso! Saldo quitado.`)
  }

  const handleDeliverOrder = (deliveryId, clientName) => {
    setReadyDeliveries(prev => prev.filter(d => d.id !== deliveryId))
    setProntosCount(c => Math.max(0, c - 1))
    if (onToast) onToast(`Pedido de ${clientName} entregue com sucesso!`)
  }

  return (
    <div className="dashboard-page">
      {/* 6. Cabeçalho do Dashboard */}
      <div className="dashboard-header">
        <div>
          <h1 className="greeting-title">Olá, Edvania!</h1>
          <p className="greeting-subtitle">
            Aqui está o resumo da sua loja. Acompanhe suas vendas, pedidos e próximas ações.
          </p>
        </div>

        {/* Card de Data Clicável (Abre Calendário de Viagens) */}
        <div
          className="date-badge"
          onClick={() => setActiveModal('calendario')}
          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
          title="Ver calendário de viagens"
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#731A30' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
        >
          <Calendar size={16} color="#731A30" />
          <span>Segunda-feira, 26 de Maio de 2025</span>
        </div>
      </div>

      {/* 7. Primeira Linha — 4 Cards Operacionais Funcionais */}
      <div className="operational-cards-grid">
        {/* Card 1: Solicitações */}
        <div
          className="op-card"
          onClick={() => setActiveModal('solicitacoes')}
          title="Ver solicitações aguardando confirmação"
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap">
              <FileText size={20} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="op-card-number">{solicitacoesCount}</span>
              <div className="op-card-texts">
                <span className="op-card-title">Solicitações</span>
                <span className="op-card-desc">aguardando confirmação</span>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="op-card-arrow" />
        </div>

        {/* Card 2: Itens para Comprar */}
        <div
          className="op-card"
          onClick={() => setActiveModal('compras')}
          title="Ver checklist de compras para João Pessoa"
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap">
              <ShoppingCart size={20} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="op-card-number">{comprasCount}</span>
              <div className="op-card-texts">
                <span className="op-card-title">Itens para comprar</span>
                <span className="op-card-desc">para a próxima viagem</span>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="op-card-arrow" />
        </div>

        {/* Card 3: Pedidos Prontos */}
        <div
          className="op-card"
          onClick={() => setActiveModal('prontos')}
          title="Ver entregas e retiradas pendentes"
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap">
              <Truck size={20} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="op-card-number">{prontosCount}</span>
              <div className="op-card-texts">
                <span className="op-card-title">Pedidos prontos</span>
                <span className="op-card-desc">para entrega</span>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="op-card-arrow" />
        </div>

        {/* Card 4: Clientes Pendentes */}
        <div
          className="op-card"
          onClick={() => setActiveModal('pendentes')}
          title="Ver clientes com saldo ou fiado a receber"
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap">
              <Users size={20} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="op-card-number">{pendentesCount}</span>
              <div className="op-card-texts">
                <span className="op-card-title">Clientes</span>
                <span className="op-card-desc">com pagamento pendente</span>
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="op-card-arrow" />
        </div>
      </div>

      {/* Segunda Linha: Compra da Semana + Financeiro */}
      <div className="dashboard-grid-two-cols">
        {/* 8. Bloco — Compra da Semana */}
        <div className="dash-card">
          <div>
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <div className="dash-card-icon-pill">
                  <ShoppingBag size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="dash-card-title">Compra da Semana</h3>
                  <p className="dash-card-subtitle">Próxima viagem para João Pessoa</p>
                </div>
              </div>

              <button
                type="button"
                className="dash-card-link"
                onClick={() => setActiveModal('compra_detalhes')}
              >
                <span>Ver detalhes</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Banner da Próxima Viagem com Imagem de João Pessoa */}
            <div
              className="trip-banner"
              onClick={() => setActiveModal('compra_detalhes')}
              style={{ cursor: 'pointer' }}
              title="Clique para ver o roteiro em João Pessoa"
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                alt="João Pessoa"
                className="trip-banner-img"
              />
              <div className="trip-banner-info">
                <span className="trip-banner-label">
                  <Calendar size={13} color="#731A30" />
                  <span>Data da viagem</span>
                </span>
                <span className="trip-banner-date">30 de Maio de 2025</span>
                <span className="badge-pill-pink">Em 4 dias</span>
              </div>
            </div>

            {/* Resumo da Compra (3 Indicadores com Divisores Verticais) */}
            <div className="trip-stats-row">
              <div className="trip-stat-col">
                <FileText size={18} className="trip-stat-icon" />
                <div>
                  <div className="trip-stat-label">Total de itens</div>
                  <div className="trip-stat-value">{comprasCount}</div>
                </div>
              </div>

              <div className="trip-stat-divider" />

              <div className="trip-stat-col">
                <Share2 size={18} className="trip-stat-icon" />
                <div>
                  <div className="trip-stat-label">Fornecedores</div>
                  <div className="trip-stat-value">8</div>
                </div>
              </div>

              <div className="trip-stat-divider" />

              <div className="trip-stat-col">
                <DollarSign size={18} className="trip-stat-icon" />
                <div>
                  <div className="trip-stat-label">Custo estimado</div>
                  <div className="trip-stat-value">R$ 6.800,00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado da Viagem */}
          <div className="trip-bottom-row">
            <div className="trip-bottom-item">
              <Tag size={16} color="#731A30" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Valor de venda total</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>R$ 14.400,00</div>
              </div>
            </div>

            <div className="trip-bottom-item" style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} color="#731A30" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Lucro projetado</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-wine-dark)' }}>R$ 7.600,00</span>
                <span className="badge-pill-green">+ 112%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Bloco — Financeiro Funcional com Troca de Período */}
        <div className="dash-card">
          <div>
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <div className="dash-card-icon-pill">
                  <BarChart2 size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="dash-card-title">Financeiro</h3>
                  <p className="dash-card-subtitle">Resumo das vendas e valores</p>
                </div>
              </div>

              {/* Seletor de Período Funcional */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="period-dropdown"
                  onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                >
                  <span>{selectedPeriod}</span>
                  <ChevronDown size={14} color="#8C827A" />
                </button>

                {isPeriodOpen && (
                  <div className="dropdown-menu-floating" style={{ width: '180px' }}>
                    {Object.keys(financialPeriods).map((periodKey) => (
                      <button
                        key={periodKey}
                        type="button"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '9px 14px',
                          fontSize: '0.8rem',
                          color: selectedPeriod === periodKey ? '#731A30' : '#2A2426',
                          fontWeight: selectedPeriod === periodKey ? 700 : 500,
                          backgroundColor: selectedPeriod === periodKey ? '#FDF5F5' : '#FFFFFF',
                          borderBottom: '1px solid #F6F1EC'
                        }}
                        onClick={() => {
                          setSelectedPeriod(periodKey)
                          setIsPeriodOpen(false)
                          if (onToast) onToast(`Dados atualizados para: ${periodKey}`)
                        }}
                      >
                        {periodKey}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Linha 1: 3 Colunas com Divisores Verticais */}
            <div className="fin-metrics-row-1">
              <div className="fin-metric-col">
                <span className="fin-metric-label">Vendas confirmadas</span>
                <div className="fin-metric-value">{currentFin.vendas}</div>
                <div className="fin-metric-sub">{currentFin.pedidos}</div>
              </div>

              <div className="trip-stat-divider" />

              <div className="fin-metric-col">
                <span className="fin-metric-label">Recebido</span>
                <div className="fin-metric-value">{currentFin.recebido}</div>
                <div className="fin-metric-sub" style={{ color: 'var(--color-green-text)', fontWeight: 600 }}>
                  {currentFin.recebidoPct}
                </div>
              </div>

              <div className="trip-stat-divider" />

              <div className="fin-metric-col">
                <span className="fin-metric-label">A receber</span>
                <div className="fin-metric-value">{currentFin.aReceber}</div>
                <div className="fin-metric-sub" style={{ color: 'var(--color-wine-badge-text)', fontWeight: 600 }}>
                  {currentFin.aReceberPct}
                </div>
              </div>
            </div>

            {/* Linha 2: 2 Colunas */}
            <div className="fin-metrics-row-2">
              <div>
                <span className="fin-metric-label">Custo dos produtos</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {currentFin.custo}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentFin.custoPct}</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="fin-metric-label">Lucro previsto</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-wine-dark)', marginTop: '2px' }}>
                  {currentFin.lucro}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-green-text)', fontWeight: 600 }}>
                  {currentFin.lucroPct}
                </span>
              </div>
            </div>

            {/* Barra de Distribuição Horizontal Dinâmica */}
            <div className="distribution-bar">
              <div className="dist-bar-wine" style={{ width: `${currentFin.custoBarPct}%`, transition: 'width 0.4s ease' }} />
              <div className="dist-bar-pink" style={{ width: `${currentFin.lucroBarPct}%`, transition: 'width 0.4s ease' }} />
            </div>

            {/* Legenda Abaixo da Barra */}
            <div className="dist-legend-row">
              <div className="dist-legend-item">
                <span className="legend-dot-wine" />
                <span>{currentFin.custo} Custo dos produtos ({currentFin.custoBarPct}%)</span>
              </div>
              <div className="dist-legend-item">
                <span className="legend-dot-pink" />
                <span>{currentFin.lucro} Lucro previsto ({currentFin.lucroBarPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terceira Linha: Próximas Ações + Pedidos Recentes */}
      <div className="dashboard-grid-two-cols">
        {/* 10. Bloco — Próximas Ações Interativas */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <div className="dash-card-icon-pill">
                <CheckCircle2 size={18} strokeWidth={2} />
              </div>
              <div>
                <h3 className="dash-card-title">Próximas ações</h3>
                <p className="dash-card-subtitle">O que precisa da sua atenção hoje</p>
              </div>
            </div>

            <button
              type="button"
              className="dash-card-link"
              onClick={() => setActiveModal('solicitacoes')}
            >
              <span>Ver todas</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="action-lines-list">
            {/* Ação 1 */}
            <div
              className="action-line-item"
              onClick={() => setActiveModal('solicitacoes')}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap">
                  <FileText size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="action-title">Confirmar novas solicitações</div>
                  <div className="action-desc">Aprovar ou ajustar itens solicitados pelas clientes</div>
                </div>
              </div>
              <div className="action-line-right">
                <span className="badge-pill-pink" style={{ marginTop: 0 }}>{solicitacoesCount}</span>
                <ChevronRight size={16} color="#A39390" />
              </div>
            </div>

            {/* Ação 2 */}
            <div
              className="action-line-item"
              onClick={() => setActiveModal('compras')}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap">
                  <ShoppingCart size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="action-title">Comprar itens na viagem</div>
                  <div className="action-desc">Lista da próxima viagem para João Pessoa</div>
                </div>
              </div>
              <div className="action-line-right">
                <span className="badge-pill-pink" style={{ marginTop: 0 }}>{comprasCount}</span>
                <ChevronRight size={16} color="#A39390" />
              </div>
            </div>

            {/* Ação 3 */}
            <div
              className="action-line-item"
              onClick={() => setActiveModal('prontos')}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap">
                  <Truck size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="action-title">Separar e entregar pedidos</div>
                  <div className="action-desc">Pedidos prontos para entrega</div>
                </div>
              </div>
              <div className="action-line-right">
                <span className="badge-pill-pink" style={{ marginTop: 0 }}>{prontosCount}</span>
                <ChevronRight size={16} color="#A39390" />
              </div>
            </div>

            {/* Ação 4 */}
            <div
              className="action-line-item"
              onClick={() => setActiveModal('pendentes')}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap">
                  <CreditCard size={17} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="action-title">Cobrar clientes com pagamento pendente</div>
                  <div className="action-desc">Entrar em contato e confirmar recebimentos</div>
                </div>
              </div>
              <div className="action-line-right">
                <span className="badge-pill-pink" style={{ marginTop: 0 }}>{pendentesCount}</span>
                <ChevronRight size={16} color="#A39390" />
              </div>
            </div>
          </div>
        </div>

        {/* 11. Bloco — Pedidos Recentes Interativo */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <div className="dash-card-icon-pill">
                <ShoppingBag size={18} strokeWidth={2} />
              </div>
              <div>
                <h3 className="dash-card-title">Pedidos recentes</h3>
                <p className="dash-card-subtitle">Últimos pedidos confirmados</p>
              </div>
            </div>

            <button
              type="button"
              className="dash-card-link"
              onClick={() => {
                if (onToast) onToast('Visualizando todos os 5 pedidos recentes cadastrados.')
              }}
            >
              <span>Ver todos</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Tabela de Pedidos Recentes com Clique p/ Detalhes */}
          <div className="recent-orders-table-wrap">
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th style={{ textAlign: 'center' }}>Itens</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderForModal(order)
                      setActiveModal('pedido_detalhe')
                    }}
                    style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FDF5F5' }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    title="Clique para ver detalhes do pedido"
                  >
                    <td>
                      <div className="client-cell">
                        <img
                          src={order.photo}
                          alt={order.name}
                          className="client-avatar"
                        />
                        <span className="client-name">{order.name}</span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {order.itemsCount}
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {order.value}
                    </td>

                    <td>
                      {order.statusType === 'success' ? (
                        <span className="badge-pill-green">{order.status}</span>
                      ) : (
                        <span className="badge-pill-pink" style={{ marginTop: 0 }}>
                          {order.status}
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          MODAIS OPERACIONAIS FUNCIONAIS DA TELA INICIAL
          ========================================================================== */}

      {/* MODAL 1: Solicitações Pendentes (Card 1) */}
      <Modal
        isOpen={activeModal === 'solicitacoes'}
        onClose={() => setActiveModal(null)}
        title={`Solicitações Aguardando Confirmação (${solicitacoesList.length})`}
        maxWidth="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '0.8125rem', color: '#7A7067', margin: 0 }}>
            Clientes que escolheram modelos no catálogo online. Ao confirmar, o item é enviado automaticamente para a lista da próxima viagem!
          </p>

          {solicitacoesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#1D7A47', fontWeight: 600 }}>
              ✓ Todas as solicitações foram confirmadas!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {solicitacoesList.map((sol) => (
                <div
                  key={sol.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #ECE5DE',
                    background: '#FDF9F7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2A2426' }}>
                      {sol.name} <span style={{ fontSize: '0.75rem', color: '#7A7067', fontWeight: 400 }}>• {sol.phone}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#731A30', fontWeight: 600, marginTop: '2px' }}>
                      {sol.product}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#2A2426', marginTop: '2px' }}>
                      {sol.value}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://wa.me/55${sol.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${sol.name}! Aqui é Edvania da M_I Store referente ao seu pedido.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                      title="Conversar no WhatsApp"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleConfirmSolicitacao(sol.id, sol.name)}
                    >
                      <Check size={14} /> Confirmar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 2: Itens para Comprar na Viagem (Card 2) */}
      <Modal
        isOpen={activeModal === 'compras'}
        onClose={() => setActiveModal(null)}
        title={`Checklist de Compras em João Pessoa (${shoppingItems.filter(i => !i.bought).length} pendentes)`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: '#FDF5F5',
            border: '1px solid #F7E4E6',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#7A7067' }}>Próxima Viagem Programada:</span>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#731A30' }}>
                Quinta-feira, 30 de Maio de 2025
              </div>
            </div>
            <span className="badge-pill-pink">Em 4 dias</span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#7A7067', margin: 0 }}>
            Marque cada peça conforme for comprando nos boxes e atacados parceiros em JP:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
            {shoppingItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: item.bought ? '1px solid #C8EBD4' : '1px solid #ECE5DE',
                  background: item.bought ? '#F2FAF4' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => handleToggleBoughtItem(item.id)}
                    style={{ width: '18px', height: '18px', accentColor: '#731A30', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      color: item.bought ? '#8C827A' : '#2A2426',
                      textDecoration: item.bought ? 'line-through' : 'none'
                    }}>
                      {item.product}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>
                      Tam: {item.size} • Qtd: {item.qty} • Cliente: <strong>{item.client}</strong>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#731A30', fontWeight: 600 }}>
                      {item.supplier}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>Custo Est.</div>
                  <strong style={{ fontSize: '0.875rem', color: '#2A2426' }}>R$ {item.cost.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Pedidos Prontos para Entrega (Card 3) */}
      <Modal
        isOpen={activeModal === 'prontos'}
        onClose={() => setActiveModal(null)}
        title={`Pedidos Prontos para Entrega / Retirada (${readyDeliveries.length})`}
        maxWidth="620px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '0.8125rem', color: '#7A7067', margin: 0 }}>
            Mercadorias já trazidas da viagem aguardando rota ou retirada no local pelas clientes:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {readyDeliveries.map((del) => (
              <div
                key={del.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ECE5DE',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#2A2426' }}>
                    {del.name} <span style={{ color: '#731A30' }}>({del.order})</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#7A7067', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#731A30" />
                    <span>{del.address}</span>
                  </div>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    background: del.type === 'Entrega em Domicílio' ? '#FDF5F5' : '#F2FAF4',
                    color: del.type === 'Entrega em Domicílio' ? '#731A30' : '#1D7A47',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>
                    {del.type}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`https://wa.me/55${del.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${del.name}! Seu pedido na M_I Store já está pronto!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleDeliverOrder(del.id, del.name)}
                  >
                    <Check size={14} /> Entregue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* MODAL 4: Clientes com Pagamento Pendente / Fiados (Card 4) */}
      <Modal
        isOpen={activeModal === 'pendentes'}
        onClose={() => setActiveModal(null)}
        title={`Clientes com Pagamento Pendente (${debtorsList.length})`}
        maxWidth="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.8125rem', color: '#7A7067', margin: 0 }}>
            Controle de saldo em aberto e fiado com link direto para lembrete educado no WhatsApp:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {debtorsList.map((debtor) => (
              <div
                key={debtor.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #F6E3E5',
                  background: '#FDF9F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#2A2426' }}>
                    {debtor.name} <span style={{ color: '#731A30', fontWeight: 600 }}>({debtor.order})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>
                    {debtor.phone} • Pedido em {debtor.date}
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#C03C54', marginTop: '2px' }}>
                    Saldo devedor: {debtor.due}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`https://wa.me/55${debtor.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${debtor.name}! Passando para lembrar do saldo de ${debtor.due} do seu pedido na M_I Store. Posso te enviar a chave Pix?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    <MessageCircle size={14} /> Cobrar WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setDebtorsList(prev => prev.filter(d => d.id !== debtor.id))
                      setPendentesCount(c => Math.max(0, c - 1))
                      if (onToast) onToast(`Pagamento de ${debtor.due} de ${debtor.name} recebido e quitado!`)
                    }}
                  >
                    <Check size={14} /> Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* MODAL 5: Detalhes da Compra da Semana (João Pessoa) */}
      <Modal
        isOpen={activeModal === 'compra_detalhes'}
        onClose={() => setActiveModal(null)}
        title="Planejamento da Viagem a João Pessoa (30/05/2025)"
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            background: '#FDF5F5',
            padding: '16px',
            borderRadius: '12px',
            alignItems: 'center'
          }}>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
              alt="João Pessoa"
              style={{ width: '130px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <span className="badge-pill-pink">Viagem Semanal Confirmada</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2A2426', marginTop: '4px' }}>
                Atacados de João Pessoa, PB
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#7A7067', margin: '2px 0 0 0' }}>
                Roteiro: Centro (Rua Maciel Pinheiro), Galeria Central e Moda Center.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#F8F5F2', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: '#7A7067' }}>Total a Comprar</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2A2426' }}>{comprasCount} peças</div>
            </div>
            <div style={{ padding: '12px', background: '#F8F5F2', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: '#7A7067' }}>Capital a Levar</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#731A30' }}>R$ 6.800,00</div>
            </div>
            <div style={{ padding: '12px', background: '#E7F6EC', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1D7A47' }}>Lucro Projetado</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D7A47' }}>R$ 7.600,00</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2A2426', marginBottom: '8px' }}>
              Principais Fornecedores a Visitar nesta Viagem:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#FDF9F7', borderRadius: '6px' }}>
                <span><strong>JP Calçados (Box 14)</strong> • Galeria Central</span>
                <span style={{ color: '#731A30', fontWeight: 700 }}>10 pares</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#FDF9F7', borderRadius: '6px' }}>
                <span><strong>Bella Atacado</strong> • Rua Maciel Pinheiro</span>
                <span style={{ color: '#731A30', fontWeight: 700 }}>8 bolsas</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#FDF9F7', borderRadius: '6px' }}>
                <span><strong>Moda Center JP</strong> • Bloco B</span>
                <span style={{ color: '#731A30', fontWeight: 700 }}>4 looks</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#FDF9F7', borderRadius: '6px' }}>
                <span><strong>Mix Importados</strong> • Box 08</span>
                <span style={{ color: '#731A30', fontWeight: 700 }}>2 bijuterias</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 6: Detalhe do Pedido Recente */}
      {selectedOrderForModal && (
        <Modal
          isOpen={activeModal === 'pedido_detalhe'}
          onClose={() => {
            setActiveModal(null)
            setSelectedOrderForModal(null)
          }}
          title={`Pedido ${selectedOrderForModal.code}`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header do Pedido */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '14px', borderBottom: '1px solid #ECE5DE' }}>
              <img
                src={selectedOrderForModal.photo}
                alt={selectedOrderForModal.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2A2426' }}>
                    {selectedOrderForModal.name}
                  </h3>
                  {selectedOrderForModal.statusType === 'success' ? (
                    <span className="badge-pill-green">{selectedOrderForModal.status}</span>
                  ) : (
                    <span className="badge-pill-pink" style={{ marginTop: 0 }}>
                      {selectedOrderForModal.status}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#7A7067' }}>
                  {selectedOrderForModal.phone} • Data: {selectedOrderForModal.date}/2025
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C827A', textTransform: 'uppercase' }}>
                Itens Encomendados:
              </span>
              <div style={{
                background: '#FDF5F5',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '6px',
                fontSize: '0.875rem',
                color: '#2A2426',
                fontWeight: 600
              }}>
                {selectedOrderForModal.itemsDesc}
              </div>
            </div>

            {/* Endereço */}
            <div style={{ fontSize: '0.8125rem', color: '#4A4240' }}>
              <strong>Local de Entrega:</strong> {selectedOrderForModal.address}
            </div>

            {/* Total e Ações */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid #ECE5DE'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#7A7067' }}>Valor Total</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#731A30' }}>
                  {selectedOrderForModal.value}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://wa.me/55${selectedOrderForModal.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selectedOrderForModal.name}! Aqui é Edvania da M_I Store referente ao seu pedido ${selectedOrderForModal.code}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>

                {selectedOrderForModal.status === 'Pagamento pendente' && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handlePayOrder(selectedOrderForModal.id, selectedOrderForModal.name)}
                  >
                    <Check size={15} /> Registrar Pagamento Pix
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 7: Calendário Mensal e Viagens */}
      <Modal
        isOpen={activeModal === 'calendario'}
        onClose={() => setActiveModal(null)}
        title="Calendário Operacional de Viagens (Maio/Junho 2025)"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.8125rem', color: '#7A7067', margin: 0 }}>
            As viagens a João Pessoa acontecem semanalmente às quintas-feiras com fechamento de pedidos até quarta-feira:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#FDF5F5',
              border: '2px solid #731A30',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#731A30', fontSize: '0.9375rem' }}>Quinta-feira, 30 de Maio de 2025</strong>
                <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>Próxima Viagem • 24 itens na lista</div>
              </div>
              <span className="badge-pill-pink">Confirmada (em 4 dias)</span>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid #ECE5DE',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: '#2A2426', fontSize: '0.9375rem' }}>Quinta-feira, 06 de Junho de 2025</strong>
                <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>Viagem Seguinte (Semana dos Namorados)</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8C827A' }}>Programada</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
