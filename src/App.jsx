import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { DashboardOverview } from './pages/dashboard/DashboardOverview'
import { CatalogPage } from './pages/catalog/CatalogPage'
import { useApp } from './context/AppContext'
import { Sparkles, X, RotateCcw, ArrowLeft, Clock, CheckCircle } from 'lucide-react'

// Mapeamento dos nomes amigáveis das 10 abas
const TAB_LABELS = {
  inicio: 'Início',
  pedidos: 'Pedidos',
  'compra-semana': 'Compra da Semana',
  entregas: 'Entregas',
  produtos: 'Produtos',
  clientes: 'Clientes',
  fornecedores: 'Fornecedores',
  financeiro: 'Financeiro',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações'
}

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
    if (tabId !== 'inicio') {
      showToast(`Aba "${TAB_LABELS[tabId] || tabId}" programada para a próxima etapa.`)
    }
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
      {/* Sidebar Fixa à Esquerda (10 Abas Canônicas) */}
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
            <strong className="demo-notice-label">M_I Store Gestão</strong>
            <span>
              Desenvolvimento rigoroso por etapas: <strong>Aba Início 100% concluída e operacional</strong>.
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
            <span>Restaurar Demonstração</span>
          </button>
        </aside>

        {/* Conteúdo Principal: Aba 1 (Início) Ativa */}
        <main>
          {activeTab === 'inicio' ? (
            <DashboardOverview onToast={showToast} onNavigate={handleNavigate} />
          ) : (
            <div className="page-container" style={{ paddingTop: '20px' }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #ECE5DE',
                padding: '40px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(42,36,38,0.04)'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#FDF5F5',
                  color: '#731A30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={28} />
                </div>

                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF3DC', color: '#80530E', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>
                    Etapa Seguinte no Fluxo
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#731A30', margin: '4px 0' }}>
                    Aba {TAB_LABELS[activeTab] || activeTab}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#7A7067', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
                    O sistema da M_I Store está sendo desenvolvido estritamente <strong>uma aba por vez</strong> com altíssima qualidade visual, funcionalidade real e responsividade completa. A aba <strong>Início</strong> já está 100% pronta.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveTab('inicio')}
                  style={{ marginTop: '8px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Voltar para o Início</span>
                </button>
              </div>
            </div>
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
