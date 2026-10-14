import React from 'react'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Luggage,
  PackageCheck,
  Building2,
  Users,
  Wallet,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles
} from 'lucide-react'

export function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const { currentView, navigateTo, requests, currentTrip, customers, setIsAdminLoggedIn } = useApp()

  const pendingRequests = requests.filter(r => r.status === 'new').length
  const shoppingItemsCount = currentTrip?.items?.filter(i => i.status === 'pending').length || 0
  const customersWithDebt = customers.filter(c => c.currentDebt > 0).length

  const navItems = [
    { id: 'admin-dashboard', label: 'Hoje (Dashboard)', icon: LayoutDashboard },
    { id: 'admin-solicitacoes', label: 'Solicitações', icon: Inbox, badge: pendingRequests > 0 ? pendingRequests : null, badgeColor: '#b92525' },
    { id: 'admin-vendas', label: 'Vendas', icon: ShoppingBag },
    { id: 'admin-compra-semana', label: 'Compra da Semana', icon: Luggage, highlight: true, badge: shoppingItemsCount > 0 ? `${shoppingItemsCount} itens` : null, badgeColor: '#c2904c' },
    { id: 'admin-produtos', label: 'Produtos (Catálogo)', icon: PackageCheck },
    { id: 'admin-fornecedores', label: 'Fornecedores JP', icon: Building2 },
    { id: 'admin-clientes', label: 'Clientes', icon: Users },
    { id: 'admin-a-receber', label: 'A Receber & Fiados', icon: Wallet, badge: customersWithDebt > 0 ? customersWithDebt : null, badgeColor: '#b35e16' },
    { id: 'admin-entregas', label: 'Entregas & Retiradas', icon: Truck },
    { id: 'admin-financeiro', label: 'Financeiro & Despesas', icon: DollarSign },
    { id: 'admin-relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'admin-configuracoes', label: 'Configurações', icon: Settings }
  ]

  const handleNav = (viewId) => {
    navigateTo(viewId)
    if (onCloseMobile) onCloseMobile()
  }

  const sidebarContent = (
    <div style={{
      width: '260px',
      height: '100%',
      backgroundColor: '#1b1819',
      color: '#e5ded6',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #2d2829'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 20px 16px 20px',
        borderBottom: '1px solid #2d2829',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #85334c 0%, #aa4b68 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={16} />
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              M_I Store
            </span>
          </div>
          <span style={{ fontSize: '0.6875rem', color: '#9d9185', marginTop: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Gestão & Viagens JP
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        {navItems.map(item => {
          const isActive = currentView === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : item.highlight ? '#e0b27b' : '#b8aca0',
                background: isActive
                  ? '#85334c'
                  : item.highlight
                  ? 'rgba(200, 157, 92, 0.12)'
                  : 'transparent',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = item.highlight ? 'rgba(200, 157, 92, 0.12)' : 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} style={{ color: isActive ? '#ffffff' : item.highlight ? '#d9a74a' : '#8e8276' }} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  background: item.badgeColor || '#444',
                  color: '#ffffff'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer Profile & Quick Links */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #2d2829',
        backgroundColor: '#161415'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '999px',
            background: '#85334c',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            E
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Edvania
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#91867b' }}>
              Proprietária • M_I Store
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => navigateTo('catalog')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#d1c7bc',
              background: 'rgba(255, 255, 255, 0.08)',
              transition: 'background 0.15s ease'
            }}
          >
            <ExternalLink size={12} />
            <span>Ver Loja</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAdminLoggedIn(false)
              navigateTo('admin-login')
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#d17272',
              background: 'rgba(209, 114, 114, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Sair do Painel"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixa lateral) */}
      <aside className="admin-sidebar-desktop" style={{
        display: 'none',
        flexShrink: 0,
        height: 'calc(100vh - 37px)', // Desconta barra switcher
        position: 'sticky',
        top: '37px',
        zIndex: 50
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 1100,
            display: 'flex'
          }}
          onClick={onCloseMobile}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ height: '100%', animation: 'slideLeft 0.25s ease' }}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
