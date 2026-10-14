/**
 * Configurações personalizáveis da M_I Store
 * Edvania pode ligar/desligar recursos que ela usa ou não usa
 */

export const INITIAL_SETTINGS = {
  store: {
    name: 'M_I Store',
    tagline: 'Moda Feminina & Encomendas Especiais',
    ownerName: 'Edvania',
    whatsapp: '83991238844',
    instagram: '@m_i_store244',
    city: 'Cuité de Mamanguape - PB',
    defaultOrderMessage: 'Olá Edvania! Quero fazer uma encomenda na M_I Store.'
  },
  catalog: {
    showPrices: true,
    showDescription: true,
    showOutOfStock: false,
    preOrderNotice: 'Produtos sob encomenda — compras toda quinta-feira em João Pessoa!',
    allowOrderNotes: true
  },
  shoppingTrip: {
    defaultDayOfWeek: 'Quinta-feira',
    groupBySupplier: true,
    enableExpenseDeduction: true,
    alertMissingItems: true
  },
  financial: {
    enableFiado: true,
    enableDueDate: true,
    enablePartialPayments: true,
    enableMixedPayments: true,
    enableExpenses: true,
    calculateNetProfit: true,
    cardFeePercentage: 3.5
  },
  delivery: {
    enableDelivery: true,
    enablePickup: true,
    defaultDeliveryFee: 5.00,
    allowManualFee: true
  },
  paymentMethods: {
    pix: true,
    cash: true,
    creditCard: true,
    debitCard: true,
    bankTransfer: false
  }
}

export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    description: 'Gasolina para viagem a João Pessoa (ida e volta)',
    category: 'combustivel', // combustivel, alimentacao, frete, embalagens, outros
    amount: 55.00,
    date: '2026-10-09',
    deductFromProfit: true,
    notes: 'Posto em Mamanguape'
  },
  {
    id: 'exp-2',
    description: 'Lanche durante as compras no centro',
    category: 'alimentacao',
    amount: 18.50,
    date: '2026-10-09',
    deductFromProfit: true,
    notes: 'Pastel e suco'
  },
  {
    id: 'exp-3',
    description: 'Pacote com 50 sacolas personalizadas e papel de seda',
    category: 'embalagens',
    amount: 45.00,
    date: '2026-10-02',
    deductFromProfit: true,
    notes: 'Comprado na papelaria em JP'
  }
]
