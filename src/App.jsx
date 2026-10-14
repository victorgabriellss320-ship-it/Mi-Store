import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { DashboardOverview } from './pages/dashboard/DashboardOverview'
import { Sparkles, X } from 'lucide-react'

export function App() {
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleSelectSidebarSoon = (label) => {
    showToast(`Aba "${label}" estará disponível na próxima etapa. Foco atual: Início / Dashboard.`)
  }

  const handleSearchSelectOrder = (name) => {
    showToast(`Buscando dados de "${name}"...`)
  }

  const handleNotificationAction = (title) => {
    showToast(`Notificação: ${title}`)
  }

  return (
    <div className="app-container">
      {/* Sidebar Fixa à Esquerda */}
      <Sidebar
        activeItem="inicio"
        onSelectSoon={handleSelectSidebarSoon}
      />

      {/* Área Principal */}
      <div className="main-content">
        {/* Barra Superior Funcional */}
        <Topbar
          onSelectOrder={handleSearchSelectOrder}
          onNotificationAction={handleNotificationAction}
        />

        {/* ÚNICA ABA FUNCIONAL: Início / Dashboard Completo */}
        <main>
          <DashboardOverview onToast={showToast} />
        </main>
      </div>

      {/* Toast informativo de ações */}
      {toastMessage && (
        <div className="soon-toast">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ color: '#fff', opacity: 0.8, marginLeft: '6px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default App
