import React from 'react'
import { Logo } from '../brand/Logo'
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Tag,
  Users,
  Store,
  CreditCard,
  BarChart2,
  Settings
} from 'lucide-react'

export function Sidebar({ activeItem = 'inicio', onNavigate }) {
  // 10 Abas Canônicas Enxutas da M_I Store
  const menuGroup1 = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    { id: 'compra-semana', label: 'Compra da Semana', icon: ShoppingCart },
    { id: 'entregas', label: 'Entregas', icon: Truck },
  ]

  const menuGroup2 = [
    { id: 'produtos', label: 'Produtos', icon: Tag },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'fornecedores', label: 'Fornecedores', icon: Store },
  ]

  const menuGroup3 = [
    { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart2 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  const handleItemClick = (item) => {
    if (onNavigate) {
      onNavigate(item.id)
    }
  }

  return (
    <aside className="sidebar" aria-label="Menu Principal">
      <div>
        {/* Logo M_I Store */}
        <div className="sidebar-brand">
          <Logo />
        </div>

        {/* Menu de Navegação */}
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {menuGroup1.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeItem

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleItemClick(item)}
              >
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.9} color={isActive ? '#ffffff' : '#731A30'} />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="sidebar-divider" />

          {menuGroup2.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeItem

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleItemClick(item)}
              >
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.9} color={isActive ? '#ffffff' : '#731A30'} />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="sidebar-divider" />

          {menuGroup3.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeItem

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleItemClick(item)}
              >
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.9} color={isActive ? '#ffffff' : '#731A30'} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Frase Decorativa Inferior */}
      <div className="sidebar-footer-quote">
        <span className="sidebar-quote-text">
          Mais<br />
          que moda,<br />
          conexões reais. ✨
        </span>
      </div>
    </aside>
  )
}
