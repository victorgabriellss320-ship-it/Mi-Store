/**
 * Dados da Compra Semanal em João Pessoa
 * Uma das telas mais importantes para Edvania!
 */

export const INITIAL_CURRENT_TRIP = {
  id: 'trip-current',
  scheduledDate: '2026-10-16', // Próxima quinta/sexta
  status: 'planned', // planned, in_progress, completed
  notes: 'Saída às 06:30 de Cuité de Mamanguape. Chegar primeiro na JP Calçados para garantir os números 36 e 37.',
  budgetExpected: 350.00,
  
  // Itens da compra da semana vinculados às vendas confirmadas / em espera
  items: [
    {
      id: 'trip-item-1',
      saleId: 'sale-2030',
      saleCode: '#VND-2030',
      customerName: 'Maria Clara Silva',
      productId: 'prod-1',
      productName: 'Sandália Rasteira Trançada Dourada',
      image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
      size: '36',
      color: 'Dourado',
      quantity: 1,
      salePrice: 89.90,
      estimatedCost: 48.00,
      actualCost: null,
      supplierId: 'supp-1',
      supplierName: 'JP Calçados Atacado',
      status: 'pending', // pending, purchased, not_found, price_changed, substituted
      notes: 'Conferir se a tira está bem firme no calcanhar.'
    },
    {
      id: 'trip-item-2',
      saleId: 'sale-2030',
      saleCode: '#VND-2030',
      customerName: 'Maria Clara Silva',
      productId: 'prod-2',
      productName: 'Bolsa Tiracolo Estruturada Matelassê',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      size: 'Único',
      color: 'Preto',
      quantity: 1,
      salePrice: 129.90,
      estimatedCost: 68.00,
      actualCost: null,
      supplierId: 'supp-2',
      supplierName: 'Bella Bolsas & Acessórios',
      status: 'pending',
      notes: 'Corrente grafite, não dourada.'
    },
    {
      id: 'trip-item-3',
      saleId: 'sale-2029',
      saleCode: '#VND-2029',
      customerName: 'Fernanda Lima Rocha',
      productId: 'prod-8',
      productName: 'Vestido Midi Canelado Manga Princesa',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      size: 'G',
      color: 'Fúcsia',
      quantity: 1,
      salePrice: 119.90,
      estimatedCost: 58.00,
      actualCost: null,
      supplierId: 'supp-3',
      supplierName: 'Moda Center JP',
      status: 'pending',
      notes: 'Dona Socorro disse que guardou uma peça G no cabideiro.'
    },
    {
      id: 'trip-item-4',
      saleId: 'sale-2028',
      saleCode: '#VND-2028',
      customerName: 'Carla Beatriz Ribeiro',
      productId: 'prod-12',
      productName: 'Scarpin Salto Médio Verniz Amêndoa',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
      size: '37',
      color: 'Nude Amêndoa',
      quantity: 1,
      salePrice: 149.90,
      estimatedCost: 75.00,
      actualCost: null,
      supplierId: 'supp-1',
      supplierName: 'JP Calçados Atacado',
      status: 'pending',
      notes: 'Verniz impecável sem marcas.'
    },
    {
      id: 'trip-item-5',
      saleId: 'sale-2027',
      saleCode: '#VND-2027',
      customerName: 'Larissa Moura',
      productId: 'prod-2',
      productName: 'Bolsa Tiracolo Estruturada Matelassê',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      size: 'Único',
      color: 'Nude Rosé',
      quantity: 1,
      salePrice: 129.90,
      estimatedCost: 68.00,
      actualCost: null,
      supplierId: 'supp-2',
      supplierName: 'Bella Bolsas & Acessórios',
      status: 'pending',
      notes: 'Tom Nude Rosé suave.'
    }
  ]
}

export const INITIAL_PAST_TRIPS = [
  {
    id: 'trip-past-1',
    scheduledDate: '2026-10-09',
    status: 'completed',
    totalItems: 8,
    totalSpent: 489.00,
    totalSalesValue: 980.00,
    profitRealized: 491.00,
    suppliersVisited: ['JP Calçados', 'Moda Center JP', 'Bella Bolsas'],
    expenses: 65.00 // combustível + lanche
  },
  {
    id: 'trip-past-2',
    scheduledDate: '2026-10-02',
    status: 'completed',
    totalItems: 11,
    totalSpent: 640.00,
    totalSalesValue: 1280.00,
    profitRealized: 640.00,
    suppliersVisited: ['JP Calçados', 'Bella Bolsas', 'Mix Importados'],
    expenses: 70.00
  }
]
