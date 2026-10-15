import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatBRL } from '../../utils/formatters'
import { toPublicCatalogProducts } from '../../utils/publicCatalog'
import { CatalogHeader } from '../../components/catalog/CatalogHeader'
import { ProductCard } from '../../components/catalog/ProductCard'
import { ProductModal } from '../../components/catalog/ProductModal'
import { CartDrawer } from '../../components/catalog/CartDrawer'
import './CatalogPage.css'

export function CatalogPage() {
  const { products, cart } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Expose only catalog fields to the public-facing components.
  const publicProducts = useMemo(() => toPublicCatalogProducts(products), [products])

  const categories = useMemo(() => (
    ['Todos', ...new Set(publicProducts.map(product => product.category))]
  ), [publicProducts])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('pt-BR')

    return publicProducts.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesSearch = !query || [product.name, product.category, ...product.colors]
        .some(value => value.toLocaleLowerCase('pt-BR').includes(query))

      return matchesCategory && matchesSearch
    })
  }, [publicProducts, selectedCategory, searchQuery])

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)
  const cartSubtotal = cart.reduce((total, item) => (
    total + (Number.isFinite(item.price) && Number.isInteger(item.quantity) ? item.price * item.quantity : 0)
  ), 0)

  const handleOpenProduct = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  return (
    <div className="public-catalog" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <CatalogHeader onOpenCart={() => setIsCartOpen(true)} />

      <section style={{
        background: 'linear-gradient(135deg, #f5ebeb 0%, #faeef2 50%, #ffffff 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '36px 0 28px'
      }}>
        <div className="container">
          <div style={{ maxWidth: '640px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px'
            }}>
              Catálogo de demonstração
            </span>
            <h2 style={{
              fontSize: '2.125rem',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '12px'
            }}>
              Encontre peças para compor seu estilo
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Produtos, imagens, preços e variações são ilustrativos. Este protótipo não confirma disponibilidade, não reserva peças e não envia pedidos.
            </p>
            <div role="note" style={{
              border: '1px solid #E8D7B0',
              borderRadius: 'var(--radius-md)',
              background: '#FFFAF0',
              color: '#624D29',
              padding: '9px 12px',
              fontSize: '0.8125rem',
              lineHeight: 1.45
            }}>
              Valores apresentados como exemplo. Consulte a loja para confirmar preço, variações, disponibilidade e condições.
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Busca e categorias do catálogo" style={{
        padding: '20px 0',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 80
      }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="public-catalog-search-field" style={{ position: 'relative', maxWidth: '480px' }}>
              <Search size={18} aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="search"
                className="form-input"
                aria-label="Buscar produtos demonstrativos"
                placeholder="Buscar por nome, categoria ou cor"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
              />
            </div>

            <div aria-label="Categorias" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {categories.map(category => {
                const isActive = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'var(--color-primary)' : 'var(--bg-surface)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <main style={{ flex: 1, padding: '24px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedCategory === 'Todos' ? 'Produtos de demonstração' : selectedCategory}
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '8px' }}>
                ({filteredProducts.length})
              </span>
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div role="status" style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Search size={40} aria-hidden="true" style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {publicProducts.length === 0 ? 'Nenhum produto demonstrativo publicado' : 'Nenhum produto encontrado'}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {publicProducts.length === 0
                  ? 'O catálogo ilustrativo não tem itens para exibir.'
                  : 'Tente outro termo ou selecione a categoria Todos.'}
              </p>
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} style={{ marginTop: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onSelect={handleOpenProduct} />
              ))}
            </div>
          )}
        </div>
      </main>

      {cartCount > 0 && (
        <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 99, maxWidth: '500px', margin: '0 auto' }}>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Abrir sacola de demonstração com ${cartCount} itens, subtotal ${formatBRL(cartSubtotal)}`}
            style={{
              width: '100%', backgroundColor: 'var(--color-primary)', color: '#fff', padding: '14px 20px',
              borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(133, 51, 76, 0.4)', fontWeight: 700, fontSize: '0.9375rem'
            }}
          >
            <span>{cartCount} {cartCount === 1 ? 'item' : 'itens'} na sacola de demonstração</span>
            <span>{formatBRL(cartSubtotal)}</span>
          </button>
        </div>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
