import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Modal } from '../../components/common/Modal'
import {
  Settings,
  Store,
  Wallet,
  Truck,
  RotateCcw,
  Save,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  HelpCircle,
  Sparkles,
  AlertTriangle
} from 'lucide-react'

export function ConfiguracoesPage({ onToast, onNavigate }) {
  const { settings, updateSettings, resetToDefaultData } = useApp()

  // 1. Dados da Loja
  const [storeName, setStoreName] = useState(settings?.store?.name || 'M_I Store')
  const [tagline, setTagline] = useState(settings?.store?.tagline || 'Moda Feminina & Encomendas Especiais')
  const [ownerName, setOwnerName] = useState(settings?.store?.ownerName || 'Edvania')
  const [whatsapp, setWhatsapp] = useState(settings?.store?.whatsapp || '83991238844')
  const [instagram, setInstagram] = useState(settings?.store?.instagram || '@m_i_store244')
  const [city, setCity] = useState(settings?.store?.city || 'Cuité de Mamanguape - PB')
  const [defaultOrderMsg, setDefaultOrderMsg] = useState(settings?.store?.defaultOrderMessage || 'Olá Edvania! Quero fazer uma encomenda na M_I Store.')

  // 2. Entrega
  const [deliveryFee, setDeliveryFee] = useState(String(settings?.delivery?.defaultDeliveryFee ?? 5.00))
  const [enableDelivery, setEnableDelivery] = useState(settings?.delivery?.enableDelivery !== false)
  const [enablePickup, setEnablePickup] = useState(settings?.delivery?.enablePickup !== false)

  // 3. Viagem Semanal
  const [tripDay, setTripDay] = useState(settings?.shoppingTrip?.defaultDayOfWeek || 'Quinta-feira')
  const [groupBySupplier, setGroupBySupplier] = useState(settings?.shoppingTrip?.groupBySupplier !== false)
  const [alertMissing, setAlertMissing] = useState(settings?.shoppingTrip?.alertMissingItems !== false)

  // 4. Financeiro
  const [enableFiado, setEnableFiado] = useState(settings?.financial?.enableFiado !== false)
  const [enablePartialPay, setEnablePartialPay] = useState(settings?.financial?.enablePartialPayments !== false)

  // 5. Modal de Confirmação de Reset
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  // Salvar configurações
  const handleSaveAll = (e) => {
    e.preventDefault()

    const numFee = parseFloat(deliveryFee.replace(',', '.')) || 0

    updateSettings('store', {
      name: storeName.trim(),
      tagline: tagline.trim(),
      ownerName: ownerName.trim(),
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim(),
      city: city.trim(),
      defaultOrderMessage: defaultOrderMsg.trim()
    })

    updateSettings('delivery', {
      defaultDeliveryFee: numFee,
      enableDelivery,
      enablePickup
    })

    updateSettings('shoppingTrip', {
      defaultDayOfWeek: tripDay,
      groupBySupplier,
      alertMissingItems: alertMissing
    })

    updateSettings('financial', {
      enableFiado,
      enablePartialPayments: enablePartialPay
    })

    if (onToast) onToast('Configurações da loja salvas com sucesso!')
  }

  // Executar reset
  const handleConfirmReset = () => {
    resetToDefaultData()
    setIsResetModalOpen(false)
    if (onToast) onToast('Dados da demonstração restaurados para o estado inicial!')
  }

  return (
    <div className="page-container" style={{ paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: '#FDF5F5',
              color: '#731A30',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Aba 10 · Preferências & Loja
            </span>
            <span style={{ fontSize: '0.8rem', color: '#887B7D' }}>• Controle operacional da M_I Store</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
            Configurações do Painel
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#685D60' }}>
            Ajuste informações públicas da loja, taxas de entrega e regras operacionais de viagem.
          </p>
        </div>

        {/* Botão de Salvar e Reset */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              color: '#731A30',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: '1px solid #FAD1D6',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            <span>Restaurar Demonstração</span>
          </button>

          <button
            onClick={handleSaveAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#731A30',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(115,26,48,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Save size={18} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAll} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Seção 1: Identidade da Loja */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '22px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                1. Dados Públicos da Loja & Contato
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
                Exibidos no catálogo online e nas mensagens de confirmação
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Nome da Loja
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Responsável / Lojista
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                WhatsApp Oficial de Vendas
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Instagram da Loja
              </label>
              <input
                type="text"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Cidade & Estado
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Slogan / Frase de Apresentação
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Mensagem Padrão de Abertura no WhatsApp
              </label>
              <input
                type="text"
                value={defaultOrderMsg}
                onChange={e => setDefaultOrderMsg(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Entregas & Taxas */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '22px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                2. Entregas & Retiradas na Loja
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
                Configure a taxa padrão para entrega em domicílio e modalidades aceitas
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Taxa Padrão de Entrega (R$)
              </label>
              <input
                type="text"
                value={deliveryFee}
                onChange={e => setDeliveryFee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1B6A43'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#887B7D', marginTop: '2px', display: 'block' }}>
                Cobrada automaticamente no catálogo para entregas em domicílio.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
                <input
                  type="checkbox"
                  checked={enableDelivery}
                  onChange={e => setEnableDelivery(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
                />
                <span>Habilitar Entrega em Domicílio (com taxa)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
                <input
                  type="checkbox"
                  checked={enablePickup}
                  onChange={e => setEnablePickup(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
                />
                <span>Habilitar Retirada na Loja (sem taxa / grátis)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Seção 3: Viagem de Compras Semanal */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '22px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFBF0', color: '#80530E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                3. Operação da Viagem a João Pessoa
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
                Definições da rota atacadista e conferência na compra da semana
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Dia Oficial da Viagem Semanal
              </label>
              <select
                value={tripDay}
                onChange={e => setTripDay(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <option value="Quinta-feira">Quinta-feira (Padrão)</option>
                <option value="Sexta-feira">Sexta-feira</option>
                <option value="Quarta-feira">Quarta-feira</option>
                <option value="Sábado">Sábado</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
                <input
                  type="checkbox"
                  checked={groupBySupplier}
                  onChange={e => setGroupBySupplier(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
                />
                <span>Agrupar lista de compras por Fornecedor / Box</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
                <input
                  type="checkbox"
                  checked={alertMissing}
                  onChange={e => setAlertMissing(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
                />
                <span>Alertar itens não encontrados para sugestão de substituto</span>
              </label>
            </div>
          </div>
        </div>

        {/* Seção 4: Regras de Fiado & Financeiro */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #ECE5DE',
          padding: '22px',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                4. Regras Financeiras & Fiado
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
                Flexibilidade de pagamentos e controle de saldo com clientes de confiança
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
              <input
                type="checkbox"
                checked={enableFiado}
                onChange={e => setEnableFiado(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
              />
              <span>Permitir anotação de venda com saldo a receber (Fiado de Confiança)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
              <input
                type="checkbox"
                checked={enablePartialPay}
                onChange={e => setEnablePartialPay(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
              />
              <span>Permitir entradas parciais e amortizações múltiplas por venda</span>
            </label>
          </div>
        </div>

        {/* Botão de Salvar no Rodapé */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              background: '#731A30',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(115,26,48,0.25)'
            }}
          >
            Salvar Configurações da Loja
          </button>
        </div>
      </form>

      {/* Modal: Confirmar Reset dos Dados */}
      {isResetModalOpen && (
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Restaurar Demonstração"
          maxWidth="440px"
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <AlertTriangle size={44} color="#D97706" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#2A2426', margin: '0 0 6px' }}>
              Deseja restaurar os dados de demonstração?
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#685D60', margin: 0, lineHeight: 1.4 }}>
              Isso recarregará as 20 peças iniciais, fornecedores, clientes e vendas de exemplo da M_I Store no seu navegador.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '18px' }}>
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #D8CFC8',
                background: '#FFFFFF',
                color: '#685D60',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirmReset}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#731A30',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(115,26,48,0.25)'
              }}
            >
              Sim, Restaurar Dados
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
