/**
 * Solicitações de Pedidos e Vendas Confirmadas da M_I Store
 */

export const INITIAL_REQUESTS = [
  {
    id: 'req-1042',
    code: '#MI-1042',
    customerId: 'cust-1',
    customerName: 'Maria Clara Silva',
    customerPhone: '83991238844',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua São Sebastião, 142 - Centro',
    status: 'new', // new, waiting_reply, confirmed, cancelled
    createdAt: '2026-10-14T09:15:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'delivery', // delivery, pickup
    deliveryFee: 5.00,
    items: [
      {
        productId: 'prod-1',
        productName: 'Sandália Rasteira Trançada Dourada',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
        size: '36',
        color: 'Dourado',
        quantity: 1,
        unitPrice: 89.90,
        estimatedCost: 48.00,
        preferredSupplierId: 'supp-1'
      },
      {
        productId: 'prod-2',
        productName: 'Bolsa Tiracolo Estruturada Matelassê',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Preto',
        quantity: 1,
        unitPrice: 129.90,
        estimatedCost: 68.00,
        preferredSupplierId: 'supp-2'
      }
    ],
    subtotal: 219.80,
    total: 224.80,
    notes: 'Precisa para o sábado à noite. Perguntou se dá para parcelar.'
  },
  {
    id: 'req-1041',
    code: '#MI-1041',
    customerId: 'cust-2',
    customerName: 'Ana Paula Medeiros',
    customerPhone: '83988451299',
    customerCity: 'Mamanguape',
    customerAddress: 'Av. Fernandes Vieira, 88',
    status: 'new',
    createdAt: '2026-10-14T08:30:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-9',
        productName: 'Conjunto Alfaiataria Colete e Calça Pantalona',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        size: 'M',
        color: 'Terracota',
        quantity: 1,
        unitPrice: 189.90,
        estimatedCost: 98.00,
        preferredSupplierId: 'supp-3'
      }
    ],
    subtotal: 189.90,
    total: 189.90,
    notes: 'Retira na sexta assim que chegar de João Pessoa.'
  },
  {
    id: 'req-1040',
    code: '#MI-1040',
    customerId: 'cust-3',
    customerName: 'Juliana Fernandes',
    customerPhone: '83993321155',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Conjunto Novo, Casa 24',
    status: 'waiting_reply',
    createdAt: '2026-10-13T17:40:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    items: [
      {
        productId: 'prod-6',
        productName: 'Papete Anatômica Tiras Pedrarias',
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
        size: '37',
        color: 'Champagne',
        quantity: 1,
        unitPrice: 119.90,
        estimatedCost: 62.00,
        preferredSupplierId: 'supp-1'
      }
    ],
    subtotal: 119.90,
    total: 124.90,
    notes: 'Edvania mandou áudio no WhatsApp tirando dúvida sobre a forma do calçado.'
  },
  {
    id: 'req-1039',
    code: '#MI-1039',
    customerId: 'cust-5',
    customerName: 'Patrícia Alencar',
    customerPhone: '83996558833',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Sítio Lagoa Seca',
    status: 'new',
    createdAt: '2026-10-13T16:10:00Z',
    channel: 'WhatsApp Direto',
    deliveryType: 'delivery',
    deliveryFee: 8.00,
    items: [
      {
        productId: 'prod-3',
        productName: 'Sandália Salto Bloco Tiras Finas Nude',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        size: '38',
        color: 'Nude',
        quantity: 1,
        unitPrice: 139.90,
        estimatedCost: 72.00,
        preferredSupplierId: 'supp-1'
      },
      {
        productId: 'prod-11',
        productName: 'Brinco Argola Orgânica Martelada Folheada',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Dourado',
        quantity: 1,
        unitPrice: 39.90,
        estimatedCost: 14.00,
        preferredSupplierId: 'supp-4'
      }
    ],
    subtotal: 179.80,
    total: 187.80,
    notes: 'Pede para levar junto quando for entregar as coisas da semana.'
  },
  {
    id: 'req-1038',
    code: '#MI-1038',
    customerId: 'cust-8',
    customerName: 'Camila Santos Viana',
    customerPhone: '83994556677',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua Bela Vista, 78',
    status: 'new',
    createdAt: '2026-10-13T14:20:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-5',
        productName: 'Bolsa Baguete Minimalista 90s',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Caramelo',
        quantity: 1,
        unitPrice: 99.90,
        estimatedCost: 50.00,
        preferredSupplierId: 'supp-2'
      }
    ],
    subtotal: 99.90,
    total: 99.90,
    notes: 'Avisar no WhatsApp assim que tiver confirmação de cor.'
  },
  {
    id: 'req-1037',
    code: '#MI-1037',
    customerId: 'cust-10',
    customerName: 'Beatriz Vasconcelos',
    customerPhone: '83996223388',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua Projetada A, 19',
    status: 'waiting_reply',
    createdAt: '2026-10-13T11:05:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-16',
        productName: 'Colar Choker Fita Laminada Banhada a Ouro 18k',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        size: 'Ajustável',
        color: 'Dourado Ouro 18k',
        quantity: 2,
        unitPrice: 54.90,
        estimatedCost: 20.00,
        preferredSupplierId: 'supp-4'
      }
    ],
    subtotal: 109.80,
    total: 109.80,
    notes: 'Quer uma para ela e outra de presente de aniversário para a irmã.'
  },
  {
    id: 'req-1036',
    code: '#MI-1036',
    customerId: 'cust-6',
    customerName: 'Fernanda Lima Rocha',
    customerPhone: '83981123344',
    customerCity: 'Mamanguape',
    customerAddress: 'Rua Marquês do Herval, 45',
    status: 'confirmed',
    createdAt: '2026-10-12T16:00:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    items: [
      {
        productId: 'prod-8',
        productName: 'Vestido Midi Canelado Manga Princesa',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        size: 'G',
        color: 'Fúcsia',
        quantity: 1,
        unitPrice: 119.90,
        estimatedCost: 58.00,
        preferredSupplierId: 'supp-3'
      }
    ],
    subtotal: 119.90,
    total: 124.90,
    notes: 'Confirmada pela Edvania, já virou a venda #VND-2029.'
  },
  {
    id: 'req-1035',
    code: '#MI-1035',
    customerId: 'cust-4',
    customerName: 'Carla Beatriz Ribeiro',
    customerPhone: '83987114422',
    customerCity: 'Rio Tinto',
    customerAddress: 'Vila Regina, 312',
    status: 'confirmed',
    createdAt: '2026-10-12T10:20:00Z',
    channel: 'WhatsApp Direto',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-12',
        productName: 'Scarpin Salto Médio Verniz Amêndoa',
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
        size: '37',
        color: 'Nude Amêndoa',
        quantity: 1,
        unitPrice: 149.90,
        estimatedCost: 75.00,
        preferredSupplierId: 'supp-1'
      }
    ],
    subtotal: 149.90,
    total: 149.90,
    notes: 'Confirmada, virou #VND-2028.'
  },
  {
    id: 'req-1034',
    code: '#MI-1034',
    customerId: 'cust-9',
    customerName: 'Jéssica Costa',
    customerPhone: '83987992211',
    customerCity: 'Guarabira',
    customerAddress: 'Bairro Primavera, Rua 12, 55',
    status: 'cancelled',
    cancellationReason: 'cliente desistiu',
    cancellationNote: 'Disse que o evento foi remarcado para o próximo mês.',
    createdAt: '2026-10-11T15:30:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'delivery',
    deliveryFee: 10.00,
    items: [
      {
        productId: 'prod-7',
        productName: 'Clutch Festa Rígida Madrepérola',
        image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Madrepérola Clara',
        quantity: 1,
        unitPrice: 149.90,
        estimatedCost: 78.00,
        preferredSupplierId: 'supp-4'
      }
    ],
    subtotal: 149.90,
    total: 159.90,
    notes: 'Cancelado amigavelmente.'
  },
  {
    id: 'req-1033',
    code: '#MI-1033',
    customerId: 'cust-7',
    customerName: 'Larissa Moura',
    customerPhone: '83998774411',
    customerCity: 'João Pessoa',
    customerAddress: 'Bessa, Rua Afonso Pena, 1020',
    status: 'confirmed',
    createdAt: '2026-10-11T11:00:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'delivery',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-2',
        productName: 'Bolsa Tiracolo Estruturada Matelassê',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Nude Rosé',
        quantity: 1,
        unitPrice: 129.90,
        estimatedCost: 68.00,
        preferredSupplierId: 'supp-2'
      }
    ],
    subtotal: 129.90,
    total: 129.90,
    notes: 'Confirmada, virou #VND-2027.'
  },
  {
    id: 'req-1032',
    code: '#MI-1032',
    customerId: 'cust-3',
    customerName: 'Juliana Fernandes',
    customerPhone: '83993321155',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Conjunto Novo, Casa 24',
    status: 'cancelled',
    cancellationReason: 'produto indisponível',
    cancellationNote: 'Fornecedor avisou que a cor verde militar esgotou no atacado.',
    createdAt: '2026-10-10T14:15:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    items: [
      {
        productId: 'prod-8',
        productName: 'Vestido Midi Canelado Manga Princesa',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        size: 'M',
        color: 'Verde Militar',
        quantity: 1,
        unitPrice: 119.90,
        estimatedCost: 58.00,
        preferredSupplierId: 'supp-3'
      }
    ],
    subtotal: 119.90,
    total: 119.90,
    notes: 'Avisada e oferecido fúcsia, preferiu aguardar reposição.'
  },
  {
    id: 'req-1031',
    code: '#MI-1031',
    customerId: 'cust-1',
    customerName: 'Maria Clara Silva',
    customerPhone: '83991238844',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua São Sebastião, 142',
    status: 'cancelled',
    cancellationReason: 'cliente não respondeu',
    cancellationNote: 'Enviada mensagem no WhatsApp para confirmar o tamanho do pé e não deu retorno em 48h.',
    createdAt: '2026-10-09T09:00:00Z',
    channel: 'Catálogo Online',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    items: [
      {
        productId: 'prod-4',
        productName: 'Mule Bico Fino Fivela Tartaruga',
        image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
        size: '36',
        color: 'Terracota',
        quantity: 1,
        unitPrice: 98.90,
        estimatedCost: 52.00,
        preferredSupplierId: 'supp-3'
      }
    ],
    subtotal: 98.90,
    total: 103.90,
    notes: 'Sem retorno.'
  }
]

