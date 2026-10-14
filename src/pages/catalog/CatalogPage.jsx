import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { CatalogHeader } from '../../components/catalog/CatalogHeader'
import { ProductCard } from '../../components/catalog/ProductCard'
import { ProductModal } from '../../components/catalog/ProductModal'
import { CartDrawer } from '../../components/catalog/CartDrawer'
import { OrderSuccessModal } from '../../components/catalog/OrderSuccessModal'
import { Search, Sparkles, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { formatBRL } from '../../utils/formatters'

export function CatalogPage() {
  const { products, cart } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  // Extrai categorias dinâmicas
  const categories = useMemo(() => {
    const cats = ['Todos']
    products.forEach(p => {
      if (p.status === 'active' && !cats.includes(p.category)) {
        cats.push(p.category)
      }
    })
    return cats
  }, [products])

  // Filtra produtos visíveis
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'active') return false

      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.colors && p.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))

      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchQuery])

  const handleOpenProduct = (product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleOrderPlaced = (result) => {
    setOrderResult(result)
    setIsSuccessModalOpen(true)
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Cabeçalho do Catálogo */}
      <CatalogHeader onOpenCart={() => setIsCartOpen(true)} />

      {/* Hero Banner Feminino & Sofisticado */}
      <section style={{
        background: 'linear-gradient(135deg, #f5ebeb 0%, #faeef2 50%, #ffffff 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '36px 0 28px 0'
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
              <Sparkles size={14} /> Curadoria Semanal M_I Store
            </span>
            <h2 style={{
              fontSize: '2.125rem',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '12px'
            }}>
              Calçados, Bolsas & Looks Escolhidos a Dedo em João Pessoa
            </h2>
            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}>
              Você escolhe seus modelos favoritos até quarta-feira, Edvania viaja quinta para garantir as peças direto nos fabricantes e você recebe no final de semana!
            </p>

            {/* Diferenciais em Pílulas */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Garantia de Qualidade</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <RefreshCw size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Novidades Toda Semana</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <Truck size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Entrega ou Retirada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Busca e Categorias */}
      <section style={{
        padding: '20px 0',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: '95px',
        zIndex: 80
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {/* Campo de Busca */}
            <div style={{ position: 'relative', maxWidth: '480px' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar por sapatilha, salto, bolsa, cor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface-subtle)',
                    padding: '2px 6px',
                    borderRadius: '999px'
                  }}
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Categorias em Chips Horizontais */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              {categories.map(cat => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
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
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Produtos */}
      <main style={{ flex: 1, padding: '24px 0 60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedCategory === 'Todos' ? 'Todos os Produtos' : selectedCategory}
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '8px' }}>
                ({filteredProducts.length} itens disponíveis para encomenda)
              </span>
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <Search size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Nenhum produto encontrado</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Tente buscar com outro termo ou selecione a categoria "Todos".
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleOpenProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Barra Flutuante de Carrinho para Mobile */}
      {cartCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 99,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '14px 20px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(133, 51, 76, 0.4)',
              fontWeight: 700,
              fontSize: '0.9375rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                width: '26px',
                height: '26px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8125rem'
              }}>
                {cartCount}
              </span>
              <span>Ver Minha Encomenda</span>
            </div>
            <span>{formatBRL(cartSubtotal)}</span>
          </button>
        </div>
      )}

      {/* Modais e Drawers */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderSuccessModal
        result={orderResult}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  )
}
