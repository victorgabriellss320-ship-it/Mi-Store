/**
 * Gerador de códigos para solicitações e vendas
 */

export function generateOrderCode() {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `#MI-${num}`
}

export function generateSaleCode() {
  const num = Math.floor(2000 + Math.random() * 8000)
  return `#VND-${num}`
}
