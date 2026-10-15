import React, { useState, useEffect } from 'react'
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
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { Modal } from '../../components/common/Modal'

export function DashboardOverview({ onToast, onNavigate }) {
  // Estado de Carregamento (Loading Skeleton)
  const [isLoading, setIsLoading] = useState(false)

  // 1. Estados Dinâmicos dos Contadores Operacionais
  const [solicitacoesCount, setSolicitacoesCount] = useState(8)
  const [comprasCount, setComprasCount] = useState(24)
  const [prontosCount, setProntosCount] = useState(12)
  const [pendentesCount, setPendentesCount] = useState(6)

  // 2. Estado do Seletor de Período Financeiro
  const [selectedPeriod, setSelectedPeriod] = useState('Este mês (Maio)')
  const [isPeriodOpen, setIsPeriodOpen] = useState(false)

  // 3. Controle de Modais Operacionais
  const [activeModal, setActiveModal] = useState(null)
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null)

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null)
        setSelectedOrderForModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Simular recarregamento com Skeleton
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (onToast) onToast('Painel operacional atualizado com sucesso!')
    }, 600)
  }

  // Dados Financeiros por Período
  const [financialData, setFinancialData] = useState({
    'Este mês (Maio)': {
      vendas: 12850,
      pedidos: '48 pedidos',
      recebido: 8420,
      aReceber: 4430,
      custo: 5200,
      lucro: 7650
    },
    'Mês anterior (Abril)': {
      vendas: 10900,
      pedidos: '42 pedidos',
      recebido: 10450,
      aReceber: 450,
      custo: 4360,
      lucro: 6540
    },
    'Últimos 90 dias': {
      vendas: 34200,
      pedidos: '128 pedidos',
      recebido: 29320,
      aReceber: 4880,
      custo: 13680,
      lucro: 20520
    }
  })

  const currentRaw = financialData[selectedPeriod] || financialData['Este mês (Maio)']
  const currentFin = {
    vendas: `R$ ${currentRaw.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    pedidos: currentRaw.pedidos,
    recebido: `R$ ${currentRaw.recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    recebidoPct: `${Math.round((currentRaw.recebido / currentRaw.vendas) * 100)}% do total`,
    aReceber: `R$ ${currentRaw.aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    aReceberPct: `${Math.round((currentRaw.aReceber / currentRaw.vendas) * 100)}% do total`,
    custo: `R$ ${currentRaw.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    custoPct: `${Math.round((currentRaw.custo / currentRaw.vendas) * 100)}% das vendas`,
    custoBarPct: Math.round((currentRaw.custo / currentRaw.vendas) * 100),
    lucro: `R$ ${currentRaw.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    lucroPct: `${Math.round((currentRaw.lucro / currentRaw.vendas) * 100)}% das vendas`,
    lucroBarPct: Math.round((currentRaw.lucro / currentRaw.vendas) * 100)
  }

  // Lista Dinâmica de Pedidos Recentes (sempre com foto circular e nome da cliente)
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
      address: 'Rua São José, Centro, Cuite de Mamanguape'
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
      address: 'Av. Brasil, 140, Cuite'
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
      address: 'Bairro Novo, Cuite de Mamanguape'
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
      address: 'Rua Bela Vista, Cuite'
    }
  ])

  // Lista de Solicitações para o Modal (com foto de cada cliente)
  const [solicitacoesList, setSolicitacoesList] = useState([
    { id: 101, name: 'Juliana Alves', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', phone: '(83) 98877-6655', product: 'Sandália Rasteira Trançada Dourada (Tam 37)', value: 'R$ 89,90' },
    { id: 102, name: 'Renata Castro', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', phone: '(83) 99611-2233', product: 'Bolsa Tiracolo Matelassê Preta', value: 'R$ 129,90' },
    { id: 103, name: 'Camila Duarte', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', phone: '(83) 99344-5566', product: 'Salto Bloco Nude Rosé (Tam 36)', value: 'R$ 139,90' },
    { id: 104, name: 'Letícia Barbosa', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', phone: '(83) 99811-7788', product: 'Vestido Midi Canelado Terracota (Tam M)', value: 'R$ 149,90' },
    { id: 105, name: 'Priscila Mendes', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', phone: '(83) 98722-3344', product: 'Rasteira Pérola Off-White (Tam 38)', value: 'R$ 79,90' },
    { id: 106, name: 'Sabrina Ferreira', photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80', phone: '(83) 99188-4455', product: 'Bolsa Baguete Caramelo', value: 'R$ 119,90' },
    { id: 107, name: 'Tatiana Ribeiro', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80', phone: '(83) 98833-2211', product: 'Mule Bico Fino Metalizada (Tam 37)', value: 'R$ 109,90' },
    { id: 108, name: 'Valéria Monteiro', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=120&q=80', phone: '(83) 99677-8899', product: 'Conjunto Colar + Argola Banhada', value: 'R$ 69,90' },
  ])

  // Itens para Compra na Viagem
  const [shoppingItems, setShoppingItems] = useState([
    { id: 1, supplier: 'JP Calçados (Box 14)', product: 'Rasteira Trançada Dourada', size: '37', qty: 3, client: 'Juliana Costa', clientPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', cost: 48, bought: false },
    { id: 2, supplier: 'JP Calçados (Box 14)', product: 'Salto Bloco Tiras Finas Nude', size: '36', qty: 2, client: 'Ana Beatriz', clientPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', cost: 72, bought: false },
    { id: 3, supplier: 'Bella Atacado (Rua Maciel Pinheiro)', product: 'Bolsa Tiracolo Matelassê', size: 'Único', qty: 2, client: 'Mariana Silva', clientPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', cost: 68, bought: false },
    { id: 4, supplier: 'Bella Atacado (Rua Maciel Pinheiro)', product: 'Bolsa Baguete Caramelo', size: 'Único', qty: 1, client: 'Sabrina F.', clientPhoto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80', cost: 60, bought: false },
    { id: 5, supplier: 'Moda Center JP', product: 'Vestido Midi Canelado', size: 'M', qty: 2, client: 'Carla Souza', clientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', cost: 75, bought: false },
    { id: 6, supplier: 'Mix Importados', product: 'Brincos Festa Dourados', size: 'Único', qty: 4, client: 'Carla Souza', clientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', cost: 22, bought: false }
  ])

  // Clientes com Fiado Pendente (com fotos)
  const [debtorsList, setDebtorsList] = useState([
    { id: 1, name: 'Ana Beatriz', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', phone: '(83) 99122-8877', order: '#MI-1042', due: 'R$ 410,00', numericDue: 410, date: '25/05' },
    { id: 2, name: 'Carla Souza', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', phone: '(83) 98711-4455', order: '#MI-1040', due: 'R$ 730,00', numericDue: 730, date: '25/05' },
    { id: 3, name: 'Patrícia Gomes', photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&q=80', phone: '(83) 99311-5522', order: '#MI-1035', due: 'R$ 520,00', numericDue: 520, date: '22/05' },
    { id: 4, name: 'Camila Rocha', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80', phone: '(83) 99877-3311', order: '#MI-1033', due: 'R$ 380,00', numericDue: 380, date: '20/05' },
    { id: 5, name: 'Vanessa Lima', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', phone: '(83) 98744-9988', order: '#MI-1030', due: 'R$ 890,00', numericDue: 890, date: '18/05' },
    { id: 6, name: 'Roberta Dias', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=120&q=80', phone: '(83) 99655-1100', order: '#MI-1028', due: 'R$ 1.500,00', numericDue: 1500, date: '15/05' },
  ])

  // Pedidos Prontos para Entrega (com fotos)
  const [readyDeliveries, setReadyDeliveries] = useState([
    { id: 1, name: 'Mariana Silva', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', phone: '(83) 99655-3344', order: '#MI-1045', type: 'Entrega em Domicílio', address: 'Av. Brasil, 140' },
    { id: 2, name: 'Juliana Costa', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', phone: '(83) 98877-1122', order: '#MI-1048', type: 'Retirada na Loja', address: 'Loja M_I Store' },
    { id: 3, name: 'Letícia Lima', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', phone: '(83) 99123-4567', order: '#MI-1039', type: 'Entrega em Domicílio', address: 'Rua Nova, 54' },
    { id: 4, name: 'Gisele Santos', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', phone: '(83) 99888-2211', order: '#MI-1037', type: 'Retirada na Loja', address: 'Loja M_I Store' },
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
          if (onToast) onToast(`Item "${item.product}" marcado como comprado!`)
        } else {
          setComprasCount(c => c + 1)
        }
        return { ...item, bought: nextState }
      }
      return item
    }))
  }

  const handlePayOrder = (orderId, clientName, amount = 0) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.name === clientName) {
        return { ...ord, status: 'Pago', statusType: 'success' }
      }
      return ord
    }))
    setPendentesCount(c => Math.max(0, c - 1))
    setDebtorsList(prev => prev.filter(d => d.name !== clientName))
    
    // Atualizar métricas financeiras em tempo real
    if (amount > 0) {
      setFinancialData(prev => ({
        ...prev,
        [selectedPeriod]: {
          ...prev[selectedPeriod],
          recebido: prev[selectedPeriod].recebido + amount,
          aReceber: Math.max(0, prev[selectedPeriod].aReceber - amount)
        }
      }))
    }

    setActiveModal(null)
    if (onToast) onToast(`Pagamento de ${clientName} quitado com sucesso!`)
  }

  const handleDeliverOrder = (deliveryId, clientName) => {
    setReadyDeliveries(prev => prev.filter(d => d.id !== deliveryId))
    setProntosCount(c => Math.max(0, c - 1))
    if (onToast) onToast(`Pedido de ${clientName} marcado como entregue!`)
  }

  // Render Skeleton Loading
  if (isLoading) {
    return (
      <div className="dashboard-page" aria-busy="true" aria-label="Carregando resumo operacional">
        <div className="dashboard-header" style={{ marginBottom: '16px' }}>
          <div>
            <div className="skeleton-box" style={{ width: '220px', height: '36px', marginBottom: '8px' }} />
            <div className="skeleton-box" style={{ width: '360px', height: '18px' }} />
          </div>
          <div className="skeleton-box" style={{ width: '240px', height: '38px' }} />
        </div>
        <div className="operational-cards-grid" style={{ marginBottom: '20px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton-box" style={{ height: '90px' }} />
          ))}
        </div>
        <div className="dashboard-grid-two-cols">
          <div className="skeleton-box" style={{ height: '320px' }} />
          <div className="skeleton-box" style={{ height: '320px' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page" role="region" aria-label="Painel de Controle Início">
      {/* 6. Cabeçalho do Dashboard */}
      <div className="dashboard-header">
        <div>
          <h1 className="greeting-title">Olá, Edvania!</h1>
          <p className="greeting-subtitle">
            Aqui está o resumo da sua loja. Acompanhe suas vendas, pedidos e próximas ações.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Botão sutil de Recarregar / Sincronizar */}
          <button
            type="button"
            onClick={handleRefresh}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.75rem', height: '38px' }}
            title="Atualizar dados do painel"
            aria-label="Atualizar dados do painel operacional"
          >
            <RefreshCw size={14} />
            <span>Atualizar</span>
          </button>

          {/* Card de Data Clicável (Abre Calendário de Viagens) */}
          <button
            type="button"
            className="date-badge"
            onClick={() => setActiveModal('calendario')}
            title="Ver calendário de viagens para João Pessoa"
            aria-label="Segunda-feira, 26 de Maio de 2025. Clique para ver calendário de viagens"
          >
            <Calendar size={16} color="#731A30" />
            <span>Segunda-feira, 26 de Maio de 2025</span>
          </button>
        </div>
      </div>

      {/* 7. Primeira Linha - 4 Cards Operacionais Funcionais */}
      <div className="operational-cards-grid" role="list" aria-label="Cards Operacionais de Ação Rápida">
        {/* Card 1: Solicitações */}
        <div
          role="listitem"
          tabIndex={0}
          className="op-card"
          onClick={() => setActiveModal('solicitacoes')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveModal('solicitacoes'); } }}
          title="Ver solicitações aguardando confirmação"
          aria-label={`${solicitacoesCount} solicitações aguardando confirmação. Clique para abrir`}
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap" aria-hidden="true">
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
          <ChevronRight size={18} className="op-card-arrow" aria-hidden="true" />
        </div>

        {/* Card 2: Itens para Comprar */}
        <div
          role="listitem"
          tabIndex={0}
          className="op-card"
          onClick={() => setActiveModal('compras')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveModal('compras'); } }}
          title="Ver checklist de compras para João Pessoa"
          aria-label={`${comprasCount} itens para comprar na próxima viagem. Clique para abrir`}
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap" aria-hidden="true">
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
          <ChevronRight size={18} className="op-card-arrow" aria-hidden="true" />
        </div>

        {/* Card 3: Pedidos Prontos */}
        <div
          role="listitem"
          tabIndex={0}
          className="op-card"
          onClick={() => setActiveModal('prontos')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveModal('prontos'); } }}
          title="Ver entregas e retiradas prontas"
          aria-label={`${prontosCount} pedidos prontos para entrega. Clique para abrir`}
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap" aria-hidden="true">
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
          <ChevronRight size={18} className="op-card-arrow" aria-hidden="true" />
        </div>

        {/* Card 4: Clientes Pendentes */}
        <div
          role="listitem"
          tabIndex={0}
          className="op-card"
          onClick={() => setActiveModal('pendentes')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveModal('pendentes'); } }}
          title="Ver clientes com saldo ou fiado a receber"
          aria-label={`${pendentesCount} clientes com pagamento pendente. Clique para abrir`}
        >
          <div className="op-card-left">
            <div className="op-card-icon-wrap" aria-hidden="true">
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
          <ChevronRight size={18} className="op-card-arrow" aria-hidden="true" />
        </div>
      </div>

      {/* Segunda Linha: Compra da Semana + Financeiro */}
      <div className="dashboard-grid-two-cols">
        {/* 8. Bloco - Compra da Semana */}
        <div className="dash-card">
          <div>
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <div className="dash-card-icon-pill" aria-hidden="true">
                  <ShoppingBag size={18} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="dash-card-title" style={{ fontSize: '1.05rem', margin: 0 }}>Compra da Semana</h2>
                  <p className="dash-card-subtitle">Próxima viagem para João Pessoa</p>
                </div>
              </div>

              <button
                type="button"
                className="dash-card-link"
                onClick={() => setActiveModal('compra_detalhes')}
                aria-label="Ver detalhes da viagem para João Pessoa"
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
              title="Clique para ver o roteiro de fornecedores em João Pessoa"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveModal('compra_detalhes'); }}
              role="button"
              aria-label="Banner da viagem de 30 de Maio de 2025 para João Pessoa. Em 4 dias"
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                alt="Praia de Tambaú, João Pessoa"
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
                <FileText size={18} className="trip-stat-icon" aria-hidden="true" />
                <div>
                  <div className="trip-stat-label">Total de itens</div>
                  <div className="trip-stat-value">{comprasCount}</div>
                </div>
              </div>

              <div className="trip-stat-divider" aria-hidden="true" />

              <div className="trip-stat-col">
                <Share2 size={18} className="trip-stat-icon" aria-hidden="true" />
                <div>
                  <div className="trip-stat-label">Fornecedores</div>
                  <div className="trip-stat-value">8</div>
                </div>
              </div>

              <div className="trip-stat-divider" aria-hidden="true" />

              <div className="trip-stat-col">
                <DollarSign size={18} className="trip-stat-icon" aria-hidden="true" />
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
              <Tag size={16} color="#731A30" aria-hidden="true" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Valor de venda total</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>R$ 14.400,00</div>
              </div>
            </div>

            <div className="trip-bottom-item" style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} color="#731A30" aria-hidden="true" />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Lucro projetado</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-wine-dark)' }}>R$ 7.600,00</span>
                <span className="badge-pill-green">+ 112%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Bloco - Financeiro Funcional com Troca de Período */}
        <div className="dash-card">
          <div>
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <div className="dash-card-icon-pill" aria-hidden="true">
                  <BarChart2 size={18} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="dash-card-title" style={{ fontSize: '1.05rem', margin: 0 }}>Financeiro</h2>
                  <p className="dash-card-subtitle">Resumo das vendas e valores</p>
                </div>
              </div>

              {/* Seletor de Período Funcional */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="period-dropdown"
                  onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={isPeriodOpen}
                  aria-label={`Período financeiro: ${selectedPeriod}. Clique para alterar`}
                >
                  <span>{selectedPeriod}</span>
                  <ChevronDown size={14} color="#8C827A" />
                </button>

                {isPeriodOpen && (
                  <div className="dropdown-menu-floating" style={{ width: '180px' }} role="listbox">
                    {Object.keys(financialData).map((periodKey) => (
                      <button
                        key={periodKey}
                        type="button"
                        role="option"
                        aria-selected={selectedPeriod === periodKey}
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
                          if (onToast) onToast(`Dados financeiros atualizados: ${periodKey}`)
                        }}
                      >
                        {periodKey}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Linha 1: 3 Colunas de Métricas */}
            <div className="fin-metrics-row-1">
              <div className="fin-metric-col">
                <span className="fin-metric-label">Vendas confirmadas</span>
                <div className="fin-metric-value">{currentFin.vendas}</div>
                <div className="fin-metric-sub">{currentFin.pedidos}</div>
              </div>

              <div className="trip-stat-divider" aria-hidden="true" />

              <div className="fin-metric-col">
                <span className="fin-metric-label">Recebido</span>
                <div className="fin-metric-value">{currentFin.recebido}</div>
                <div className="fin-metric-sub" style={{ color: 'var(--color-green-text)', fontWeight: 600 }}>
                  {currentFin.recebidoPct}
                </div>
              </div>

              <div className="trip-stat-divider" aria-hidden="true" />

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
            <div className="distribution-bar" role="progressbar" aria-valuenow={currentFin.lucroBarPct} aria-valuemin={0} aria-valuemax={100}>
              <div className="dist-bar-wine" style={{ width: `${currentFin.custoBarPct}%`, transition: 'width 0.4s ease' }} />
              <div className="dist-bar-pink" style={{ width: `${currentFin.lucroBarPct}%`, transition: 'width 0.4s ease' }} />
            </div>

            {/* Legenda Abaixo da Barra */}
            <div className="dist-legend-row">
              <div className="dist-legend-item">
                <span className="legend-dot-wine" aria-hidden="true" />
                <span>{currentFin.custo} Custo dos produtos ({currentFin.custoBarPct}%)</span>
              </div>
              <div className="dist-legend-item">
                <span className="legend-dot-pink" aria-hidden="true" />
                <span>{currentFin.lucro} Lucro previsto ({currentFin.lucroBarPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terceira Linha: Próximas Ações + Pedidos Recentes */}
      <div className="dashboard-grid-two-cols">
        {/* 10. Bloco - Próximas Ações Interativas */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <div className="dash-card-icon-pill" aria-hidden="true">
                <CheckCircle2 size={18} strokeWidth={2} />
              </div>
              <div>
                <h2 className="dash-card-title" style={{ fontSize: '1.05rem', margin: 0 }}>Próximas ações</h2>
                <p className="dash-card-subtitle">O que precisa da sua atenção hoje</p>
              </div>
            </div>

            <button
              type="button"
              className="dash-card-link"
              onClick={() => setActiveModal('solicitacoes')}
              aria-label="Ver todas as próximas ações"
            >
              <span>Ver todas</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="action-lines-list" role="list">
            {/* Ação 1 */}
            <div
              role="listitem"
              tabIndex={0}
              className="action-line-item"
              onClick={() => setActiveModal('solicitacoes')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveModal('solicitacoes'); }}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap" aria-hidden="true">
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
              role="listitem"
              tabIndex={0}
              className="action-line-item"
              onClick={() => setActiveModal('compras')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveModal('compras'); }}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap" aria-hidden="true">
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
              role="listitem"
              tabIndex={0}
              className="action-line-item"
              onClick={() => setActiveModal('prontos')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveModal('prontos'); }}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap" aria-hidden="true">
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
              role="listitem"
              tabIndex={0}
              className="action-line-item"
              onClick={() => setActiveModal('pendentes')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveModal('pendentes'); }}
            >
              <div className="action-line-left">
                <div className="action-icon-wrap" aria-hidden="true">
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

        {/* 11. Bloco - Pedidos Recentes Interativo */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <div className="dash-card-icon-pill" aria-hidden="true">
                <ShoppingBag size={18} strokeWidth={2} />
              </div>
              <div>
                <h2 className="dash-card-title" style={{ fontSize: '1.05rem', margin: 0 }}>Pedidos recentes</h2>
                <p className="dash-card-subtitle">Últimos pedidos confirmados</p>
              </div>
            </div>

            <button
              type="button"
              className="dash-card-link"
              onClick={() => {
                if (onToast) onToast(`Visualizando todos os ${orders.length} pedidos recentes cadastrados.`)
              }}
              aria-label="Ver todos os pedidos recentes"
            >
              <span>Ver todos</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Tabela Desktop de Pedidos Recentes */}
          <div className="recent-orders-table-wrap">
            <table className="recent-orders-table" aria-label="Tabela de Pedidos Recentes">
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col" style={{ textAlign: 'center' }}>Itens</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    tabIndex={0}
                    onClick={() => {
                      setSelectedOrderForModal(order)
                      setActiveModal('pedido_detalhe')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedOrderForModal(order)
                        setActiveModal('pedido_detalhe')
                      }
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

          {/* Cards Mobile de Pedidos Recentes (evita overflow horizontal em 390px) */}
          <div className="mobile-order-cards" role="list" aria-label="Lista móvel de pedidos recentes">
            {orders.map((order) => (
              <div
                key={order.id}
                role="listitem"
                tabIndex={0}
                className="mobile-order-card"
                onClick={() => {
                  setSelectedOrderForModal(order)
                  setActiveModal('pedido_detalhe')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedOrderForModal(order)
                    setActiveModal('pedido_detalhe')
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="client-cell">
                    <img src={order.photo} alt={order.name} className="client-avatar" />
                    <div>
                      <div className="client-name">{order.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{order.code} • {order.date}</div>
                    </div>
                  </div>
                  {order.statusType === 'success' ? (
                    <span className="badge-pill-green">{order.status}</span>
                  ) : (
                    <span className="badge-pill-pink" style={{ marginTop: 0 }}>{order.status}</span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F6F1EC' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.itemsCount} item(ns)</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{order.value}</strong>
                </div>
              </div>
            ))}
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
            Clientes que escolheram modelos no catálogo online. Ao confirmar, o item entra automaticamente na lista da próxima viagem!
          </p>

          {solicitacoesList.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <CheckCircle2 size={24} />
              </div>
              <div className="empty-state-title">Tudo em dia!</div>
              <div className="empty-state-desc">
                Todas as solicitações de clientes foram confirmadas e direcionadas para as compras.
              </div>
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
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={sol.photo}
                      alt={sol.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ECE5DE' }}
                    />
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
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
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
                      title="Confirmar este pedido e enviar para a Compra da Semana"
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
        title={`Lista de Compras em João Pessoa (${comprasCount} itens)`}
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: '#FDF5F5',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #FAD1D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#7A7067' }}>Próxima Viagem</span>
              <div style={{ fontWeight: 800, color: '#731A30' }}>Quinta-feira, 30 de Maio de 2025</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#7A7067' }}>Custo Previsto</span>
              <div style={{ fontWeight: 800, color: '#2A2426' }}>R$ 6.800,00</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {shoppingItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #ECE5DE',
                  background: item.bought ? '#F5FDF7' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  opacity: item.bought ? 0.75 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => handleToggleBoughtItem(item.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#731A30' }}
                  />
                  {item.clientPhoto && (
                    <img
                      src={item.clientPhoto}
                      alt={item.client}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: item.bought ? '#1D7A47' : '#2A2426', textDecoration: item.bought ? 'line-through' : 'none' }}>
                      {item.product} (Tam {item.size}) • {item.qty} un
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>
                      <strong>Fornecedor:</strong> {item.supplier} | <strong>Cliente:</strong> {item.client}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#731A30', fontSize: '0.875rem' }}>
                    R$ {(item.cost * item.qty).toFixed(2).replace('.', ',')}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: item.bought ? '#1D7A47' : '#8C827A' }}>
                    {item.bought ? '✓ Comprado' : 'A comprar'}
                  </span>
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
            Pacotes separados na loja aguardando entrega em domicílio ou retirada pelas clientes:
          </p>

          {readyDeliveries.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <Truck size={24} />
              </div>
              <div className="empty-state-title">Todas as entregas concluídas!</div>
              <div className="empty-state-desc">
                Nenhum pacote pendente para entrega ou retirada no momento.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {readyDeliveries.map((del) => (
                <div
                  key={del.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ECE5DE',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={del.photo}
                      alt={del.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2A2426' }}>
                        {del.name} <span style={{ fontSize: '0.75rem', color: '#731A30' }}>({del.order})</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7A7067', marginTop: '2px' }}>
                        <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {del.type} • {del.address}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <a
                      href={`https://wa.me/55${del.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${del.name}! Aqui é Edvania da M_I Store. Seu pedido ${del.order} está pronto!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                      title="Avisar cliente pelo WhatsApp"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleDeliverOrder(del.id, del.name)}
                    >
                      <Check size={14} /> Concluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 4: Clientes com Pagamento Pendente / Fiado (Card 4) */}
      <Modal
        isOpen={activeModal === 'pendentes'}
        onClose={() => setActiveModal(null)}
        title={`Clientes com Pagamento Pendente (${debtorsList.length})`}
        maxWidth="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '0.8125rem', color: '#7A7067', margin: 0 }}>
            Clientes com saldo devedor ou compras fiadas em aberto. Você pode enviar lembrete amigável ou dar baixa no recebimento:
          </p>

          {debtorsList.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <CheckCircle2 size={24} />
              </div>
              <div className="empty-state-title">Nenhum fiado pendente!</div>
              <div className="empty-state-desc">
                Todos os clientes estão com seus pagamentos 100% quitados no período.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {debtorsList.map((debtor) => (
                <div
                  key={debtor.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ECE5DE',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={debtor.photo}
                      alt={debtor.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2A2426' }}>
                        {debtor.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>
                        Pedido {debtor.order} • Data: {debtor.date}/2025
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#C03C54', marginTop: '2px' }}>
                        Saldo devedor: {debtor.due}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <a
                      href={`https://wa.me/55${debtor.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${debtor.name}! Aqui é Edvania da M_I Store. Passando com muito carinho para lembrar do seu saldo de ${debtor.due} referente ao pedido ${debtor.order}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                      title="Enviar lembrete amigável no WhatsApp"
                    >
                      <MessageCircle size={14} /> Cobrar
                    </a>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handlePayOrder(debtor.id, debtor.name, debtor.numericDue)}
                      title="Dar baixa no pagamento e quitar saldo"
                    >
                      <Check size={14} /> Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 5: Detalhes da Compra da Semana em João Pessoa */}
      <Modal
        isOpen={activeModal === 'compra_detalhes'}
        onClose={() => setActiveModal(null)}
        title="Roteiro e Planejamento da Viagem a João Pessoa"
        maxWidth="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#FDF5F5',
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid #FAD1D6',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <Calendar size={24} color="#731A30" />
            <div>
              <strong style={{ color: '#731A30', fontSize: '1rem' }}>Quinta-feira, 30 de Maio de 2025</strong>
              <div style={{ fontSize: '0.8125rem', color: '#7A7067' }}>
                Saída de Cuité de Mamanguape às 05:30 • Retorno previsto às 16:00
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #ECE5DE' }}>
              <span style={{ fontSize: '0.75rem', color: '#7A7067' }}>Total a Comprar</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#731A30' }}>{comprasCount} peças</div>
            </div>
            <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #ECE5DE' }}>
              <span style={{ fontSize: '0.75rem', color: '#7A7067' }}>Dinheiro Previsto</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2A2426' }}>R$ 6.800,00</div>
            </div>
            <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #ECE5DE' }}>
              <span style={{ fontSize: '0.75rem', color: '#7A7067' }}>Lucro da Viagem</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D7A47' }}>R$ 7.600,00</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2A2426', marginBottom: '8px' }}>
              Principais Fornecedores a Visitar nesta Viagem:
            </h3>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
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
                    onClick={() => handlePayOrder(selectedOrderForModal.id, selectedOrderForModal.name, selectedOrderForModal.numericValue)}
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
