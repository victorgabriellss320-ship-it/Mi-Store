import React, { useEffect, useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { formatBRL } from '../../utils/formatters'
import { useApp } from '../../context/AppContext'
import { ShoppingBag, Check } from 'lucide-react'

export function ProductModal({ product, isOpen, onClose, onOpenCart }) {
  const { addToCart } = useApp()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [imageUnavailable, setImageUnavailable] = useState(false)

  const images = Array.isArray(product?.images) ? product.images : []
  const sizes = Array.isArray(product?.sizes) ? product.sizes : []
  const colors = Array.isArray(product?.colors) ? product.colors : []
  const priceAvailable = Number.isFinite(product?.price) && product.price > 0
  const currentImage = images[selectedImage] || ''
  const canAdd = priceAvailable && Number.isInteger(quantity) && quantity > 0 &&
    (!sizes.length || Boolean(selectedSize)) && (!colors.length || Boolean(selectedColor))

  useEffect(() => {
    if (!product) return
    setSelectedImage(0)
    setSelectedSize(Array.isArray(product.sizes) ? product.sizes[0] || '' : '')
    setSelectedColor(Array.isArray(product.colors) ? product.colors[0] || '' : '')
    setQuantity(1)
    setImageUnavailable(false)
  }, [product, isOpen])

  if (!product) return null

  const addSelection = (openCart = false) => {
    if (!canAdd) return
    addToCart(product, selectedSize || null, selectedColor || null, quantity)
    onClose()
    if (openCart && onOpenCart) onOpenCart()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} maxWidth="680px">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div>
          <div style={{
            position: 'relative', width: '100%', paddingTop: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            backgroundColor: '#f5f0ec', border: '1px solid var(--border-subtle)'
          }}>
            {currentImage && !imageUnavailable ? (
              <img
                src={currentImage}
                alt=""
                onError={() => setImageUnavailable(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div role="img" aria-label={`Foto de demonstração não disponível para ${product.name}`} style={{
                position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '24px',
                textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', background: 'var(--bg-subtle)'
              }}>
                Foto de demonstração não disponível
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div aria-label="Fotos de exemplo" style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Ver foto de exemplo ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  onClick={() => { setSelectedImage(index); setImageUnavailable(false) }}
                  style={{
                    width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0,
                    border: selectedImage === index ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    opacity: selectedImage === index ? 1 : 0.6
                  }}
                >
                  <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          <div role="note" style={{
            background: '#FFFAF0', border: '1px solid #E8D7B0', borderRadius: 'var(--radius-md)',
            padding: '10px 12px', marginTop: '14px', fontSize: '0.75rem', color: '#624D29', lineHeight: 1.45
          }}>
            Item, preço e variações ilustrativos. A disponibilidade e as condições precisam ser confirmadas com a loja. Esta tela não cria pedido nem reserva.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-gold">Exemplo</span>
              <span className="badge badge-neutral">{product.category}</span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              {priceAvailable ? (
                <>
                  <span style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatBRL(product.price)}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '6px' }}>preço demonstrativo</span>
                </>
              ) : (
                <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>Preço não informado</span>
              )}
            </div>

            {product.description && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                {product.description}
              </p>
            )}

            {sizes.length > 0 && !(sizes.length === 1 && sizes[0] === 'Único') && (
              <div style={{ marginBottom: '14px' }}>
                <div className="form-label" id="demo-product-sizes-label">Tamanho de exemplo</div>
                <div role="group" aria-labelledby="demo-product-sizes-label" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600,
                        border: selectedSize === size ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        background: selectedSize === size ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                        color: selectedSize === size ? 'var(--color-primary)' : 'var(--text-primary)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div className="form-label" id="demo-product-colors-label">Cor de exemplo</div>
                <div role="group" aria-labelledby="demo-product-colors-label" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600,
                        border: selectedColor === color ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        background: selectedColor === color ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                        color: selectedColor === color ? 'var(--color-primary)' : 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {selectedColor === color && <Check size={12} aria-hidden="true" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label className="form-label" htmlFor="demo-product-quantity">Quantidade de exemplo</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantity(value => Math.max(1, value - 1))} style={{ padding: '6px 14px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>−</button>
                <output id="demo-product-quantity" aria-live="polite" style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.9375rem', minWidth: '32px', textAlign: 'center' }}>{quantity}</output>
                <button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity(value => value + 1)} style={{ padding: '6px 14px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>+</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <Button variant="primary" size="lg" icon={ShoppingBag} onClick={() => addSelection(false)} disabled={!canAdd} style={{ width: '100%' }}>
              {priceAvailable ? `Adicionar à sacola • ${formatBRL(product.price * quantity)}` : 'Preço não informado'}
            </Button>
            <Button variant="secondary" size="md" onClick={() => addSelection(true)} disabled={!canAdd} style={{ width: '100%' }}>
              Adicionar e ver sacola
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
