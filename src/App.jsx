import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { DashboardOverview } from './pages/dashboard/DashboardOverview'
import { VendasPage } from './pages/admin/VendasPage'
import { SolicitacoesPage } from './pages/admin/SolicitacoesPage'
import { CompraSemanaPage } from './pages/admin/CompraSemanaPage'
import { EntregasPage } from './pages/admin/EntregasPage'
import { ProdutosPage } from './pages/admin/ProdutosPage'
import { CategoriasPage } from './pages/admin/CategoriasPage'
import { ClientesPage } from './pages/admin/ClientesPage'
import { FornecedoresPage } from './pages/admin/FornecedoresPage'
import { FinanceiroPage } from './pages/admin/FinanceiroPage'
import { RelatoriosPage } from './pages/admin/RelatoriosPage'
import { ConfiguracoesPage } from './pages/admin/ConfiguracoesPage'
import { CatalogPage } from './pages/catalog/CatalogPage'
import { useApp } from './context/AppContext'
import { Sparkles, X, RotateCcw, Smartphone, Check } from 'lucide-react'

export function App() {
  const { resetToDefaultData } = useApp()
  const [activeTab, setActiveTab] = useState('inicio')
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleNavigate = (tabId) => {
    setActiveTab(tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchSelectOrder = (name) => {
    showToast(`Visualizando dados de "${name}"...`)
  }

  const handleNotificationAction = (title) => {
    showToast(`Notificação: ${title}`)
  }

  const handleResetDemo = () => {
    if (window.confirm('Deseja restaurar todos os dados de exemplo da demonstração para o estado inicial?')) {
      resetToDefaultData()
      showToast('Dados de demonstração restaurados com sucesso!')
      setActiveTab('inicio')
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar Fixa à Esquerda */}
      <Sidebar
        activeItem={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Área Principal */}
      <div className="main-content">
        {/* Barra Superior Funcional */}
        <Topbar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onToggleCatalog={() => setIsCatalogModalOpen(true)}
          onSelectOrder={handleSearchSelectOrder}
          onNotificationAction={handleNotificationAction}
        />

        {/* Faixa de Aviso da Demonstração com Botão de Reset */}
        <aside className="demo-notice" aria-label="Aviso sobre os dados do protótipo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <strong className="demo-notice-label">Demonstração M_I Store</strong>
            <span>
              Protótipo de alta fidelidade interativo. Navegue pelas 12 abas para conhecer todo o sistema.
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              color: '#731A30',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#FFF0F2',
              border: '1px solid #FAD1D6',
              cursor: 'pointer'
            }}
            title="Reiniciar os dados do protótipo para o estado inicial"
          >
            <RotateCcw size={12} />
            <span>Restaurar Dados</span>
          </button>
        </aside>

        {/* Navegação Reativa das 12 Abas */}
        <main>
          {activeTab === 'inicio' && (
            <DashboardOverview onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'vendas' && (
            <VendasPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'solicitacoes' && (
            <SolicitacoesPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'compra-semana' && (
            <CompraSemanaPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'entregas' && (
            <EntregasPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'produtos' && (
            <ProdutosPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'categorias' && (
            <CategoriasPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'clientes' && (
            <ClientesPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'fornecedores' && (
            <FornecedoresPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'financeiro' && (
            <FinanceiroPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'relatorios' && (
            <RelatoriosPage onToast={showToast} onNavigate={handleNavigate} />
          )}

          {activeTab === 'configuracoes' && (
            <ConfiguracoesPage onToast={showToast} onNavigate={handleNavigate} />
          )}
        </main>
      </div>

      {/* Modal Simulador Mobile do Catálogo da Cliente */}
      {isCatalogModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCatalogModalOpen(false)}>
          <div
            className="modal-content"
            style={{
              maxWidth: '430px',
              width: '100%',
              height: '92vh',
              borderRadius: '36px',
              border: '8px solid #231F20',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              backgroundColor: '#FAF8F5',
              padding: 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topbar do Celular Simulado */}
            <div style={{
              background: '#231F20',
              color: '#FFFFFF',
              padding: '6px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem'
            }}>
              <span>9:41</span>
              <div style={{
                width: '60px',
                height: '14px',
                backgroundColor: '#111',
                borderRadius: '10px'
              }} />
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                style={{ color: '#fff', opacity: 0.8 }}
                title="Fechar simulador do celular"
              >
                <X size={15} />
              </button>
            </div>

            {/* Conteúdo do Catálogo Mobile */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <CatalogPage />
            </div>
          </div>
        </div>
      )}

      {/* Toast informativo de ações */}
      {toastMessage && (
        <div className="soon-toast" role="status" aria-live="polite" aria-atomic="true">
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
