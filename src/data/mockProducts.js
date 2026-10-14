/**
 * 20 Produtos autênticos da M_I Store
 * Calçados, Bolsas, Acessórios e Looks Femininos sob encomenda
 */

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Sandália Rasteira Trançada Dourada',
    category: 'Calçados',
    price: 89.90,
    cost: 48.00,
    isPreOrder: true,
    featured: true,
    status: 'active', // active, hidden, archived
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sandália rasteira com tiras delicadamente trançadas em acabamento metalizado dourado. Palmilha ultra acolchoada para uso o dia todo. Perfeita para eventos diurnos ou passeios.',
    sizes: ['35', '36', '37', '38', '39'],
    colors: ['Dourado', 'Prata', 'Bronze'],
    preferredSupplierId: 'supp-1',
    alternativeSupplierIds: ['supp-3'],
    internalNotes: 'No box 14 da JP Calçados costuma sair a R$ 45 acima de 3 pares.'
  },
  {
    id: 'prod-2',
    name: 'Bolsa Tiracolo Estruturada Matelassê',
    category: 'Bolsas',
    price: 129.90,
    cost: 68.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bolsa média estruturada em acabamento matelassê com alça transversal em corrente grafite e fechamento em fecho torniquete. Espaço interno inteligente.',
    sizes: ['Único'],
    colors: ['Preto', 'Nude Rosé', 'Off-White'],
    preferredSupplierId: 'supp-2',
    alternativeSupplierIds: ['supp-4'],
    internalNotes: 'Bella Atacado tem o melhor acabamento nessa corrente.'
  },
  {
    id: 'prod-3',
    name: 'Sandália Salto Bloco Tiras Finas Nude',
    category: 'Calçados',
    price: 139.90,
    cost: 72.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Salto bloco de 6,5cm com estabilidade impecável. Tiras finas no cabedal e amarração no tornozelo. Tom nude neutro versátil.',
    sizes: ['34', '35', '36', '37', '38', '39'],
    colors: ['Nude', 'Caramelo', 'Preto'],
    preferredSupplierId: 'supp-1',
    alternativeSupplierIds: ['supp-3'],
    internalNotes: 'Muito procurado para formaturas e cultos.'
  },
  {
    id: 'prod-4',
    name: 'Mule Bico Fino Fivela Tartaruga',
    category: 'Calçados',
    price: 98.90,
    cost: 52.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Mule elegante sem salto, bico fino alongado com fivela decorativa marmorizada. Praticidade e elegância para o dia a dia.',
    sizes: ['35', '36', '37', '38', '39'],
    colors: ['Off-White', 'Preto', 'Terracota'],
    preferredSupplierId: 'supp-3',
    alternativeSupplierIds: ['supp-1'],
    internalNotes: 'Pedir 1 número maior se a cliente tiver pé largo.'
  },
  {
    id: 'prod-5',
    name: 'Bolsa Baguete Minimalista 90s',
    category: 'Bolsas',
    price: 99.90,
    cost: 50.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A clássica bolsa baguete de ombro com alça curta e fechamento em zíper. Visual limpo e contemporâneo.',
    sizes: ['Único'],
    colors: ['Verde Oliva', 'Preto', 'Caramelo', 'Bege'],
    preferredSupplierId: 'supp-2',
    alternativeSupplierIds: ['supp-4'],
    internalNotes: 'Tendência forte no Instagram da loja.'
  },
  {
    id: 'prod-6',
    name: 'Papete Anatômica Tiras Pedrarias',
    category: 'Calçados',
    price: 119.90,
    cost: 62.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Solado flatform anatômico e tiras revestidas em manta de cristais finos. Conforto absoluto com brilho glamouroso.',
    sizes: ['34', '35', '36', '37', '38', '39'],
    colors: ['Preto/Cristal', 'Champagne', 'Branco'],
    preferredSupplierId: 'supp-1',
    alternativeSupplierIds: ['supp-3'],
    internalNotes: 'Conferir se os strass estão bem colados na hora de retirar.'
  },
  {
    id: 'prod-7',
    name: 'Clutch Festa Rígida Madrepérola',
    category: 'Bolsas',
    price: 149.90,
    cost: 78.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bolsa de festa rígida em efeito madrepérola com fecho em pedra lapidada e alça de corrente removível.',
    sizes: ['Único'],
    colors: ['Madrepérola Clara', 'Dourada'],
    preferredSupplierId: 'supp-4',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Mix Importados tem a pronta entrega no 2º andar.'
  },
  {
    id: 'prod-8',
    name: 'Vestido Midi Canelado Manga Princesa',
    category: 'Vestuário',
    price: 119.90,
    cost: 58.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vestido midi em malha canelada encorpada com elastano de alta densidade (não fica transparente), fenda lateral discreta e manga levemente bufante.',
    sizes: ['M (38-40)', 'G (42-44)', 'GG (46)'],
    colors: ['Fúcsia', 'Preto', 'Azul Marinho', 'Verde Militar'],
    preferredSupplierId: 'supp-3',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Comprar sempre no Moda Center JP com dona Socorro.'
  },
  {
    id: 'prod-9',
    name: 'Conjunto Alfaiataria Colete e Calça Pantalona',
    category: 'Vestuário',
    price: 189.90,
    cost: 98.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Conjunto sofisticado em tecido crepe alfaiataria com colete forrado e calça pantalona cintura alta com pregas frontais e bolsos faca.',
    sizes: ['P', 'M', 'G'],
    colors: ['Terracota', 'Areia', 'Preto'],
    preferredSupplierId: 'supp-3',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Peça nobre, cliente ama o corte da calça.'
  },
  {
    id: 'prod-10',
    name: 'Cinto Feminino Couro Sintético Fivela Duplo G',
    category: 'Acessórios',
    price: 45.00,
    cost: 18.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Cinto médio versátil com fivela dourada antioxidante. Perfeito para marcar cintura em vestidos ou compor com jeans.',
    sizes: ['Tamanho Único (105cm)'],
    colors: ['Preto', 'Caramelo', 'Branco'],
    preferredSupplierId: 'supp-4',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Ótimo para venda casada e aumento de ticket.'
  },
  {
    id: 'prod-11',
    name: 'Brinco Argola Orgânica Martelada Folheada',
    category: 'Acessórios',
    price: 39.90,
    cost: 14.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Argola maxi com formato ondulado orgânico martelado. Banho com verniz italiano hipoalergênico.',
    sizes: ['Único'],
    colors: ['Dourado'],
    preferredSupplierId: 'supp-4',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Comprar cartela fechada se tiver mais de 4 pedidos.'
  },
  {
    id: 'prod-12',
    name: 'Scarpin Salto Médio Verniz Amêndoa',
    category: 'Calçados',
    price: 149.90,
    cost: 75.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Scarpin clássico em verniz acetinado com salto taça 7cm e palmilha com gota de conforto sob os metatarsos.',
    sizes: ['35', '36', '37', '38', '39'],
    colors: ['Nude Amêndoa', 'Preto Verniz', 'Vermelho'],
    preferredSupplierId: 'supp-1',
    alternativeSupplierIds: ['supp-3'],
    internalNotes: 'JP Calçados - pedir linha conforto.'
  },
  {
    id: 'prod-13',
    name: 'Bolsa Tote Shopper Espaçosa com Necessaire',
    category: 'Bolsas',
    price: 139.90,
    cost: 70.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bolsa grande estilo sacola cabe notebook e caderno. Acompanha bolsinha/necessaire interna removível.',
    sizes: ['Grande'],
    colors: ['Caramelo Café', 'Preto', 'Gelo'],
    preferredSupplierId: 'supp-2',
    alternativeSupplierIds: ['supp-4'],
    internalNotes: 'Muito vendida para professoras e advogadas.'
  },
  {
    id: 'prod-14',
    name: 'Camisa Social Feminina Viscose Acetinada',
    category: 'Vestuário',
    price: 99.90,
    cost: 48.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camisa manga longa com toque suave de seda, botões em madrepérola e caimento impecável que não amassa fácil.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco Neve', 'Rosa Seco', 'Verde Sage'],
    preferredSupplierId: 'supp-3',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Moda Center JP - setor B corredor 3.'
  },
  {
    id: 'prod-15',
    name: 'Sandália Rasteira Pedrarias Coloridas Boho',
    category: 'Calçados',
    price: 94.90,
    cost: 49.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rasteirinha delicada com mix de pedras em tons pastel turquesa, âmbar e quartzo rosa sobre cordão cru.',
    sizes: ['35', '36', '37', '38'],
    colors: ['Palha Natural', 'Dourado'],
    preferredSupplierId: 'supp-1',
    alternativeSupplierIds: ['supp-3'],
    internalNotes: 'Edição limitada de verão.'
  },
  {
    id: 'prod-16',
    name: 'Colar Choker Fita Laminada Banhada a Ouro 18k',
    category: 'Acessórios',
    price: 54.90,
    cost: 20.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Choker maleável em malha fita italiana com acabamento espelhado de alta reflexão. Ajuste prolongador traseiro.',
    sizes: ['Ajustável (35cm + 10cm)'],
    colors: ['Dourado Ouro 18k'],
    preferredSupplierId: 'supp-4',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Mix Importados - levar caixinhas de veludo.'
  },
  {
    id: 'prod-17',
    name: 'Vestido Longo Floral Três Marias Decote V',
    category: 'Vestuário',
    price: 149.90,
    cost: 74.00,
    isPreOrder: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vestido fluido longo em crepe twill com estampa botânica exclusiva, forrado até o joelho e costas com lastex anatômico.',
    sizes: ['M (38/40)', 'G (42/44)'],
    colors: ['Floral Fundo Off', 'Floral Fundo Preto'],
    preferredSupplierId: 'supp-3',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Lastex estica bem, veste super confortável.'
  },
  {
    id: 'prod-18',
    name: 'Bolsa Carteiro Crossbody Nylon Matelassê',
    category: 'Bolsas',
    price: 109.90,
    cost: 54.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bolsa super leve em nylon impermeável com acolchoado fofo e bolsos externos com zíper tratorado.',
    sizes: ['Médio'],
    colors: ['Preto Fosco', 'Azul Marinho', 'Vinho'],
    preferredSupplierId: 'supp-2',
    alternativeSupplierIds: ['supp-4'],
    internalNotes: 'Excelente para quem pega ônibus ou viaja.'
  },
  {
    id: 'prod-19',
    name: 'Tênis Casual Slip-on Couro Ecológico',
    category: 'Calçados',
    price: 129.90,
    cost: 65.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tênis casual sem cadarço com elásticos laterais, solado de borracha 3cm e forro interno espumado.',
    sizes: ['35', '36', '37', '38', '39'],
    colors: ['Branco Clean', 'Nude Areia'],
    preferredSupplierId: 'supp-1',
    alternativeSupplierIds: ['supp-3'],
    internalNotes: 'Forma exata.'
  },
  {
    id: 'prod-20',
    name: 'Óculos de Sol Retangular Vintage Tartaruga',
    category: 'Acessórios',
    price: 69.90,
    cost: 26.00,
    isPreOrder: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Armação retangular moderna em acetato grosso estampa tartaruga com lentes marrom degradê proteção UV400.',
    sizes: ['Único'],
    colors: ['Tartaruga Âmbar', 'Preto Clássico'],
    preferredSupplierId: 'supp-4',
    alternativeSupplierIds: ['supp-2'],
    internalNotes: 'Acompanha flanela e estojo saquinho da M_I Store.'
  }
]
