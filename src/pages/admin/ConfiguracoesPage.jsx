import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/common/Button'
import {
  Settings,
  Store,
  Wallet,
  Truck,
  CreditCard,
  Save,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react'

export function ConfiguracoesPage() {
  const { settings, updateSettings, showToast } = useApp()

  // Local state initialized with context settings
  const [storeName, setStoreName] = useState(settings.store.name)
  const [storeCity, setStoreCity] = useState(settings.store.city)
  const [storeState, setStoreState] = useState(settings.store.state)
  const [storeWhatsapp, setStoreWhatsapp] = useState(settings.store.whatsapp)
  const [pixKey, setPixKey] = useState(settings.store.pixKey || 'edvania.mistore@gmail.com')

  // Fiado
  const [allowFiado, setAllowFiado] = useState(settings.fiado.allowFiado)
  const [defaultDueDays, setDefaultDueDays] = useState(settings.fiado.defaultDueDays)
  const [requireDownPayment, setRequireDownPayment] = useState(settings.fiado.requireDownPayment)
  const [minDownPaymentPercent, setMinDownPaymentPercent] = useState(settings.fiado.minDownPaymentPercent)

  // Entrega
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState(settings.delivery.defaultDeliveryFee)
  const [allowDelivery, setAllowDelivery] = useState(settings.delivery.allowDelivery)

  const handleSave = (e) => {
    e.preventDefault()

    updateSettings('store', {
      name: storeName,
      city: storeCity,
      state: storeState,
      whatsapp: storeWhatsapp,
      pixKey
    })

    updateSettings('fiado', {
      allowFiado,
      defaultDueDays: parseInt(defaultDueDays) || 15,
      requireDownPayment,
      minDownPaymentPercent: parseInt(minDownPaymentPercent) || 0
    })

    updateSettings('delivery', {
      allowDelivery,
      defaultDeliveryFee: parseFloat(defaultDeliveryFee) || 0
    })

    showToast('Configurações da M_I Store salvas com sucesso!')
  }

  return (
    <AdminLayout
      title="Configurações & Módulos da Loja"
      subtitle="Ative ou desative regras de fiado, prazos de vencimento, taxas de entrega e dados comerciais"
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
        {/* Bloco 1: Dados da Loja */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <Store size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Identificação & WhatsApp para Encomendas
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Nome da Marca</label>
              <input
                type="text"
                className="form-input"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp de Recebimento de Pedidos</label>
              <input
                type="text"
                className="form-input"
                value={storeWhatsapp}
                onChange={(e) => setStoreWhatsapp(e.target.value)}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Número para onde as clientes enviam a mensagem pronta do catálogo.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                className="form-input"
                value={storeCity}
                onChange={(e) => setStoreCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chave Pix Principal da Edvania</label>
              <input
                type="text"
                className="form-input"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Regras de Fiado & Contas a Receber */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <Wallet size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Regras de Fiado & Pagamento Parcelado
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Toggle Permitir Fiado */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: 'var(--bg-surface-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Permitir Vendas no Fiado</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Habilita o controle de saldo devedor e pagamentos parciais no painel da Edvania.
                </p>
              </div>

              <input
                type="checkbox"
                checked={allowFiado}
                onChange={(e) => setAllowFiado(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Prazo Padrão de Vencimento do Fiado (Dias)</label>
                <input
                  type="number"
                  className="form-input"
                  value={defaultDueDays}
                  onChange={(e) => setDefaultDueDays(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Exigir Entrada Mínima (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={minDownPaymentPercent}
                  onChange={(e) => setMinDownPaymentPercent(e.target.value)}
                  placeholder="0 para permitir fiado integral"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3: Regras de Entrega */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <Truck size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Taxas & Regras de Entrega
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Taxa Padrão de Entrega em Domicílio (R$)</label>
              <input
                type="number"
                step="0.50"
                className="form-input"
                value={defaultDeliveryFee}
                onChange={(e) => setDefaultDeliveryFee(e.target.value)}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Aplicada automaticamente quando a cliente escolhe receber em casa no catálogo.
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
          >
            Salvar Configurações da Loja
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}
