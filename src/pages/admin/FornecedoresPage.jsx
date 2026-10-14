import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { formatBRL } from '../../utils/formatters'
import {
  Building2,
  Plus,
  Phone,
  MapPin,
  Search,
  ExternalLink,
  MessageCircle,
  Tag,
  Star
} from 'lucide-react'

export function FornecedoresPage() {
  const { suppliers, addSupplier } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Calçados Femininos')
  const [contactName, setContactName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [boxNumber, setBoxNumber] = useState('')
  const [notes, setNotes] = useState('')

  const filteredSuppliers = suppliers.filter(s => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    addSupplier({
      name,
      category,
      contactName,
      whatsapp,
      address: address || 'João Pessoa, PB',
      boxNumber,
      notes
    })

    // Reset
    setName('')
    setCategory('Calçados Femininos')
    setContactName('')
    setWhatsapp('')
    setAddress('')
    setBoxNumber('')
    setNotes('')
    setIsAddModalOpen(false)
  }

  return (
    <AdminLayout
      title="Fornecedores de João Pessoa"
      subtitle="Parceiros atacadistas, localizações nos boxes e contatos para a viagem semanal"
      actionButton={
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Novo Fornecedor
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Barra de Busca */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por nome do atacado, box ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {/* Grid de Fornecedores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredSuppliers.map(supp => (
            <div
              key={supp.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--color-primary)',
                    background: 'var(--color-primary-light)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {supp.category}
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    color: '#8c5d1c',
                    background: 'var(--color-gold-light)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 700
                  }}>
                    ★ {supp.rating || '5.0'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {supp.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <span>{supp.address} {supp.boxNumber && `• Box ${supp.boxNumber}`}</span>
                  </div>

                  {supp.contactName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span>Contato: <strong>{supp.contactName}</strong></span>
                    </div>
                  )}

                  {supp.whatsapp && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} style={{ color: '#25D366', flexShrink: 0 }} />
                      <span>{supp.whatsapp}</span>
                    </div>
                  )}
                </div>

                {supp.notes && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 10px',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong>Dica de Compra:</strong> {supp.notes}
                  </div>
                )}
              </div>

              {/* Botões de Ação do Fornecedor */}
              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px'
              }}>
                {supp.whatsapp && (
                  <a
                    href={`https://wa.me/55${supp.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      fontWeight: 600,
                      gap: '6px'
                    }}
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px'
                }}>
                  Total comprado: <strong>{formatBRL(supp.totalSpent || 0)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Cadastro de Fornecedor */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Cadastrar Novo Fornecedor em João Pessoa"
        >
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Nome do Atacado / Loja *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Bella Calçados Atacado"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoria Principal</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Calçados Femininos">Calçados Femininos</option>
                <option value="Bolsas & Carteiras">Bolsas & Carteiras</option>
                <option value="Moda Feminina & Looks">Moda Feminina & Looks</option>
                <option value="Acessórios & Bijuterias">Acessórios & Bijuterias</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Nome do Vendedor / Dono</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Carlos"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp com DDD</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ex: (83) 99123-4567"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Endereço / Galeria em JP</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Rua Maciel Pinheiro, Centro"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Box / Sala</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Box 14"
                  value={boxNumber}
                  onChange={(e) => setBoxNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Condições e Dicas de Compra (Opcional)</label>
              <textarea
                className="form-textarea"
                placeholder="Ex: Dá 10% de desconto acima de 6 pares no Pix."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAddModalOpen(false)}
                style={{ flex: 1 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                style={{ flex: 2 }}
              >
                Salvar Fornecedor
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
