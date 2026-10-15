export function toPublicCatalogProducts(products) {
  if (!Array.isArray(products)) return []

  return products
    .filter(product => product && typeof product === 'object' && product.status === 'active')
    .map(product => ({
      id: product.id,
      name: typeof product.name === 'string' && product.name.trim() ? product.name : 'Produto sem nome',
      category: typeof product.category === 'string' && product.category.trim() ? product.category : 'Sem categoria',
      price: Number.isFinite(product.price) && product.price > 0 ? product.price : null,
      description: typeof product.description === 'string' ? product.description : '',
      images: Array.isArray(product.images) ? product.images.filter(image => typeof image === 'string' && image.trim()) : [],
      sizes: Array.isArray(product.sizes) ? product.sizes.filter(value => typeof value === 'string' && value.trim()) : [],
      colors: Array.isArray(product.colors) ? product.colors.filter(value => typeof value === 'string' && value.trim()) : []
    }))
}
