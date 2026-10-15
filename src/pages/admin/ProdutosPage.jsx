import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { formatBRL } from '../../utils/formatters'
import { Modal } from '../../components/common/Modal'
import {
  Package,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Tag,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle,
  FolderTree,
  AlertCircle
} from 'lucide-react'

export function ProdutosPage({ onToast, onNavigate }) {
  const {
    products,
    addProduct,
    updateProduct,
    toggleProductVisibility,
    deleteProduct,
    suppliers
  } = useApp()

  // Visualização ativa: 'produtos' ou 'categorias'
  const [subTab, setSubTab] = useState('produtos') // 'produtos' | 'categorias'

  // Filtros de produtos
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'hidden'
  const [sortBy, setSortBy] = useState('name')

  // Modais de Produto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Categorias locais (armazenadas em estado com sincronia com produtos)
  const [categoriesList, setCategoriesList] = useState([
    { id: 'cat-1', name: 'Calçados', desc: 'Rasteiras, sandálias de salto, scarpins e papetes femininas.', active: true, color: '#731A30' },
    { id: 'cat-2', name: 'Bolsas', desc: 'Tiracolos, matelassê, clutches e mochilas de festa.', active: true, color: '#853A52' },
    { id: 'cat-3', name: 'Acessórios', desc: 'Cintos finos, bijuterias e braceletes metalizados.', active: true, color: '#C89D5C' },
    { id: 'cat-4', name: 'Looks & Vestidos', desc: 'Vestidos de festa, macacões e conjuntos.', active: true, color: '#2E7D5A' }
  ])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')

  // Form states de Produto
  const [formData, setFormData] = useState({
    name: '',
    category: 'Calçados',
    price: '',
    cost: '',
    image: '',
    description: '',
    sizes: '35, 36, 37, 38, 39',
    colors: 'Dourado, Nude, Preto',
    preferredSupplierId: '',
    internalNotes: '',
    isPreOrder: true,
    featured: false,
    status: 'active'
  })

  // Métricas
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const hiddenProducts = products.filter(p => p.status === 'hidden').length
  const totalCategories = categoriesList.length

  // Lista de categorias únicas para filtros
  const availableCategories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean))
    return ['Todas', ...Array.from(set)]
  }, [products])

  // Filtragem e ordenação
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchSearch = (prod.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat = categoryFilter === 'Todas' || prod.category === categoryFilter
      const matchStatus = statusFilter === 'all' || prod.status === statusFilter
      return matchSearch && matchCat && matchStatus
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'priceAsc') return a.price - b.price
      if (sortBy === 'priceDesc') return b.price - a.price
      if (sortBy === 'margin') {
        const marginA = a.price ? (a.price - (a.cost || 0)) / a.price : 0
        const marginB = b.price ? (b.price - (b.cost || 0)) / b.price : 0
        return marginB - marginA
      }
      return 0
    })
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy])

  // Abre modal de criação
  const handleOpenCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: categoriesList[0]?.name || 'Calçados',
      price: '',
      cost: '',
      image: '',
      description: '',
      sizes: '35, 36, 37, 38, 39',
      colors: 'Dourado, Nude, Preto',
      preferredSupplierId: suppliers[0]?.id || '',
      internalNotes: '',
      isPreOrder: true,
      featured: false,
      status: 'active'
    })
    setIsProductModalOpen(true)
  }

  // Abre modal de edição
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod)
    setFormData({
      name: prod.name,
      category: prod.category || 'Calçados',
      price: prod.price ? String(prod.price) : '',
      cost: prod.cost ? String(prod.cost) : '',
      image: prod.images && prod.images.length > 0 ? prod.images[0] : '',
      description: prod.description || '',
      sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : (prod.sizes || ''),
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || ''),
      preferredSupplierId: prod.preferredSupplierId || (suppliers[0]?.id || ''),
      internalNotes: prod.internalNotes || '',
      isPreOrder: prod.isPreOrder !== false,
      featured: !!prod.featured,
      status: prod.status || 'active'
    })
    setIsProductModalOpen(true)
  }

  // Submissão do produto
  const handleSaveProduct = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      if (onToast) onToast('Informe o nome do produto')
      return
    }
    const numPrice = parseFloat(formData.price.replace(',', '.'))
    if (isNaN(numPrice) || numPrice <= 0) {
      if (onToast) onToast('Informe um preço de venda válido')
      return
    }
    const numCost = formData.cost ? parseFloat(formData.cost.replace(',', '.')) : (numPrice * 0.5)

    const sizesArr = formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
    const colorsArr = formData.colors.split(',').map(c => c.trim()).filter(Boolean)
    const imagesArr = formData.image.trim() ? [formData.image.trim()] : ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80']

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: numPrice,
      cost: numCost,
      images: imagesArr,
      description: formData.description.trim(),
      sizes: sizesArr.length > 0 ? sizesArr : ['Único'],
      colors: colorsArr.length > 0 ? colorsArr : ['Padrão'],
      preferredSupplierId: formData.preferredSupplierId,
      internalNotes: formData.internalNotes.trim(),
      isPreOrder: formData.isPreOrder,
      featured: formData.featured,
      status: formData.status
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, payload)
      if (onToast) onToast(`Produto "${payload.name}" atualizado!`)
    } else {
      addProduct(payload)
      if (onToast) onToast(`Produto "${payload.name}" cadastrado com sucesso!`)
    }

    setIsProductModalOpen(false)
  }

  // Deletar produto
  const handleConfirmDelete = (id) => {
    if (deleteProduct) {
      deleteProduct(id)
    } else {
      // Fallback
      updateProduct(id, { status: 'hidden', archived: true })
    }
    setDeleteConfirmId(null)
    if (onToast) onToast('Produto removido com sucesso.')
  }

  // Salvar categoria
  const handleSaveCategory = (e) => {
    e.preventDefault()
    if (!catName.trim()) return
    if (editingCategory) {
      setCategoriesList(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: catName, desc: catDesc } : c))
      if (onToast) onToast(`Categoria "${catName}" atualizada!`)
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: catName,
        desc: catDesc,
        active: true,
        color: '#731A30'
      }
      setCategoriesList(prev => [...prev, newCat])
      if (onToast) onToast(`Categoria "${catName}" criada com sucesso!`)
    }
    setIsCategoryModalOpen(false)
  }

  // Margem calculada em tempo real para o formulário
  const formPrice = parseFloat(formData.price.replace(',', '.')) || 0
  const formCost = parseFloat(formData.cost.replace(',', '.')) || 0
  const formProfit = formPrice - formCost
  const formMarginPercent = formPrice > 0 ? Math.round((formProfit / formPrice) * 100) : 0

  return (
    <div className="page-container" style={{ paddingBottom: '60px' }}>
      {/* Top Banner / Header */}
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
              Aba 5 · Acervo & Mostruário
            </span>
            <span style={{ fontSize: '0.8rem', color: '#887B7D' }}>• Sob encomenda e pronta entrega</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2A2426', margin: 0 }}>
            Produtos & Categorias
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#685D60' }}>
            Gerencie as peças da loja, controle preços de venda públicos e proteja custos de João Pessoa.
          </p>
        </div>

        {/* Botão de Ação Primária */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {subTab === 'produtos' ? (
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
              <span>Cadastrar Novo Produto</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCategory(null)
                setCatName('')
                setCatDesc('')
                setIsCategoryModalOpen(true)
              }}
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
                boxShadow: '0 2px 8px rgba(115,26,48,0.25)'
              }}
            >
              <Plus size={18} />
              <span>Nova Categoria</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards de Métricas Operacionais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '22px'
      }}>
        {/* Card 1: Total Cadastrado */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#731A30', textTransform: 'uppercase' }}>
              Produtos Cadastrados
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF5F5', color: '#731A30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2A2426' }}>
            {totalProducts}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            peças catalogadas no painel
          </span>
        </div>

        {/* Card 2: Publicados na Loja */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B6A43', textTransform: 'uppercase' }}>
              Publicados na Loja
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F9F4', color: '#1B6A43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1B6A43' }}>
            {activeProducts}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            visíveis às clientes no catálogo público
          </span>
        </div>

        {/* Card 3: Rascunhos / Ocultos */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#80530E', textTransform: 'uppercase' }}>
              Rascunhos / Ocultos
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFBF0', color: '#80530E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EyeOff size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#80530E' }}>
            {hiddenProducts}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            fora do catálogo (em revisão de preço)
          </span>
        </div>

        {/* Card 4: Categorias */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 18px',
          border: '1px solid #ECE5DE',
          boxShadow: '0 2px 6px rgba(42,36,38,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#685D60', textTransform: 'uppercase' }}>
              Categorias Ativas
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F5F2F0', color: '#685D60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderTree size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2A2426' }}>
            {totalCategories}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#887B7D' }}>
            seções para filtro das clientes
          </span>
        </div>
      </div>

      {/* Navegação entre Sub-Abas (Produtos vs Categorias) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #EAE3DE',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSubTab('produtos')}
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: subTab === 'produtos' ? '#731A30' : '#685D60',
              border: 'none',
              borderBottom: subTab === 'produtos' ? '3px solid #731A30' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-2px'
            }}
          >
            <Package size={16} />
            <span>Catálogo de Produtos</span>
            <span style={{
              background: subTab === 'produtos' ? '#FDF5F5' : '#ECE5DE',
              color: subTab === 'produtos' ? '#731A30' : '#685D60',
              fontSize: '0.75rem',
              padding: '1px 7px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {totalProducts}
            </span>
          </button>

          <button
            onClick={() => setSubTab('categorias')}
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: subTab === 'categorias' ? '#731A30' : '#685D60',
              border: 'none',
              borderBottom: subTab === 'categorias' ? '3px solid #731A30' : '3px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-2px'
            }}
          >
            <FolderTree size={16} />
            <span>Organização de Categorias</span>
            <span style={{
              background: subTab === 'categorias' ? '#FDF5F5' : '#ECE5DE',
              color: subTab === 'categorias' ? '#731A30' : '#685D60',
              fontSize: '0.75rem',
              padding: '1px 7px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {totalCategories}
            </span>
          </button>
        </div>

        {/* Aviso de Sigilo de Custos */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: '#1B6A43',
          background: '#F0F9F4',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid #C4E9D5'
        }} className="desktop-privacy-badge">
          <ShieldCheck size={14} />
          <span>Custos e fornecedores protegidos (sigilo Edvania)</span>
        </div>
      </div>

      {/* Conteúdo: Sub-Aba 1 - Catálogo de Produtos */}
      {subTab === 'produtos' && (
        <div>
          {/* Barra de Filtros */}
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
                placeholder="Buscar por nome ou descrição..."
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
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
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
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filtro de Status de Visibilidade */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#685D60' }}>Visibilidade:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
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
                <option value="all">Todos os Produtos</option>
                <option value="active">Apenas Publicados</option>
                <option value="hidden">Apenas Rascunhos</option>
              </select>
            </div>

            {/* Ordenação */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#685D60' }}>Ordenar:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
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
                <option value="name">Nome (A - Z)</option>
                <option value="priceAsc">Menor Preço</option>
                <option value="priceDesc">Maior Preço</option>
                <option value="margin">Maior Margem (%)</option>
              </select>
            </div>
          </div>

          {/* Tabela Administrativa de Produtos */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #ECE5DE',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(42,36,38,0.03)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                <thead>
                  <tr style={{ background: '#FAF8F6', borderBottom: '1px solid #ECE5DE', color: '#685D60', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '14px 18px' }}>Produto</th>
                    <th style={{ padding: '14px 14px' }}>Variações (Tamanhos & Cores)</th>
                    <th style={{ padding: '14px 14px' }}>Preço Público</th>
                    <th style={{ padding: '14px 14px' }}>
                      <span style={{ color: '#731A30' }}>🔒 Fornecedor & Custo</span>
                    </th>
                    <th style={{ padding: '14px 14px' }}>Visibilidade Loja</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#887B7D' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#685D60', marginBottom: '4px' }}>
                          Nenhum produto encontrado
                        </div>
                        <span style={{ fontSize: '0.82rem' }}>
                          Ajuste os filtros de busca ou cadastre uma nova peça para a loja.
                        </span>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(prod => {
                      const supplierObj = suppliers.find(s => s.id === prod.preferredSupplierId)
                      const costNum = prod.cost || 0
                      const profit = prod.price - costNum
                      const marginPct = prod.price > 0 ? Math.round((profit / prod.price) * 100) : 0
                      const isPublic = prod.status === 'active'

                      return (
                        <tr
                          key={prod.id}
                          style={{
                            borderBottom: '1px solid #F4EFEB',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          {/* Coluna 1: Produto */}
                          <td style={{ padding: '12px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80'}
                                alt={prod.name}
                                style={{
                                  width: '46px',
                                  height: '46px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '1px solid #ECE5DE',
                                  flexShrink: 0
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2A2426' }}>
                                  {prod.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                  <span style={{
                                    fontSize: '0.72rem',
                                    color: '#731A30',
                                    background: '#FDF5F5',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 600
                                  }}>
                                    {prod.category}
                                  </span>
                                  {prod.isPreOrder && (
                                    <span style={{
                                      fontSize: '0.7rem',
                                      color: '#80530E',
                                      background: '#FFFBF0',
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                      fontWeight: 600
                                    }}>
                                      Sob Encomenda
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Coluna 2: Variações */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: '0.78rem', color: '#4A3E42' }}>
                              <div>
                                <strong style={{ color: '#2A2426' }}>Tam:</strong>{' '}
                                {Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes}
                              </div>
                              <div style={{ marginTop: '2px', color: '#685D60' }}>
                                <strong>Cores:</strong>{' '}
                                {Array.isArray(prod.colors) ? prod.colors.join(', ') : prod.colors}
                              </div>
                            </div>
                          </td>

                          {/* Coluna 3: Preço Público */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1B6A43' }}>
                              {formatBRL(prod.price)}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#887B7D' }}>preço no catálogo</span>
                          </td>

                          {/* Coluna 4: Fornecedor & Custo (Sigiloso) */}
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2A2426' }}>
                              {supplierObj ? supplierObj.name : 'Fornecedor JP'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#685D60' }}>
                                Custo: <strong>{formatBRL(costNum)}</strong>
                              </span>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: '4px',
                                background: marginPct >= 40 ? '#F0F9F4' : '#FFFBF0',
                                color: marginPct >= 40 ? '#1B6A43' : '#80530E'
                              }}>
                                +{marginPct}% margem
                              </span>
                            </div>
                          </td>

                          {/* Coluna 5: Visibilidade */}
                          <td style={{ padding: '12px 14px' }}>
                            <button
                              onClick={() => toggleProductVisibility(prod.id)}
                              title={isPublic ? 'Clique para ocultar do catálogo' : 'Clique para publicar no catálogo'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                background: isPublic ? '#F0F9F4' : '#FFFBF0',
                                color: isPublic ? '#1B6A43' : '#80530E',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                              <span>{isPublic ? 'Publicado' : 'Rascunho'}</span>
                            </button>
                          </td>

                          {/* Coluna 6: Ações */}
                          <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                title="Editar produto"
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

                              <button
                                onClick={() => setDeleteConfirmId(prod.id)}
                                title="Remover produto"
                                style={{
                                  padding: '6px',
                                  borderRadius: '6px',
                                  border: '1px solid #ECE5DE',
                                  background: '#FFFFFF',
                                  color: '#A82B3E',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé da tabela com nota de orientação */}
            <div style={{
              background: '#FAF8F6',
              borderTop: '1px solid #ECE5DE',
              padding: '12px 18px',
              fontSize: '0.75rem',
              color: '#685D60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span>
                Exibindo <strong>{filteredProducts.length}</strong> de <strong>{totalProducts}</strong> peças
              </span>
              <span style={{ color: '#887B7D' }}>
                💡 Dica: Clique no botão de visibilidade para colocar uma peça em rascunho instantaneamente.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo: Sub-Aba 2 - Gestão de Categorias */}
      {subTab === 'categorias' && (
        <div>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid #ECE5DE',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#2A2426', margin: 0 }}>
                Organização do Catálogo Público
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#685D60' }}>
                As categorias definem a navegação das clientes na Loja Pública e agrupam as peças por tipo.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {categoriesList.map(cat => {
              const count = products.filter(p => p.category === cat.name).length
              return (
                <div
                  key={cat.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '18px',
                    border: '1px solid #ECE5DE',
                    boxShadow: '0 2px 6px rgba(42,36,38,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#1B6A43',
                        background: '#F0F9F4',
                        padding: '2px 8px',
                        borderRadius: '10px'
                      }}>
                        Categoria Ativa
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#731A30' }}>
                        {count} {count === 1 ? 'produto' : 'produtos'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2A2426', margin: '0 0 6px' }}>
                      {cat.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#685D60', margin: 0, lineHeight: 1.4 }}>
                      {cat.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #F4EFEB'
                  }}>
                    <button
                      onClick={() => {
                        setCategoryFilter(cat.name)
                        setSubTab('produtos')
                      }}
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
                      Filtrar produtos →
                    </button>

                    <button
                      onClick={() => {
                        setEditingCategory(cat)
                        setCatName(cat.name)
                        setCatDesc(cat.desc)
                        setIsCategoryModalOpen(true)
                      }}
                      style={{
                        background: '#F9F7F5',
                        border: '1px solid #ECE5DE',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#4A3E42',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal: Cadastrar ou Editar Produto */}
      {isProductModalOpen && (
        <Modal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title={editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
          maxWidth="680px"
        >
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Seção 1: Dados Públicos */}
            <div style={{ background: '#FAF8F6', padding: '14px', borderRadius: '10px', border: '1px solid #ECE5DE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Eye size={15} color="#1B6A43" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1B6A43', textTransform: 'uppercase' }}>
                  1. Dados Públicos (Visíveis no Catálogo)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {/* Nome do Produto */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sandália Rasteira Trançada Dourada"
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

                {/* Categoria */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem'
                    }}
                  >
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Preço de Venda */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Preço de Venda Público (R$) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 89,90"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#1B6A43'
                    }}
                  />
                </div>

                {/* Foto / Imagem URL */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    URL da Foto do Produto
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#887B7D', marginTop: '2px', display: 'block' }}>
                    Se deixar em branco, uma imagem modelo de calçado/bolsa será usada automaticamente.
                  </span>
                </div>

                {/* Tamanhos */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Tamanhos (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="35, 36, 37, 38, 39"
                    value={formData.sizes}
                    onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {/* Cores */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Cores disponíveis (vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Dourado, Nude, Preto"
                    value={formData.colors}
                    onChange={e => setFormData({ ...formData, colors: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {/* Descrição */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Descrição Curta para o Catálogo
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Rasteira confortável com tiras metalizadas, ideal para o dia a dia..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
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
              </div>
            </div>

            {/* Seção 2: Dados Internos / Sigilosos (Edvania) */}
            <div style={{ background: '#FFF5F6', padding: '14px', borderRadius: '10px', border: '1px solid #F5D3D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#731A30" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#731A30', textTransform: 'uppercase' }}>
                    2. Dados Internos & Sigilo (Exclusivo Edvania)
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#731A30', fontWeight: 700 }}>
                  🔒 Nunca exibido no catálogo público
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {/* Fornecedor de João Pessoa */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Fornecedor em João Pessoa
                  </label>
                  <select
                    value={formData.preferredSupplierId}
                    onChange={e => setFormData({ ...formData, preferredSupplierId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem'
                    }}
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.location || 'JP'})</option>
                    ))}
                  </select>
                </div>

                {/* Custo no Fornecedor */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Custo no Fornecedor (R$)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 45,00"
                    value={formData.cost}
                    onChange={e => setFormData({ ...formData, cost: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8CFC8',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {/* Margem calculada dinamicamente */}
                <div style={{
                  gridColumn: '1 / -1',
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #EAE3DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={16} color="#1B6A43" />
                    <span style={{ fontSize: '0.8rem', color: '#4A3E42', fontWeight: 600 }}>
                      Lucro Bruto Previsto:{' '}
                      <strong style={{ color: formProfit >= 0 ? '#1B6A43' : '#A82B3E' }}>
                        {formatBRL(formProfit)}
                      </strong>
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: formMarginPercent >= 40 ? '#F0F9F4' : '#FFFBF0',
                    color: formMarginPercent >= 40 ? '#1B6A43' : '#80530E'
                  }}>
                    Margem: {formMarginPercent}%
                  </span>
                </div>

                {/* Anotações do Box / Viagem */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                    Anotações Internas (Box, Descontos, Regras de Atacado)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Box 14 - Pedir desconto de R$ 5 acima de 3 pares."
                    value={formData.internalNotes}
                    onChange={e => setFormData({ ...formData, internalNotes: e.target.value })}
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
            </div>

            {/* Seção 3: Publicação */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#2A2426' }}>
                <input
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={e => setFormData({ ...formData, status: e.target.checked ? 'active' : 'hidden' })}
                  style={{ width: '16px', height: '16px', accentColor: '#731A30' }}
                />
                <span>Publicar imediatamente no catálogo público da M_I Store</span>
              </label>
            </div>

            {/* Botões do Modal */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                style={{
                  padding: '9px 16px',
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
                  padding: '9px 20px',
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
                {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Adicionar/Editar Categoria */}
      {isCategoryModalOpen && (
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          maxWidth="450px"
        >
          <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#2A2426', marginBottom: '4px' }}>
                Nome da Categoria *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Calçados Femininos"
                value={catName}
                onChange={e => setCatName(e.target.value)}
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
                Descrição para as Clientes
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Rasteiras, sandálias de salto e papetes."
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                style={{
                  padding: '8px 14px',
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
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#731A30',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Salvar Categoria
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirmar Exclusão"
          maxWidth="400px"
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <AlertCircle size={44} color="#A82B3E" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.9rem', color: '#2A2426', fontWeight: 600, margin: '0 0 6px' }}>
              Tem certeza que deseja remover esta peça?
            </p>
            <p style={{ fontSize: '0.78rem', color: '#887B7D', margin: 0 }}>
              Ela deixará de estar visível no catálogo público da loja.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={() => setDeleteConfirmId(null)}
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
              onClick={() => handleConfirmDelete(deleteConfirmId)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#A82B3E',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sim, Remover
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
