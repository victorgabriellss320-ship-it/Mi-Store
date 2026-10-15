import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL, cleanPhoneForWa } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
import {
  Building2,
  Plus,
  Search,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  DollarSign,
  ShieldCheck,
  Star,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react'

export function FornecedoresPage({ onToast, onNavigate }) {
  const {
    suppliers,
    products,
    addSupplier,
    updateSupplier,
    deleteSupplier
  } = useApp()

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedLocation, setSelectedLocation] = useState('Todas')

  // Modais
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [viewSupplier, setViewSupplier] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    whatsapp: '',
    location: '',
    categories: 'Calçados',
    paymentTerms: '',
    notes: '',
    rating: 5.0
  })

  // Categorias e Localizações para filtro
  const categoriesList = useMemo(() => {
    const set = new Set()
    suppliers.forEach(s => {
      if (Array.isArray(s.categories)) s.categories.forEach(c => set.add(c))
      else if (s.category) set.add(s.category)
    })
    return ['Todas', ...Array.from(set)]
  }, [suppliers])

  const locationsList = useMemo(() => {
    const set = new Set()
    suppliers.forEach(s => {
      const loc = (s.location || s.address || '').split('-')[0].trim()
      if (loc) set.add(loc)
    })
    return ['Todas', ...Array.from(set)]
  }, [suppliers])

  // Métricas
  const totalSuppliers = suppliers.length
  const totalProductsTied = products.filter(p => p.preferredSupplierId).length
  const totalSpentAll = suppliers.reduce((acc, s) => acc + (s.totalSpent || 0), 0)

  // Filtragem
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const search = searchTerm.toLowerCase().trim()
      const matchSearch = !search ||
        (s.name || '').toLowerCase().includes(search) ||
        (s.contactPerson || '').toLowerCase().includes(search) ||
        (s.location || s.address || '').toLowerCase().includes(search) ||
        (s.notes || '').toLowerCase().includes(search)

      const matchCat = selectedCategory === 'Todas' ||
        (Array.isArray(s.categories) ? s.categories.includes(selectedCategory) : s.category === selectedCategory)

      const matchLoc = selectedLocation === 'Todas' ||
        (s.location || s.address || '').toLowerCase().includes(selectedLocation.toLowerCase())

      return matchSearch && matchCat && matchLoc
    })
  }, [suppliers, searchTerm, selectedCategory, selectedLocation])

  // Produtos de um fornecedor
  const getSupplierProducts = (supplierId) => {
    return products.filter(p => p.preferredSupplierId === supplierId || (p.alternativeSupplierIds && p.alternativeSupplierIds.includes(supplierId)))
  }

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    setEditingSupplier(null)
    setFormData({
      name: '',
      contactPerson: '',
      whatsapp: '',
      location: '',
      categories: 'Calçados',
      paymentTerms: 'Pix à vista ou dinheiro no ato da retirada.',
      notes: '',
      rating: 5.0
    })
    setIsSupplierModalOpen(true)
  }

  // Abrir modal de edição
  const handleOpenEditModal = (s, e) => {
    if (e) e.stopPropagation()
    setEditingSupplier(s)
    setFormData({
      name: s.name,
      contactPerson: s.contactPerson || '',
      whatsapp: s.whatsapp || '',
      location: s.location || s.address || '',
      categories: Array.isArray(s.categories) ? s.categories.join(', ') : (s.categories || s.category || 'Calçados'),
      paymentTerms: s.paymentTerms || '',
      notes: s.notes || '',
      rating: s.rating || 5.0
    })
    setIsSupplierModalOpen(true)
  }

  // Salvar Fornecedor
  const handleSaveSupplier = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      if (onToast) onToast('Informe o nome do fornecedor ou box')
      return
    }

    const catsArr = formData.categories.split(',').map(c => c.trim()).filter(Boolean)

    const payload = {
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      whatsapp: formData.whatsapp.trim(),
      location: formData.location.trim(),
      address: formData.location.trim(),
      categories: catsArr.length > 0 ? catsArr : ['Calçados'],
      paymentTerms: formData.paymentTerms.trim(),
      notes: formData.notes.trim(),
      rating: parseFloat(formData.rating) || 5.0
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, payload)
      if (viewSupplier && viewSupplier.id === editingSupplier.id) {
        setViewSupplier(prev => ({ ...prev, ...payload }))
      }
      if (onToast) onToast(`Fornecedor "${payload.name}" atualizado!`)
    } else {
      addSupplier(payload)
      if (onToast) onToast(`Fornecedor "${payload.name}" cadastrado com sucesso!`)
    }

    setIsSupplierModalOpen(false)
  }

  // Deletar fornecedor
  const handleConfirmDelete = (id) => {
    deleteSupplier(id)
    setDeleteConfirmId(null)
    if (viewSupplier && viewSupplier.id === id) setViewSupplier(null)
    if (onToast) onToast('Fornecedor removido com sucesso.')
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
              Aba 7 · Parceiros de Compra
            </span>
            <span style={{ fontSize: '0.8rem', color: '#887B7D' }}>• Roteiro atacadista de João Pessoa</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
            Fornecedores (João Pessoa)
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#685D60' }}>
            Contatos diretos, localização de boxes, regras de atacado e anotações para o dia da viagem.
          </p>
        </div>

        {/* Botão de Cadastro */}
        <button
          onClick={handleOpenCreateModal}
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
          <Plus size={18} />
          <span>Cadastrar Novo Fornecedor</span>
        </button>
      </div>

      {/* Cards de Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '22px'
      }}>
        {/* Card 1: Total de Fornecedores */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#731A30', textTransform: 'uppercase' }}>
              Fornecedores Ativos
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2A2426' }}>
            {totalSuppliers}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            boxes e galerias em João Pessoa
          </span>
        </div>

        {/* Card 2: Produtos Vinculados */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B6A43', textTransform: 'uppercase' }}>
              Peças Vinculadas
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1B6A43' }}>
            {totalProductsTied}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            produtos com fornecedor preferencial
          </span>
        </div>

        {/* Card 3: Total Gasto */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#80530E', textTransform: 'uppercase' }}>
              Total Comprado em Viagens
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFBF0', color: '#80530E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#80530E' }}>
            {formatBRL(totalSpentAll)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            volume acumulado de reposição
          </span>
        </div>

        {/* Card 4: Sigilo Garantido */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#685D60', textTransform: 'uppercase' }}>
              Sigilo Operacional
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F5F2F0', color: '#685D60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1B6A43' }}>
            100% Protegido
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            nenhum dado aparece na Loja Pública
          </span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '14px 18px',
        border: '1px solid #ECE5DE',
        marginBottom: '18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Campo de Busca */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F9F7F5',
          border: '1px solid #E0D9D4',
          borderRadius: '8px',
          padding: '8px 12px',
          flex: '1 1 240px'
        }}>
          <Search size={16} color="#887B7D" />
          <input
            type="text"
            placeholder="Buscar por nome do box, contato ou endereço em JP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#2A2426',
              width: '100%'
            }}
          />
        </div>

        {/* Filtro de Categoria */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#685D60' }}>Categoria:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #E0D9D4',
              background: '#F9F7F5',
              fontSize: '0.82rem',
              color: '#2A2426',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {categoriesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Bairro / Polo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#685D60' }}>Polo em JP:</span>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #E0D9D4',
              background: '#F9F7F5',
              fontSize: '0.82rem',
              color: '#2A2426',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {locationsList.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Cards de Fornecedores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {filteredSuppliers.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px solid #ECE5DE',
            color: '#887B7D'
          }}>
            <Building2 size={36} color="#887B7D" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
              Nenhum fornecedor encontrado
            </div>
            <span style={{ fontSize: '0.82rem' }}>
              Tente alterar os termos de busca ou cadastre um novo fornecedor.
            </span>
          </div>
        ) : (
          filteredSuppliers.map(s => {
            const tiedProds = getSupplierProducts(s.id)
            const waNumber = cleanPhoneForWa(s.whatsapp || '')

            return (
              <div
                key={s.id}
                onClick={() => setViewSupplier(s)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #ECE5DE',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(42,36,38,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C89D5C'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(115,26,48,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#ECE5DE'
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(42,36,38,0.03)'
                }}
              >
                <div>
                  {/* Topo do Card */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: '#FDF5F5',
                        color: '#731A30',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem'
                      }}>
                        <Building2 size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                          {s.name}
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: '#685D60' }}>
                          Contato: <strong>{s.contactPerson || 'Geral'}</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={(e) => handleOpenEditModal(s, e)}
                        title="Editar fornecedor"
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: '1px solid #ECE5DE',
                          background: '#FFFFFF',
                          color: '#731A30',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Localização / Box */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: '#4A3E42', marginBottom: '8px' }}>
                    <MapPin size={15} color="#731A30" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.35 }}>
                      {s.location || s.address || 'João Pessoa - PB'}
                    </span>
                  </div>

                  {/* WhatsApp */}
                  {s.whatsapp && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <MessageCircle size={15} color="#25D366" />
                      <span style={{ color: '#4A3E42', fontWeight: 600 }}>{s.whatsapp}</span>
                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            color: '#25D366',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          Chamar no WhatsApp →
                        </a>
                      )}
                    </div>
                  )}

                  {/* Anotações de Negociação / Viagem */}
                  {s.notes && (
                    <div style={{
                      background: '#FFFBF0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #F6E0A4',
                      fontSize: '0.76rem',
                      color: '#80530E',
                      marginBottom: '12px',
                      lineHeight: 1.4
                    }}>
                      💡 <strong>Dica da Viagem:</strong> {s.notes}
                    </div>
                  )}

                  {/* Produtos Vinculados */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#685D60', textTransform: 'uppercase' }}>
                        Peças Vinculadas ({tiedProds.length})
                      </span>
                    </div>

                    {tiedProds.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {tiedProds.slice(0, 5).map(p => (
                          <img
                            key={p.id}
                            src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80'}
                            alt={p.name}
                            title={`${p.name} (Custo: ${formatBRL(p.cost || 0)})`}
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              border: '1px solid #ECE5DE'
                            }}
                          />
                        ))}
                        {tiedProds.length > 5 && (
                          <span style={{ fontSize: '0.75rem', color: '#731A30', fontWeight: 700 }}>
                            +{tiedProds.length - 5}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
                        Nenhuma peça catalogada especificamente para este box.
                      </span>
                    )}
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F4EFEB'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#685D60' }}>
                    Compras:{' '}
                    <strong style={{ color: '#2A2426' }}>
                      {formatBRL(s.totalSpent || 0)}
                    </strong>
                  </div>

                  <button
                    onClick={() => setViewSupplier(s)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#731A30',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Ver detalhes completos →
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal / Drawer de Detalhes do Fornecedor */}
      {viewSupplier && (
        <Modal
          isOpen={!!viewSupplier}
          onClose={() => setViewSupplier(null)}
          title="Ficha do Fornecedor (Sigiloso)"
          maxWidth="600px"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #ECE5DE', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
                  {viewSupplier.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#685D60' }}>
                  Contato: <strong>{viewSupplier.contactPerson || 'Geral'}</strong>
                </span>
              </div>

              <button
                onClick={() => handleOpenEditModal(viewSupplier)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ECE5DE',
                  background: '#F9F7F5',
                  color: '#731A30',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Edit size={14} />
                <span>Editar Dados</span>
              </button>
            </div>

            {/* Informações de Contato e Localização */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#731A30" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Localização:</strong> {viewSupplier.location || viewSupplier.address}</span>
              </div>

              {viewSupplier.whatsapp && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={16} color="#25D366" />
                  <span><strong>WhatsApp:</strong> {viewSupplier.whatsapp}</span>
                  <a
                    href={`https://wa.me/${cleanPhoneForWa(viewSupplier.whatsapp)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#25D366', fontWeight: 700, marginLeft: '4px', textDecoration: 'none' }}
                  >
                    (Abrir conversa)
                  </a>
                </div>
              )}

              {viewSupplier.paymentTerms && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <DollarSign size={16} color="#1B6A43" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Regras de Pagamento / Atacado:</strong> {viewSupplier.paymentTerms}</span>
                </div>
              )}

              {viewSupplier.notes && (
                <div style={{ background: '#FFFBF0', padding: '10px 14px', borderRadius: '8px', border: '1px solid #F6E0A4', marginTop: '6px' }}>
                  <strong style={{ color: '#80530E', fontSize: '0.78rem' }}>Dicas para a Viagem de Quinta:</strong>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#80530E', lineHeight: 1.4 }}>
                    {viewSupplier.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Peças vinculadas */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2A2426', margin: '0 0 10px' }}>
                Peças Fornecidas por este Box ({getSupplierProducts(viewSupplier.id).length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {getSupplierProducts(viewSupplier.id).map(prod => (
                  <div
                    key={prod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#FAF8F6',
                      borderRadius: '8px',
                      border: '1px solid #ECE5DE'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80'}
                        alt={prod.name}
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2A2426' }}>{prod.name}</div>
                        <span style={{ fontSize: '0.72rem', color: '#685D60' }}>{prod.category}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1B6A43' }}>
                        Custo: {formatBRL(prod.cost || 0)}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#887B7D' }}>
                        Venda: {formatBRL(prod.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setViewSupplier(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid #ECE5DE',
                  background: '#FFFFFF',
                  color: '#685D60',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Cadastrar ou Editar Fornecedor */}
      {isSupplierModalOpen && (
        <Modal
          isOpen={isSupplierModalOpen}
          onClose={() => setIsSupplierModalOpen(false)}
          title={editingSupplier ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}
          maxWidth="520px"
        >
          <form onSubmit={handleSaveSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Nome do Fornecedor ou Box *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: JP Calçados Atacado"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                  Pessoa de Contato
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carlos / Valéria"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D8CFC8',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                  WhatsApp / Celular
                </label>
                <input
                  type="text"
                  placeholder="(83) 98877-1122"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D8CFC8',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Localização / Galeria / Box em João Pessoa
              </label>
              <input
                type="text"
                placeholder="Ex: Centro - Galeria das Rendeiras, Box 14/15, João Pessoa - PB"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Categorias Atendidas (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="Calçados, Bolsas, Acessórios"
                value={formData.categories}
                onChange={e => setFormData({ ...formData, categories: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Condições de Pagamento / Mínimo de Peças
              </label>
              <input
                type="text"
                placeholder="Ex: Pix à vista dá 5% de desconto. Mínimo 4 peças."
                value={formData.paymentTerms}
                onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Dicas de Viagem & Anotações Internas
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Abre às 07:30 nas quintas. Reservar pelo WhatsApp na quarta."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D8CFC8',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
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
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#731A30',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(115,26,48,0.2)'
                }}
              >
                {editingSupplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
