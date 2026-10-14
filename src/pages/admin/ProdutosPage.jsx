import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { formatBRL } from '../../utils/formatters'
import {
  PackageCheck,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react'

export function ProdutosPage() {
  const { products, addProduct, updateProduct, toggleProductVisibility, suppliers, navigateTo } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Calçados')
  const [price, setPrice] = useState('')
  const [cost, setCost] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sizesStr, setSizesStr] = useState('35, 36, 37, 38, 39')
  const [colorsStr, setColorsStr] = useState('Dourado, Prata, Preto')
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '')
  const [description, setDescription] = useState('')

  const categories = ['Todos', 'Calçados', 'Bolsas', 'Looks & Vestidos', 'Acessórios']

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.colors && p.colors.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())))

    return matchesCategory && matchesSearch
  })

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setName('')
    setCategory('Calçados')
    setPrice('')
    setCost('')
    setImageUrl('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80')
    setSizesStr('35, 36, 37, 38, 39')
    setColorsStr('Nude, Preto, Dourado')
    setSupplierId(suppliers[0]?.id || '')
    setDescription('')
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod)
    setName(prod.name)
    setCategory(prod.category)
    setPrice(prod.price.toString())
    setCost(prod.cost.toString())
    setImageUrl(prod.images[0] || '')
    setSizesStr(prod.sizes ? prod.sizes.join(', ') : '')
    setColorsStr(prod.colors ? prod.colors.join(', ') : '')
    setSupplierId(prod.preferredSupplierId || suppliers[0]?.id || '')
    setDescription(prod.description || '')
    setIsAddModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !price) return

    const productPayload = {
      name,
      category,
      price: parseFloat(price) || 0,
      cost: parseFloat(cost) || 0,
      images: [imageUrl || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'],
      sizes: sizesStr.split(',').map(s => s.trim()).filter(Boolean),
      colors: colorsStr.split(',').map(c => c.trim()).filter(Boolean),
      preferredSupplierId: supplierId,
      description,
      isPreOrder: true
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload)
    } else {
      addProduct(productPayload)
    }

    setIsAddModalOpen(false)
  }

  return (
    <AdminLayout
      title="Catálogo de Produtos & Encomendas"
      subtitle="Gerencie modelos, preços de venda, custos no atacado em JP e visibilidade para as clientes"
      actionButton={
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Novo Produto
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Filtros e Busca */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'var(--color-primary)' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)'
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar produto ou cor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', height: '36px' }}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Produto</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Categoria</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Preço Venda</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Custo Est. JP</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Margem Bruta</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Fornecedor JP</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Visibilidade</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => {
                  const isVisible = prod.status === 'active'
                  const marginBRL = prod.price - prod.cost
                  const marginPct = prod.price > 0 ? Math.round((marginBRL / prod.price) * 100) : 0
                  const supplier = suppliers.find(s => s.id === prod.preferredSupplierId)

                  return (
                    <tr
                      key={prod.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        opacity: isVisible ? 1 : 0.65,
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {prod.sizes && prod.sizes.join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {prod.category}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatBRL(prod.price)}
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {formatBRL(prod.cost)}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: 'var(--status-success-bg)',
                          color: 'var(--status-success-text)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}>
                          {formatBRL(marginBRL)} ({marginPct}%)
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {supplier?.name || 'Não definido'}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <button
                          type="button"
                          onClick={() => toggleProductVisibility(prod.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            background: isVisible ? 'var(--status-success-bg)' : 'var(--bg-surface-subtle)',
                            color: isVisible ? 'var(--status-success-text)' : 'var(--text-muted)'
                          }}
                          title={isVisible ? 'Clique para ocultar do catálogo' : 'Clique para exibir no catálogo'}
                        >
                          {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                          <span>{isVisible ? 'No Catálogo' : 'Oculto'}</span>
                        </button>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleOpenEdit(prod)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Cadastro / Edição de Produto */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto para Encomenda'}
          maxWidth="640px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Nome do Produto *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Rasteira Trançada Pérola"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Calçados">Calçados</option>
                  <option value="Bolsas">Bolsas</option>
                  <option value="Looks & Vestidos">Looks & Vestidos</option>
                  <option value="Acessórios">Acessórios</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fornecedor Preferencial em JP</label>
                <select
                  className="form-select"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.address})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Preço de Venda (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="Ex: 89,90"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Custo Estimado no Atacado (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="Ex: 48,00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL da Foto Principal</label>
              <input
                type="url"
                className="form-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Tamanhos (separados por vírgula)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 35, 36, 37, 38, 39"
                  value={sizesStr}
                  onChange={(e) => setSizesStr(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cores Disponíveis (separadas por vírgula)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Dourado, Prata, Preto"
                  value={colorsStr}
                  onChange={(e) => setColorsStr(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição do Produto (para a cliente)</label>
              <textarea
                className="form-textarea"
                placeholder="Detalhes sobre conforto, acabamento e ocasiões de uso..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  )
}
