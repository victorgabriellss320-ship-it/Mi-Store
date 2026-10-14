import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LayoutGrid, Plus, Edit2, Tag, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react'
import { Modal } from '../../components/common/Modal'

export function CategoriasPage({ onToast, onNavigate }) {
  const { products } = useApp()

  const [categories, setCategories] = useState([
    {
      id: 'calcados',
      name: 'Calçados Femininos',
      slug: 'calcados',
      description: 'Sandálias, rasteirinhas, scarpins, papetes e saltos em alta.',
      active: true,
      color: '#731A30'
    },
    {
      id: 'bolsas',
      name: 'Bolsas & Carteiras',
      slug: 'bolsas',
      description: 'Modelos tiracolo, matelassê, clutches e bolsas de viagem.',
      active: true,
      color: '#853A52'
    },
    {
      id: 'acessorios',
      name: 'Acessórios & Bijuterias',
      slug: 'acessorios',
      description: 'Cintos finos, brincos dourados, braceletes e lenços acetinados.',
      active: true,
      color: '#C89D5C'
    },
    {
      id: 'looks',
      name: 'Moda Festa & Vestuário',
      slug: 'looks',
      description: 'Vestidos de festa, conjuntos em alfaiataria e novidades semanais.',
      active: true,
      color: '#2E7D5A'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')

  const getProductCount = (categorySlug) => {
    return products.filter(p => p.category === categorySlug || p.category?.toLowerCase() === categorySlug).length
  }

  const handleOpenNew = () => {
    setEditingCategory(null)
    setCatName('')
    setCatDesc('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat)
    setCatName(cat.name)
    setCatDesc(cat.description)
    setIsModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!catName.trim()) return

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: catName, description: catDesc } : c))
      if (onToast) onToast(`Categoria "${catName}" atualizada com sucesso!`)
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: catName,
        slug: catName.toLowerCase().replace(/\s+/g, '-'),
        description: catDesc,
        active: true,
        color: '#731A30'
      }
      setCategories(prev => [...prev, newCat])
      if (onToast) onToast(`Nova categoria "${catName}" criada!`)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Categorias do Catálogo</h1>
          <p className="page-header-subtitle">
            Organização das vitrines e departamentos da M_I Store para clientes e controle interno.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleOpenNew}
        >
          <Plus size={16} />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Métricas Rápidas */}
      <div className="metrics-row">
        <div className="metric-box">
          <span className="metric-box-title">Categorias Ativas</span>
          <span className="metric-box-value">{categories.length}</span>
          <span className="metric-box-desc">Linhas comerciais organizadas</span>
        </div>
        <div className="metric-box">
          <span className="metric-box-title">Produtos Vinculados</span>
          <span className="metric-box-value">{products.length}</span>
          <span className="metric-box-desc">Distribuídos entre as categorias</span>
        </div>
        <div className="metric-box">
          <span className="metric-box-title">Vitrine Principal</span>
          <span className="metric-box-value" style={{ color: '#731A30' }}>Calçados</span>
          <span className="metric-box-desc">Carro-chefe da loja</span>
        </div>
      </div>

      {/* Grid de Categorias */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {categories.map((cat) => {
          const count = getProductCount(cat.slug)
          return (
            <div
              key={cat.id}
              className="dash-card"
              style={{
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: cat.color || '#731A30'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', marginTop: '4px' }}>
                <span className="status-pill status-pill-success">
                  <CheckCircle2 size={12} />
                  Ativa na Loja
                </span>
                <span style={{ fontSize: '0.78rem', color: '#7A7067', fontWeight: 600 }}>
                  Slug: {cat.slug}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2A2426', marginBottom: '6px' }}>
                {cat.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#7A7067', lineHeight: 1.4, minHeight: '38px', marginBottom: '16px' }}>
                {cat.description}
              </p>

              <div style={{
                padding: '12px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={16} color="#731A30" />
                  <span style={{ fontSize: '0.8125rem', color: '#4A4240' }}>Produtos no Catálogo</span>
                </div>
                <strong style={{ fontSize: '1rem', color: '#731A30' }}>{count} itens</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleOpenEdit(cat)}
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                >
                  <Edit2 size={14} />
                  <span>Editar</span>
                </button>
                {onNavigate && (
                  <button
                    type="button"
                    className="btn-soft"
                    onClick={() => onNavigate('produtos')}
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    <span>Ver Produtos</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Nova / Editar Categoria */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#2A2426', marginBottom: '6px' }}>
                Nome da Categoria
              </label>
              <input
                type="text"
                className="search-input"
                style={{ height: '40px', padding: '0 12px' }}
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Ex: Calçados Femininos, Moda Praia..."
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#2A2426', marginBottom: '6px' }}>
                Descrição para Clientes
              </label>
              <textarea
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  minHeight: '80px',
                  outline: 'none'
                }}
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Breve resumo dos produtos dessa categoria..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingCategory ? 'Salvar Alterações' : 'Cadastrar Categoria'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
