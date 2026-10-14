import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { formatBRL } from '../../utils/formatters'
import { useApp } from '../../context/AppContext'
import { ShoppingBag, Sparkles, Check, Info, Calendar } from 'lucide-react'

export function ProductModal({ product, isOpen, onClose, onOpenCart }) {
  const { addToCart } = useApp()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único')
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Padrão')
      setQuantity(1)
    }
  }, [product])

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
    onClose()
  }

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
    onClose()
    if (onOpenCart) onOpenCart()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} maxWidth="680px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Galeria de Fotos */}
        <div>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#f5f0ec',
            border: '1px solid var(--border-subtle)'
          }}>
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Miniaturas se houver mais de uma */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImage === idx ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    opacity: selectedImage === idx ? 1 : 0.6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Aviso sobre compras semanais */}
          <div style={{
            background: 'var(--color-gold-light)',
            border: '1px solid #ebd8be',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            marginTop: '14px',
            display: 'flex',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#8c5d1c'
          }}>
            <Calendar size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Como funciona a encomenda?</strong>
              <p style={{ margin: 0, marginTop: '2px', color: '#684515' }}>
                Edvania viaja semanalmente a João Pessoa para comprar os produtos escolhidos nos melhores atacados.
              </p>
            </div>
          </div>
        </div>

        {/* Informações e Seletores */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-gold">Sob Encomenda</span>
              <span className="badge badge-neutral">{product.category}</span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {formatBRL(product.price)}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                à vista ou facilitado
              </span>
            </div>

            {product.description && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                {product.description}
              </p>
            )}

            {/* Seleção de Tamanho */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Único' && (
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  Tamanho: <strong style={{ color: 'var(--text-primary)' }}>{selectedSize}</strong>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: selectedSize === size ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        background: selectedSize === size ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                        color: selectedSize === size ? 'var(--color-primary)' : 'var(--text-primary)',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seleção de Cor */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  Cor: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor}</strong>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        border: selectedColor === color ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        background: selectedColor === color ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                        color: selectedColor === color ? 'var(--color-primary)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {selectedColor === color && <Check size={12} />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seletor de Quantidade */}
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label">Quantidade</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '6px 14px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.9375rem', minWidth: '32px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ padding: '6px 14px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <Button
              variant="primary"
              size="lg"
              icon={ShoppingBag}
              onClick={handleAddToCart}
              style={{ width: '100%' }}
            >
              Adicionar à Encomenda • {formatBRL(product.price * quantity)}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleBuyNow}
              style={{ width: '100%' }}
            >
              Adicionar e Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
