import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle2,
  Calendar,
  DollarSign,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  Store,
  MapPin,
  X
} from 'lucide-react'

export function Topbar({ onSelectOrder, onNotificationAction }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(1)
  const [copiedPix, setCopiedPix] = useState(false)

  const topbarRef = useRef(null)

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (topbarRef.current && !topbarRef.current.contains(e.target)) {
        setIsNotificationsOpen(false)
        setIsProfileOpen(false)
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const notifications = [
    {
      id: 1,
      title: 'Nova Solicitação no Catálogo',
      desc: 'Juliana Costa enviou pedido de Sandália Rasteira Trançada Dourada.',
      time: 'Há 5 minutos',
      unread: true,
      icon: ShoppingBag,
      iconBg: '#FDF5F5',
      iconColor: '#731A30'
    },
    {
      id: 2,
      title: 'Lembrete da Viagem a JP',
      desc: 'Faltam 4 dias para a viagem de compras em João Pessoa (30/05).',
      time: 'Há 2 horas',
      unread: false,
      icon: Calendar,
      iconBg: '#FDF7EB',
      iconColor: '#C0761A'
    },
    {
      id: 3,
      title: 'Pagamento Pix Recebido',
      desc: 'Fernanda Lima quitou R$ 299,00 referente ao Scarpin.',
      time: 'Ontem',
      unread: false,
      icon: DollarSign,
      iconBg: '#E7F6EC',
      iconColor: '#1D7A47'
    }
  ]

  const quickSearchItems = [
    { type: 'Cliente / Pedido', name: 'Juliana Costa', code: '#MI-1048', desc: '1 item • R$ 285,00 • Confirmado' },
    { type: 'Cliente / Pedido', name: 'Mariana Silva', code: '#MI-1045', desc: '3 itens • R$ 560,00 • Confirmado' },
    { type: 'Cliente / Pedido', name: 'Ana Beatriz', code: '#MI-1042', desc: '2 itens • R$ 410,00 • Pagamento pendente' },
    { type: 'Cliente / Pedido', name: 'Carla Souza', code: '#MI-1040', desc: '4 itens • R$ 730,00 • Pagamento pendente' },
    { type: 'Cliente / Pedido', name: 'Fernanda Lima', code: '#MI-1038', desc: '1 item • R$ 299,00 • Pago' },
    { type: 'Produto', name: 'Sandália Rasteira Trançada Dourada', code: 'Calçados', desc: 'R$ 89,90 • Custo R$ 48,00' },
    { type: 'Produto', name: 'Bolsa Tiracolo Matelassê', code: 'Bolsas', desc: 'R$ 129,90 • Custo R$ 68,00' },
    { type: 'Fornecedor', name: 'JP Calçados (Box 14)', code: 'João Pessoa', desc: '10 itens na lista' }
  ]

  const filteredSearchResults = searchQuery.trim()
    ? quickSearchItems.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleCopyPix = () => {
    navigator.clipboard.writeText('edvania.mistore@gmail.com')
    setCopiedPix(true)
    setTimeout(() => setCopiedPix(false), 2500)
  }

  const handleMarkAllRead = () => {
    setUnreadCount(0)
  }

  return (
    <header className="topbar" ref={topbarRef}>
      {/* Campo de Busca Global Interativo */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por pedidos, clientes, produtos..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsSearchOpen(true)
          }}
          onFocus={() => {
            if (searchQuery.trim()) setIsSearchOpen(true)
          }}
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setIsSearchOpen(false)
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#A59B93',
              padding: '2px'
            }}
          >
            <X size={15} />
          </button>
        )}

        {/* Dropdown de Resultados da Busca */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="search-dropdown">
            <div style={{ padding: '8px 14px', borderBottom: '1px solid #EFE8E1', fontSize: '0.72rem', color: '#8C827A', fontWeight: 700, textTransform: 'uppercase' }}>
              Resultados para "{searchQuery}" ({filteredSearchResults.length})
            </div>

            {filteredSearchResults.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8125rem', color: '#8C827A' }}>
                Nenhum resultado encontrado.
              </div>
            ) : (
              <div>
                {filteredSearchResults.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid #F6F1EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FDF5F5' }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                    onClick={() => {
                      setIsSearchOpen(false)
                      if (onSelectOrder) onSelectOrder(item.name)
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2A2426' }}>
                          {item.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#731A30', fontWeight: 600 }}>
                          {item.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7A7067', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#A39991', background: '#F8F5F2', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ações da Direita */}
      <div className="topbar-actions">
        {/* Ícone de Notificações com Dropdown Funcional */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="notification-btn"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen)
              setIsProfileOpen(false)
            }}
            aria-label="Notificações"
            title="Ver notificações"
          >
            <Bell size={20} color="#4A4240" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {isNotificationsOpen && (
            <div className="dropdown-menu-floating" style={{ width: '330px' }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #EFE8E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#2A2426' }}>Notificações</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    style={{ fontSize: '0.72rem', color: '#731A30', fontWeight: 700 }}
                  >
                    Marcar como lidas
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((notif) => {
                  const Icon = notif.icon
                  return (
                    <div
                      key={notif.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #F6F1EC',
                        display: 'flex',
                        gap: '12px',
                        backgroundColor: notif.unread && unreadCount > 0 ? '#FDF8F9' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FDF5F5' }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = notif.unread && unreadCount > 0 ? '#FDF8F9' : '#FFFFFF' }}
                      onClick={() => {
                        setIsNotificationsOpen(false)
                        if (onNotificationAction) onNotificationAction(notif.title)
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: notif.iconBg,
                        color: notif.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={15} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2A2426' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7A7067', marginTop: '2px', lineHeight: 1.3 }}>
                          {notif.desc}
                        </div>
                        <span style={{ fontSize: '0.6875rem', color: '#A39991', marginTop: '4px', display: 'block' }}>
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Perfil da Edvania com Dropdown Funcional */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen)
              setIsNotificationsOpen(false)
            }}
            title="Opções do perfil"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
              alt="Edvania"
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">Edvania</span>
              <span className="user-role">Administradora</span>
            </div>
            <ChevronDown size={16} color="#8C827A" style={{ marginLeft: '4px' }} />
          </div>

          {isProfileOpen && (
            <div className="dropdown-menu-floating" style={{ width: '280px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #EFE8E1' }}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Edvania"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#2A2426' }}>Edvania da Silva</div>
                  <div style={{ fontSize: '0.75rem', color: '#7A7067' }}>M_I Store Oficial</div>
                  <span style={{ fontSize: '0.6875rem', color: '#1D7A47', background: '#E7F6EC', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                    Loja Conectada
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px 0', fontSize: '0.8125rem', color: '#4A4240', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#731A30" />
                  <span>Cuité de Mamanguape, PB</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Store size={14} color="#731A30" />
                  <span>Viagens semanais p/ João Pessoa</span>
                </div>
              </div>

              {/* Chave Pix da Loja com Cópia Rápida */}
              <div style={{
                background: '#FDF5F5',
                border: '1px solid #F7E4E6',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: '#7A7067', display: 'block', fontSize: '0.6875rem' }}>Chave Pix para clientes:</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <strong style={{ color: '#731A30' }}>edvania.mistore@gmail.com</strong>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    style={{ color: '#731A30', padding: '2px', display: 'flex', alignItems: 'center' }}
                    title="Copiar Pix"
                  >
                    {copiedPix ? <Check size={14} color="#1D7A47" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
