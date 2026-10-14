import React from 'react'
import { useApp } from '../../context/AppContext'
import { ShoppingBag, LayoutDashboard, RotateCcw, Sparkles } from 'lucide-react'

export function ViewSwitcher() {
  const { currentView, navigateTo, resetToDefaultData, requests, currentTrip } = useApp()

  const isCatalog = currentView === 'catalog'
  const pendingRequestsCount = requests.filter(r => r.status === 'new').length
  const tripItemsCount = currentTrip?.items?.length || 0

  return (
    <div className="demo-switch-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#e8cbb5', fontSize: '0.8125rem' }}>
          <Sparkles size={14} style={{ color: '#d9a74a' }} />
          <span>M_I Store</span>
        </span>
        <span style={{ color: '#7a7066', fontSize: '0.75rem' }}>| Protótipo de Alta Fidelidade</span>
      </div>

      <div className="demo-switch-pills">
        <button
          type="button"
          className={`demo-switch-btn ${isCatalog ? 'active' : ''}`}
          onClick={() => navigateTo('catalog')}
          title="Ver o catálogo público como um cliente"
        >
          <ShoppingBag size={13} />
          <span>Catálogo Público</span>
        </button>

        <button
          type="button"
          className={`demo-switch-btn ${!isCatalog ? 'active' : ''}`}
          onClick={() => navigateTo('admin-dashboard')}
          title="Acessar o painel administrativo da Edvania"
        >
          <LayoutDashboard size={13} />
          <span>Painel Edvania</span>
          {pendingRequestsCount > 0 && (
            <span style={{
              background: '#b92525',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '999px',
              marginLeft: '2px'
            }}>
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      <button
        type="button"
        className="demo-reset-btn"
        onClick={() => {
          if (window.confirm('Deseja restaurar todos os dados iniciais do protótipo (pedidos, produtos, fornecedores e clientes)?')) {
            resetToDefaultData()
          }
        }}
        title="Restaurar dados originais de exemplo"
      >
        <RotateCcw size={12} />
        <span>Restaurar Mocks</span>
      </button>
    </div>
  )
}