export const INITIAL_SALES = [
  {
    id: 'sale-2030',
    code: '#VND-2030',
    originalRequestId: 'req-1042',
    customerId: 'cust-1',
    customerName: 'Maria Clara Silva',
    customerPhone: '83991238844',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua São Sebastião, 142 - Centro',
    createdAt: '2026-10-14T09:40:00Z',
    status: 'confirmed', // confirmed, awaiting_purchase, purchased, ready_available, in_delivery, delivered, finished
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    subtotal: 219.80,
    total: 224.80,
    estimatedCost: 116.00,
    actualCost: null,
    totalPaid: 100.00,
    balanceDue: 124.80, // Fiado parcial
    paymentPlan: 'partial', // full, partial, fiado_total
    dueDate: '2026-10-25',
    payments: [
      {
        id: 'pay-1',
        amount: 100.00,
        method: 'Pix',
        date: '2026-10-14T09:45:00Z',
        note: 'Entrada via Pix para garantir a compra em JP'
      }
    ],
    items: [
      {
        id: 'sitem-1',
        productId: 'prod-1',
        productName: 'Sandália Rasteira Trançada Dourada',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
        size: '36',
        color: 'Dourado',
        quantity: 1,
        unitPrice: 89.90,
        estimatedCost: 48.00,
        actualCost: null,
        supplierId: 'supp-1',
        shoppingStatus: 'pending' // pending, purchased, not_found, price_changed, substituted
      },
      {
        id: 'sitem-2',
        productId: 'prod-2',
        productName: 'Bolsa Tiracolo Estruturada Matelassê',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Preto',
        quantity: 1,
        unitPrice: 129.90,
        estimatedCost: 68.00,
        actualCost: null,
        supplierId: 'supp-2',
        shoppingStatus: 'pending'
      }
    ],
    notes: 'Cliente pediu para caprichar na embalagem.'
  },
  {
    id: 'sale-2029',
    code: '#VND-2029',
    originalRequestId: 'req-1036',
    customerId: 'cust-6',
    customerName: 'Fernanda Lima Rocha',
    customerPhone: '83981123344',
    customerCity: 'Mamanguape',
    customerAddress: 'Rua Marquês do Herval, 45',
    createdAt: '2026-10-13T10:00:00Z',
    status: 'awaiting_purchase',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    subtotal: 119.90,
    total: 124.90,
    estimatedCost: 58.00,
    actualCost: null,
    totalPaid: 124.90, // Pago 100%
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-2',
        amount: 124.90,
        method: 'Cartão de Crédito',
        date: '2026-10-13T10:05:00Z',
        note: 'Pago no link Stone'
      }
    ],
    items: [
      {
        id: 'sitem-3',
        productId: 'prod-8',
        productName: 'Vestido Midi Canelado Manga Princesa',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        size: 'G',
        color: 'Fúcsia',
        quantity: 1,
        unitPrice: 119.90,
        estimatedCost: 58.00,
        actualCost: null,
        supplierId: 'supp-3',
        shoppingStatus: 'pending'
      }
    ],
    notes: 'Mamanguape - entregar na recepção do colégio.'
  },
  {
    id: 'sale-2028',
    code: '#VND-2028',
    originalRequestId: 'req-1035',
    customerId: 'cust-4',
    customerName: 'Carla Beatriz Ribeiro',
    customerPhone: '83987114422',
    customerCity: 'Rio Tinto',
    customerAddress: 'Vila Regina, 312',
    createdAt: '2026-10-12T11:15:00Z',
    status: 'awaiting_purchase',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    subtotal: 149.90,
    total: 149.90,
    estimatedCost: 75.00,
    actualCost: null,
    totalPaid: 0.00, // Fiado total
    balanceDue: 149.90,
    paymentPlan: 'fiado_total',
    dueDate: '2026-10-28',
    payments: [],
    items: [
      {
        id: 'sitem-4',
        productId: 'prod-12',
        productName: 'Scarpin Salto Médio Verniz Amêndoa',
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
        size: '37',
        color: 'Nude Amêndoa',
        quantity: 1,
        unitPrice: 149.90,
        estimatedCost: 75.00,
        actualCost: null,
        supplierId: 'supp-1',
        shoppingStatus: 'pending'
      }
    ],
    notes: 'Vai pagar quando retirar pessoalmente.'
  },
  {
    id: 'sale-2027',
    code: '#VND-2027',
    originalRequestId: 'req-1033',
    customerId: 'cust-7',
    customerName: 'Larissa Moura',
    customerPhone: '83998774411',
    customerCity: 'João Pessoa',
    customerAddress: 'Bessa, Rua Afonso Pena, 1020',
    createdAt: '2026-10-11T12:00:00Z',
    status: 'awaiting_purchase',
    deliveryType: 'delivery',
    deliveryFee: 0.00,
    subtotal: 129.90,
    total: 129.90,
    estimatedCost: 68.00,
    actualCost: null,
    totalPaid: 129.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-3',
        amount: 129.90,
        method: 'Pix',
        date: '2026-10-11T12:05:00Z',
        note: 'Pix recebido de Larissa'
      }
    ],
    items: [
      {
        id: 'sitem-5',
        productId: 'prod-2',
        productName: 'Bolsa Tiracolo Estruturada Matelassê',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Nude Rosé',
        quantity: 1,
        unitPrice: 129.90,
        estimatedCost: 68.00,
        actualCost: null,
        supplierId: 'supp-2',
        shoppingStatus: 'pending'
      }
    ],
    notes: 'Entregar na casa dela em João Pessoa na quinta-feira após as compras.'
  },
  {
    id: 'sale-2026',
    code: '#VND-2026',
    originalRequestId: null,
    customerId: 'cust-5',
    customerName: 'Patrícia Alencar',
    customerPhone: '83996558833',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Sítio Lagoa Seca',
    createdAt: '2026-10-10T16:00:00Z',
    status: 'purchased',
    deliveryType: 'delivery',
    deliveryFee: 8.00,
    subtotal: 189.90,
    total: 197.90,
    estimatedCost: 98.00,
    actualCost: 95.00, // Saiu 3 reais mais barato no atacado!
    totalPaid: 100.00,
    balanceDue: 97.90, // Fiado restante
    paymentPlan: 'partial',
    dueDate: '2026-10-30',
    payments: [
      {
        id: 'pay-4',
        amount: 100.00,
        method: 'Dinheiro',
        date: '2026-10-10T16:10:00Z',
        note: 'Deu R$ 100 em mãos'
      }
    ],
    items: [
      {
        id: 'sitem-6',
        productId: 'prod-9',
        productName: 'Conjunto Alfaiataria Colete e Calça Pantalona',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        size: 'P',
        color: 'Areia',
        quantity: 1,
        unitPrice: 189.90,
        estimatedCost: 98.00,
        actualCost: 95.00,
        supplierId: 'supp-3',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Comprado na Moda Center JP.'
  },
  {
    id: 'sale-2025',
    code: '#VND-2025',
    originalRequestId: null,
    customerId: 'cust-3',
    customerName: 'Juliana Fernandes',
    customerPhone: '83993321155',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Conjunto Novo, Casa 24',
    createdAt: '2026-10-08T14:00:00Z',
    status: 'ready_available',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    subtotal: 119.90,
    total: 119.90,
    estimatedCost: 62.00,
    actualCost: 62.00,
    totalPaid: 50.00,
    balanceDue: 69.90, // Fiado
    paymentPlan: 'partial',
    dueDate: '2026-10-20',
    payments: [
      {
        id: 'pay-5',
        amount: 50.00,
        method: 'Pix',
        date: '2026-10-08T14:20:00Z',
        note: 'Entrada Pix'
      }
    ],
    items: [
      {
        id: 'sitem-7',
        productId: 'prod-6',
        productName: 'Papete Anatômica Tiras Pedrarias',
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
        size: '36',
        color: 'Preto/Cristal',
        quantity: 1,
        unitPrice: 119.90,
        estimatedCost: 62.00,
        actualCost: 62.00,
        supplierId: 'supp-1',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Produto conferido, limpo e embalado. Aguardando Juliana retirar.'
  },
  {
    id: 'sale-2024',
    code: '#VND-2024',
    originalRequestId: null,
    customerId: 'cust-8',
    customerName: 'Camila Santos Viana',
    customerPhone: '83994556677',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua Bela Vista, 78',
    createdAt: '2026-10-06T15:00:00Z',
    status: 'in_delivery',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    subtotal: 89.90,
    total: 94.90,
    estimatedCost: 48.00,
    actualCost: 48.00,
    totalPaid: 94.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-6',
        amount: 94.90,
        method: 'Pix',
        date: '2026-10-06T15:15:00Z',
        note: 'Pago total com taxa de entrega'
      }
    ],
    items: [
      {
        id: 'sitem-8',
        productId: 'prod-1',
        productName: 'Sandália Rasteira Trançada Dourada',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
        size: '37',
        color: 'Bronze',
        quantity: 1,
        unitPrice: 89.90,
        estimatedCost: 48.00,
        actualCost: 48.00,
        supplierId: 'supp-1',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Edvania saiu para entregar agora à tarde.'
  },
  {
    id: 'sale-2023',
    code: '#VND-2023',
    originalRequestId: null,
    customerId: 'cust-2',
    customerName: 'Ana Paula Medeiros',
    customerPhone: '83988451299',
    customerCity: 'Mamanguape',
    customerAddress: 'Av. Fernandes Vieira, 88',
    createdAt: '2026-10-05T09:30:00Z',
    status: 'delivered',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    subtotal: 149.90,
    total: 149.90,
    estimatedCost: 74.00,
    actualCost: 74.00,
    totalPaid: 149.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-7',
        amount: 149.90,
        method: 'Cartão de Débito',
        date: '2026-10-07T17:00:00Z',
        note: 'Passou na maquininha na retirada'
      }
    ],
    items: [
      {
        id: 'sitem-9',
        productId: 'prod-17',
        productName: 'Vestido Longo Floral Três Marias Decote V',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
        size: 'M',
        color: 'Floral Fundo Off',
        quantity: 1,
        unitPrice: 149.90,
        estimatedCost: 74.00,
        actualCost: 74.00,
        supplierId: 'supp-3',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Entregue com sucesso, cliente elogiou bastante.'
  },
  {
    id: 'sale-2022',
    code: '#VND-2022',
    originalRequestId: null,
    customerId: 'cust-10',
    customerName: 'Beatriz Vasconcelos',
    customerPhone: '83996223388',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua Projetada A, 19',
    createdAt: '2026-10-04T11:20:00Z',
    status: 'finished',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    subtotal: 139.90,
    total: 139.90,
    estimatedCost: 70.00,
    actualCost: 70.00,
    totalPaid: 139.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-8',
        amount: 139.90,
        method: 'Pix',
        date: '2026-10-04T11:25:00Z',
        note: 'Pix à vista'
      }
    ],
    items: [
      {
        id: 'sitem-10',
        productId: 'prod-13',
        productName: 'Bolsa Tote Shopper Espaçosa com Necessaire',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        size: 'Grande',
        color: 'Caramelo Café',
        quantity: 1,
        unitPrice: 139.90,
        estimatedCost: 70.00,
        actualCost: 70.00,
        supplierId: 'supp-2',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Venda finalizada.'
  },
  {
    id: 'sale-2021',
    code: '#VND-2021',
    originalRequestId: null,
    customerId: 'cust-1',
    customerName: 'Maria Clara Silva',
    customerPhone: '83991238844',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Rua São Sebastião, 142',
    createdAt: '2026-09-28T10:00:00Z',
    status: 'finished',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    subtotal: 119.90,
    total: 124.90,
    estimatedCost: 62.00,
    actualCost: 62.00,
    totalPaid: 124.90,
    balanceDue: 0.00,
    paymentPlan: 'partial',
    dueDate: null,
    payments: [
      {
        id: 'pay-9',
        amount: 60.00,
        method: 'Pix',
        date: '2026-09-28T10:15:00Z',
        note: 'Entrada Pix'
      },
      {
        id: 'pay-10',
        amount: 64.90,
        method: 'Dinheiro',
        date: '2026-10-02T16:00:00Z',
        note: 'Quitou o saldo em dinheiro'
      }
    ],
    items: [
      {
        id: 'sitem-11',
        productId: 'prod-6',
        productName: 'Papete Anatômica Tiras Pedrarias',
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
        size: '36',
        color: 'Branco',
        quantity: 1,
        unitPrice: 119.90,
        estimatedCost: 62.00,
        actualCost: 62.00,
        supplierId: 'supp-1',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Tudo quitado.'
  },
  {
    id: 'sale-2020',
    code: '#VND-2020',
    originalRequestId: null,
    customerId: 'cust-5',
    customerName: 'Patrícia Alencar',
    customerPhone: '83996558833',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Sítio Lagoa Seca',
    createdAt: '2026-09-25T14:00:00Z',
    status: 'delivered',
    deliveryType: 'delivery',
    deliveryFee: 8.00,
    subtotal: 239.80,
    total: 247.80,
    estimatedCost: 124.00,
    actualCost: 124.00,
    totalPaid: 150.00,
    balanceDue: 97.80, // Fiado restante
    paymentPlan: 'partial',
    dueDate: '2026-10-30',
    payments: [
      {
        id: 'pay-11',
        amount: 150.00,
        method: 'Pix',
        date: '2026-09-25T14:30:00Z',
        note: 'Entrada Pix'
      }
    ],
    items: [
      {
        id: 'sitem-12',
        productId: 'prod-3',
        productName: 'Sandália Salto Bloco Tiras Finas Nude',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        size: '38',
        color: 'Caramelo',
        quantity: 1,
        unitPrice: 139.90,
        estimatedCost: 72.00,
        actualCost: 72.00,
        supplierId: 'supp-1',
        shoppingStatus: 'purchased'
      },
      {
        id: 'sitem-13',
        productId: 'prod-5',
        productName: 'Bolsa Baguete Minimalista 90s',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        size: 'Único',
        color: 'Preto',
        quantity: 1,
        unitPrice: 99.90,
        estimatedCost: 52.00,
        actualCost: 52.00,
        supplierId: 'supp-2',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Patrícia combinou de acertar os R$ 97,80 no final do mês.'
  },
  {
    id: 'sale-2019',
    code: '#VND-2019',
    originalRequestId: null,
    customerId: 'cust-9',
    customerName: 'Jéssica Costa',
    customerPhone: '83987992211',
    customerCity: 'Guarabira',
    customerAddress: 'Bairro Primavera, Rua 12, 55',
    createdAt: '2026-09-20T16:00:00Z',
    status: 'finished',
    deliveryType: 'delivery',
    deliveryFee: 10.00,
    subtotal: 129.90,
    total: 139.90,
    estimatedCost: 65.00,
    actualCost: 65.00,
    totalPaid: 139.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-12',
        amount: 139.90,
        method: 'Pix',
        date: '2026-09-20T16:20:00Z',
        note: 'Pix total com entrega'
      }
    ],
    items: [
      {
        id: 'sitem-14',
        productId: 'prod-19',
        productName: 'Tênis Casual Slip-on Couro Ecológico',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
        size: '37',
        color: 'Branco Clean',
        quantity: 1,
        unitPrice: 129.90,
        estimatedCost: 65.00,
        actualCost: 65.00,
        supplierId: 'supp-1',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Finalizada com sucesso.'
  },
  {
    id: 'sale-2018',
    code: '#VND-2018',
    originalRequestId: null,
    customerId: 'cust-4',
    customerName: 'Carla Beatriz Ribeiro',
    customerPhone: '83987114422',
    customerCity: 'Rio Tinto',
    customerAddress: 'Vila Regina, 312',
    createdAt: '2026-09-18T11:00:00Z',
    status: 'finished',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    subtotal: 98.90,
    total: 98.90,
    estimatedCost: 52.00,
    actualCost: 50.00, // Conseguiu R$ 2 de desconto
    totalPaid: 98.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-13',
        amount: 98.90,
        method: 'Pix',
        date: '2026-09-18T11:05:00Z',
        note: 'Pix total'
      }
    ],
    items: [
      {
        id: 'sitem-15',
        productId: 'prod-4',
        productName: 'Mule Bico Fino Fivela Tartaruga',
        image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
        size: '37',
        color: 'Off-White',
        quantity: 1,
        unitPrice: 98.90,
        estimatedCost: 52.00,
        actualCost: 50.00,
        supplierId: 'supp-3',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Finalizada.'
  },
  {
    id: 'sale-2017',
    code: '#VND-2017',
    originalRequestId: null,
    customerId: 'cust-2',
    customerName: 'Ana Paula Medeiros',
    customerPhone: '83988451299',
    customerCity: 'Mamanguape',
    customerAddress: 'Av. Fernandes Vieira, 88',
    createdAt: '2026-09-15T15:30:00Z',
    status: 'finished',
    deliveryType: 'pickup',
    deliveryFee: 0.00,
    subtotal: 109.90,
    total: 109.90,
    estimatedCost: 54.00,
    actualCost: 54.00,
    totalPaid: 109.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-14',
        amount: 109.90,
        method: 'Cartão de Débito',
        date: '2026-09-17T18:00:00Z',
        note: 'Débito presencial'
      }
    ],
    items: [
      {
        id: 'sitem-16',
        productId: 'prod-18',
        productName: 'Bolsa Carteiro Crossbody Nylon Matelassê',
        image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80',
        size: 'Médio',
        color: 'Preto Fosco',
        quantity: 1,
        unitPrice: 109.90,
        estimatedCost: 54.00,
        actualCost: 54.00,
        supplierId: 'supp-2',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Finalizada.'
  },
  {
    id: 'sale-2016',
    code: '#VND-2016',
    originalRequestId: null,
    customerId: 'cust-3',
    customerName: 'Juliana Fernandes',
    customerPhone: '83993321155',
    customerCity: 'Cuité de Mamanguape',
    customerAddress: 'Conjunto Novo, Casa 24',
    createdAt: '2026-09-12T10:00:00Z',
    status: 'finished',
    deliveryType: 'delivery',
    deliveryFee: 5.00,
    subtotal: 94.90,
    total: 99.90,
    estimatedCost: 49.00,
    actualCost: 49.00,
    totalPaid: 99.90,
    balanceDue: 0.00,
    paymentPlan: 'full',
    dueDate: null,
    payments: [
      {
        id: 'pay-15',
        amount: 99.90,
        method: 'Pix',
        date: '2026-09-12T10:10:00Z',
        note: 'Pix total'
      }
    ],
    items: [
      {
        id: 'sitem-17',
        productId: 'prod-15',
        productName: 'Sandália Rasteira Pedrarias Coloridas Boho',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
        size: '36',
        color: 'Palha Natural',
        quantity: 1,
        unitPrice: 94.90,
        estimatedCost: 49.00,
        actualCost: 49.00,
        supplierId: 'supp-1',
        shoppingStatus: 'purchased'
      }
    ],
    notes: 'Finalizada.'
  }
]
