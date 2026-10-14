/**
 * Clientes da M_I Store
 * Inclui dados de contato, cidades da região (Cuité de Mamanguape, etc.), e saldos em aberto
 */

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Maria Clara Silva',
    whatsapp: '83991238844',
    city: 'Cuité de Mamanguape',
    address: 'Rua São Sebastião, 142 - Centro',
    reference: 'Próximo à Padaria Nova Estrela',
    totalOrders: 6,
    totalSpent: 840.00,
    currentDebt: 120.00, // Tem fiado em aberto
    debtDueDate: '2026-10-25',
    notes: 'Cliente fiel. Costuma pagar metade no Pix e o restante no dia 25 (dia do pagamento dela).'
  },
  {
    id: 'cust-2',
    name: 'Ana Paula Medeiros',
    whatsapp: '83988451299',
    city: 'Mamanguape',
    address: 'Av. Fernandes Vieira, 88 - Apto 201',
    reference: 'Em frente ao Colégio Cenecista',
    totalOrders: 4,
    totalSpent: 520.00,
    currentDebt: 0.00,
    debtDueDate: null,
    notes: 'Sempre paga no Pix à vista antes do envio.'
  },
  {
    id: 'cust-3',
    name: 'Juliana Fernandes',
    whatsapp: '83993321155',
    city: 'Cuité de Mamanguape',
    address: 'Conjunto Novo, Casa 24',
    reference: 'Rua da creche municipal',
    totalOrders: 5,
    totalSpent: 710.00,
    currentDebt: 95.00, // Tem fiado em aberto
    debtDueDate: '2026-10-20',
    notes: 'Combinou de pagar os R$ 95 na sexta-feira agora.'
  },
  {
    id: 'cust-4',
    name: 'Carla Beatriz Ribeiro',
    whatsapp: '83987114422',
    city: 'Rio Tinto',
    address: 'Vila Regina, 312',
    reference: 'Perto da fábrica de tecidos',
    totalOrders: 2,
    totalSpent: 280.00,
    currentDebt: 0.00,
    debtDueDate: null,
    notes: 'Prefere retirar com a Edvania quando ela passa em Mamanguape.'
  },
  {
    id: 'cust-5',
    name: 'Patrícia Alencar',
    whatsapp: '83996558833',
    city: 'Cuité de Mamanguape',
    address: 'Sítio Lagoa Seca, Zona Rural',
    reference: 'Entrada após o campo de futebol',
    totalOrders: 7,
    totalSpent: 1120.00,
    currentDebt: 160.00, // Fiado
    debtDueDate: '2026-10-30',
    notes: 'Pede sempre sandálias de salto e vestidos de culto.'
  },
  {
    id: 'cust-6',
    name: 'Fernanda Lima Rocha',
    whatsapp: '83981123344',
    city: 'Mamanguape',
    address: 'Rua Marquês do Herval, 45',
    reference: 'Atrás da Igreja Matriz',
    totalOrders: 3,
    totalSpent: 390.00,
    currentDebt: 0.00,
    debtDueDate: null,
    notes: 'Paga sempre no cartão de crédito 1x.'
  },
  {
    id: 'cust-7',
    name: 'Larissa Moura',
    whatsapp: '83998774411',
    city: 'João Pessoa',
    address: 'Bessa, Rua Afonso Pena, 1020',
    reference: 'Edifício Mar de Prata, apto 402',
    totalOrders: 1,
    totalSpent: 189.90,
    currentDebt: 0.00,
    debtDueDate: null,
    notes: 'Parente da Edvania, entrega em mãos na viagem de quinta.'
  },
  {
    id: 'cust-8',
    name: 'Camila Santos Viana',
    whatsapp: '83994556677',
    city: 'Cuité de Mamanguape',
    address: 'Rua Bela Vista, 78',
    reference: 'Ao lado do mercadinho do Zé',
    totalOrders: 4,
    totalSpent: 620.00,
    currentDebt: 80.00, // Fiado pequeno
    debtDueDate: '2026-10-18',
    notes: 'Pegou uma rasteira e ficou de transferir no sábado.'
  },
  {
    id: 'cust-9',
    name: 'Jéssica Costa',
    whatsapp: '83987992211',
    city: 'Guarabira',
    address: 'Bairro Primavera, Rua 12, 55',
    reference: 'Próximo à praça central',
    totalOrders: 2,
    totalSpent: 260.00,
    currentDebt: 0.00,
    debtDueDate: null,
    notes: 'Cliente de indicação da Ana Paula.'
  },
  {
    id: 'cust-10',
    name: 'Beatriz Vasconcelos',
    whatsapp: '83996223388',
    city: 'Cuité de Mamanguape',
    address: 'Rua Projetada A, 19',
    reference: 'Portão branco de grade',
    totalOrders: 3,
    totalSpent: 450.00,
    currentDebt: 0.00,
    debtDueDate: null,
    notes: 'Super pontual, adora novidades de semijoias e brincos.'
  }
]
