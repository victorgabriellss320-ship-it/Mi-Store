import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_PRODUCTS } from '../data/mockProducts'
import { INITIAL_SUPPLIERS } from '../data/mockSuppliers'
import { INITIAL_CUSTOMERS } from '../data/mockCustomers'
import { INITIAL_REQUESTS, INITIAL_SALES } from '../data/mockOrders'
import { INITIAL_CURRENT_TRIP, INITIAL_PAST_TRIPS } from '../data/mockShoppingTrip'
import { INITIAL_SETTINGS, INITIAL_EXPENSES } from '../data/mockSettings'
import { generateOrderCode, generateSaleCode } from '../utils/idGenerator'
import { cleanPhoneForWa } from '../utils/formatters'

const AppContext = createContext(null)

const STORAGE_KEY = 'm_i_store_gestao_v1'

export function AppProvider({ children }) {
  // Inicialização com LocalStorage ou Fallback para dados iniciais
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`)
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
  })

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_suppliers`)
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS
  })

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customers`)
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS
  })

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`)
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS
  })

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sales`)
    return saved ? JSON.parse(saved) : INITIAL_SALES
  })

  const [currentTrip, setCurrentTrip] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentTrip`)
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_TRIP
  })

  const [pastTrips, setPastTrips] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pastTrips`)
    return saved ? JSON.parse(saved) : INITIAL_PAST_TRIPS
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`)
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES
  })

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`)
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS
  })

  // Carrinho e visualização ativa
  const [cart, setCart] = useState([])
  const [currentView, setCurrentView] = useState('catalog') // 'catalog' ou 'admin-dashboard' etc.
  const [viewParams, setViewParams] = useState({})
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true)
  const [toasts, setToasts] = useState([])

  // Sincronização automática com localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers))
  }, [suppliers])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests))
  }, [requests])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sales`, JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_currentTrip`, JSON.stringify(currentTrip))
  }, [currentTrip])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pastTrips`, JSON.stringify(pastTrips))
  }, [pastTrips])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings))
  }, [settings])

  // Navegação simplificada
  const navigateTo = (view, params = {}) => {
    setCurrentView(view)
    setViewParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Notificações Toast
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  // Carrinho de Compras do Catálogo
  const addToCart = (product, size, color, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }

      const newItem = {
        cartItemId: `${product.id}-${size}-${color}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        image: product.images[0],
        price: product.price,
        cost: product.cost,
        size,
        color,
        quantity,
        preferredSupplierId: product.preferredSupplierId
      }
      return [...prev, newItem]
    })

    showToast(`"${product.name}" adicionado à sacola de demonstração.`)
  }

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : null
      }
      return item
    }).filter(Boolean))
  }

  const clearCart = () => setCart([])

  // Envio de Solicitação pelo Catálogo
  const submitOrderRequest = ({ customerName, customerPhone, customerCity, customerAddress, deliveryType, notes }) => {
    if (cart.length === 0) return null

    const code = generateOrderCode()
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const deliveryFee = deliveryType === 'delivery' ? settings.delivery.defaultDeliveryFee : 0
    const total = subtotal + deliveryFee

    // Verifica ou cria cliente
    let matchedCustomer = customers.find(c => c.whatsapp.replace(/\D/g, '') === customerPhone.replace(/\D/g, ''))
    let customerId = matchedCustomer ? matchedCustomer.id : `cust-${Date.now()}`

    if (!matchedCustomer) {
      const newCustomer = {
        id: customerId,
        name: customerName,
        whatsapp: customerPhone,
        city: customerCity || 'Cuité de Mamanguape',
        address: customerAddress || '',
        reference: '',
        totalOrders: 1,
        totalSpent: total,
        currentDebt: 0,
        debtDueDate: null,
        notes: 'Cliente cadastrado via Catálogo Online.'
      }
      setCustomers(prev => [newCustomer, ...prev])
    } else {
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, totalOrders: c.totalOrders + 1 } : c))
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      code,
      customerId,
      customerName,
      customerPhone,
      customerCity: customerCity || 'Cuité de Mamanguape',
      customerAddress: customerAddress || '',
      status: 'new',
      createdAt: new Date().toISOString(),
      channel: 'Catálogo Online',
      deliveryType,
      deliveryFee,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.price,
        estimatedCost: item.cost,
        preferredSupplierId: item.preferredSupplierId
      })),
      subtotal,
      total,
      notes: notes || ''
    }

    setRequests(prev => [newRequest, ...prev])
    clearCart()

    // Gera mensagem pronta para WhatsApp
    let waItemsText = newRequest.items.map(i => {
      let details = []
      if (i.size && i.size !== 'Único') details.push(`Tamanho: ${i.size}`)
      if (i.color) details.push(`Cor: ${i.color}`)
      return `${i.quantity}x ${i.productName}\n${details.join(' | ')}\nR$ ${(i.unitPrice * i.quantity).toFixed(2).replace('.', ',')}`
    }).join('\n\n')

    const waMessage = `Olá! Quero fazer uma encomenda na M_I Store.\n\nPedido ${code}\n\n${waItemsText}\n\nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}${deliveryFee > 0 ? `\nTaxa de entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}` : ''}\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nNome: ${customerName}\nCidade: ${customerCity || 'Cuité de Mamanguape'}\n${customerAddress ? `Endereço: ${customerAddress}\n` : ''}${notes ? `Observações: ${notes}\n` : ''}\nGostaria de confirmar a disponibilidade.`

    const waLink = `https://wa.me/${cleanPhoneForWa(settings.store.whatsapp)}?text=${encodeURIComponent(waMessage)}`

    return { request: newRequest, waMessage, waLink }
  }

  // Ações Administrativas: Solicitações
  const confirmOrderRequest = (requestId, options = {}) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return

    const {
      initialPayment = 0,
      paymentMethod = 'Pix',
      deliveryFee = request.deliveryFee || 0,
      notes = ''
    } = options

    const saleCode = generateSaleCode()
    const subtotal = request.subtotal
    const total = subtotal + deliveryFee
    const totalPaid = parseFloat(initialPayment) || 0
    const balanceDue = Math.max(0, total - totalPaid)
    const estimatedCost = request.items.reduce((acc, i) => acc + (i.estimatedCost * i.quantity), 0)

    const payments = totalPaid > 0 ? [{
      id: `pay-${Date.now()}`,
      amount: totalPaid,
      method: paymentMethod,
      date: new Date().toISOString(),
      note: 'Entrada registrada na confirmação do pedido'
    }] : []

    const saleId = `sale-${Date.now()}`

    const newSale = {
      id: saleId,
      code: saleCode,
      originalRequestId: request.id,
      customerId: request.customerId,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      customerCity: request.customerCity,
      customerAddress: request.customerAddress,
      createdAt: new Date().toISOString(),
      status: 'awaiting_purchase',
      deliveryType: request.deliveryType,
      deliveryFee,
      subtotal,
      total,
      estimatedCost,
      actualCost: null,
      totalPaid,
      balanceDue,
      paymentPlan: balanceDue === 0 ? 'full' : totalPaid > 0 ? 'partial' : 'fiado_total',
      dueDate: balanceDue > 0 ? new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] : null,
      payments,
      items: request.items.map((i, index) => ({
        id: `sitem-${Date.now()}-${index}`,
        productId: i.productId,
        productName: i.productName,
        image: i.image,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        estimatedCost: i.estimatedCost,
        actualCost: null,
        supplierId: i.preferredSupplierId || 'supp-1',
        shoppingStatus: 'pending'
      })),
      notes: notes || request.notes || ''
    }

    // 1. Atualiza a solicitação para 'confirmed'
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'confirmed' } : r))

    // 2. Cria a nova venda
    setSales(prev => [newSale, ...prev])

    // 3. Adiciona os itens diretamente na Compra da Semana Atual
    const newTripItems = newSale.items.map(item => {
      const supplierObj = suppliers.find(s => s.id === item.supplierId)
      return {
        id: `trip-item-${Date.now()}-${Math.random()}`,
        saleId: newSale.id,
        saleCode: newSale.code,
        customerName: newSale.customerName,
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        salePrice: item.unitPrice,
        estimatedCost: item.estimatedCost,
        actualCost: null,
        supplierId: item.supplierId,
        supplierName: supplierObj ? supplierObj.name : 'Fornecedor JP',
        status: 'pending',
        notes: `Cliente: ${newSale.customerName}`
      }
    })

    setCurrentTrip(prev => ({
      ...prev,
      items: [...prev.items, ...newTripItems]
    }))

    // 4. Se ficou saldo devedor, atualiza dívida do cliente
    if (balanceDue > 0) {
      setCustomers(prev => prev.map(c => c.id === request.customerId ? {
        ...c,
        currentDebt: c.currentDebt + balanceDue,
        debtDueDate: newSale.dueDate
      } : c))
    }

    showToast(`Venda ${saleCode} confirmada e itens enviados para a Compra da Semana!`)
  }

  const cancelOrderRequest = (requestId, { reason, note }) => {
    setRequests(prev => prev.map(r => r.id === requestId ? {
      ...r,
      status: 'cancelled',
      cancellationReason: reason,
      cancellationNote: note
    } : r))
    showToast('Solicitação cancelada com sucesso.')
  }


  // Anotar Nova Venda Direta
  const addSale = (saleData) => {
    const saleCode = generateSaleCode()
    const subtotal = saleData.items.reduce((acc, i) => acc + (parseFloat(i.unitPrice) * parseInt(i.quantity)), 0)
    const deliveryFee = parseFloat(saleData.deliveryFee) || 0
    const total = subtotal + deliveryFee
    const totalPaid = parseFloat(saleData.initialPayment) || 0
    const balanceDue = Math.max(0, total - totalPaid)
    const estimatedCost = saleData.items.reduce((acc, i) => acc + ((parseFloat(i.estimatedCost) || parseFloat(i.unitPrice) * 0.5) * parseInt(i.quantity)), 0)

    const payments = totalPaid > 0 ? [{
      id: `pay-${Date.now()}`,
      amount: totalPaid,
      method: saleData.paymentMethod || 'Pix',
      date: new Date().toISOString(),
      note: 'Entrada registrada no momento da venda'
    }] : []

    const saleId = `sale-${Date.now()}`

    const newSale = {
      id: saleId,
      code: saleCode,
      customerId: saleData.customerId || `cust-${Date.now()}`,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      customerCity: saleData.customerCity || 'Cuité de Mamanguape',
      customerAddress: saleData.customerAddress || 'Retirada na Loja',
      createdAt: new Date().toISOString(),
      status: 'awaiting_purchase',
      deliveryType: saleData.deliveryType || 'pickup',
      deliveryFee,
      subtotal,
      total,
      estimatedCost,
      actualCost: null,
      totalPaid,
      balanceDue,
      paymentPlan: balanceDue === 0 ? 'full' : totalPaid > 0 ? 'partial' : 'fiado_total',
      dueDate: balanceDue > 0 ? new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] : null,
      payments,
      items: saleData.items.map((i, index) => ({
        id: `sitem-${Date.now()}-${index}`,
        productId: i.productId || `prod-${Date.now()}`,
        productName: i.productName,
        image: i.image || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
        size: i.size || '36',
        color: i.color || 'Padrão',
        quantity: parseInt(i.quantity) || 1,
        unitPrice: parseFloat(i.unitPrice),
        estimatedCost: parseFloat(i.estimatedCost) || (parseFloat(i.unitPrice) * 0.5),
        actualCost: null,
        supplierId: i.supplierId || 'supp-1',
        shoppingStatus: 'pending'
      })),
      notes: saleData.notes || ''
    }

    setSales(prev => [newSale, ...prev])

    // Adiciona na Compra da Semana
    const newTripItems = newSale.items.map(item => {
      const supplierObj = suppliers.find(s => s.id === item.supplierId)
      return {
        id: `trip-item-${Date.now()}-${Math.random()}`,
        saleId: newSale.id,
        saleCode: newSale.code,
        customerName: newSale.customerName,
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        salePrice: item.unitPrice,
        estimatedCost: item.estimatedCost,
        actualCost: null,
        supplierId: item.supplierId,
        supplierName: supplierObj ? supplierObj.name : 'Fornecedor JP',
        status: 'pending',
        notes: `Cliente: ${newSale.customerName}`
      }
    })

    setCurrentTrip(prev => ({
      ...prev,
      items: [...prev.items, ...newTripItems]
    }))

    // Se cliente já existe, atualiza seu débito; se não, cadastra cliente
    if (balanceDue > 0) {
      setCustomers(prev => {
        const existing = prev.find(c => c.id === saleData.customerId || c.name.toLowerCase() === saleData.customerName.toLowerCase())
        if (existing) {
          return prev.map(c => c.id === existing.id ? {
            ...c,
            currentDebt: (c.currentDebt || 0) + balanceDue,
            debtDueDate: newSale.dueDate,
            totalOrders: (c.totalOrders || 0) + 1,
            totalSpent: (c.totalSpent || 0) + total
          } : c)
        } else {
          const newCust = {
            id: saleData.customerId || `cust-${Date.now()}`,
            name: saleData.customerName,
            whatsapp: saleData.customerPhone,
            city: saleData.customerCity || 'Cuité de Mamanguape',
            address: saleData.customerAddress || 'Retirada na Loja',
            reference: '',
            totalOrders: 1,
            totalSpent: total,
            currentDebt: balanceDue,
            debtDueDate: newSale.dueDate,
            notes: 'Cadastrada no registro de venda.'
          }
          return [newCust, ...prev]
        }
      })
    }

    showToast(`Venda ${saleCode} anotada e enviada para a Compra da Semana!`)
    return newSale
  }

  // Ações de Vendas
  const updateSaleStatus = (saleId, newStatus) => {
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s))
    showToast('Status da venda atualizado!')
  }

  const recordPayment = (saleId, { amount, method, note }) => {
    const payAmount = parseFloat(amount) || 0
    if (payAmount <= 0) return

    setSales(prev => prev.map(s => {
      if (s.id !== saleId) return s

      const newPaid = s.totalPaid + payAmount
      const newBalance = Math.max(0, s.total - newPaid)
      const newPayments = [
        ...s.payments,
        {
          id: `pay-${Date.now()}`,
          amount: payAmount,
          method,
          date: new Date().toISOString(),
          note: note || `Pagamento registrado (${method})`
        }
      ]

      // Atualiza dívida do cliente
      setCustomers(cList => cList.map(c => {
        if (c.id === s.customerId) {
          const updatedDebt = Math.max(0, c.currentDebt - payAmount)
          return {
            ...c,
            currentDebt: updatedDebt,
            debtDueDate: updatedDebt === 0 ? null : c.debtDueDate
          }
        }
        return c
      }))

      return {
        ...s,
        totalPaid: newPaid,
        balanceDue: newBalance,
        payments: newPayments
      }
    }))

    showToast(`Pagamento de R$ ${payAmount.toFixed(2).replace('.', ',')} registrado!`)
  }

  // Ações da Compra Semanal em João Pessoa
  const updateTripItemStatus = (tripItemId, { status, actualCost, notes, alternativeSupplierId }) => {
    setCurrentTrip(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id !== tripItemId) return item

        const costNum = actualCost !== undefined && actualCost !== '' && actualCost !== null 
          ? parseFloat(actualCost) 
          : item.estimatedCost

        let newSupplierId = item.supplierId
        let newSupplierName = item.supplierName

        if (alternativeSupplierId) {
          const newSupp = suppliers.find(s => s.id === alternativeSupplierId)
          if (newSupp) {
            newSupplierId = newSupp.id
            newSupplierName = newSupp.name
          }
        }

        return {
          ...item,
          status,
          actualCost: costNum,
          supplierId: newSupplierId,
          supplierName: newSupplierName,
          notes: notes !== undefined ? notes : item.notes
        }
      })

      return { ...prev, items: updatedItems }
    })

    // Sincroniza o item na venda correspondente
    const currentItem = currentTrip.items.find(i => i.id === tripItemId)
    if (currentItem) {
      setSales(prev => prev.map(s => {
        if (s.id !== currentItem.saleId) return s

        const costNum = actualCost !== undefined && actualCost !== '' && actualCost !== null 
          ? parseFloat(actualCost) 
          : currentItem.estimatedCost

        const updatedSaleItems = s.items.map(si => {
          if (si.productId === currentItem.productId && si.size === currentItem.size && si.color === currentItem.color) {
            return {
              ...si,
              actualCost: costNum,
              shoppingStatus: status
            }
          }
          return si
        })

        // Calcula custo real total da venda
        const totalActualCost = updatedSaleItems.reduce((acc, i) => acc + ((i.actualCost || i.estimatedCost) * i.quantity), 0)

        // Se todos os itens da venda foram comprados, avança o status da venda para 'purchased'
        const allBought = updatedSaleItems.every(i => i.shoppingStatus === 'purchased')
        const newSaleStatus = allBought ? 'purchased' : s.status

        return {
          ...s,
          items: updatedSaleItems,
          actualCost: totalActualCost,
          status: newSaleStatus
        }
      }))
    }

    showToast('Item da compra semanal atualizado!')
  }

  // Gestão de Produtos
  const addProduct = (productData) => {
    const newProd = {
      ...productData,
      id: `prod-${Date.now()}`,
      status: 'active'
    }
    setProducts(prev => [newProd, ...prev])
    showToast(`Produto "${newProd.name}" cadastrado com sucesso!`)
  }

  const updateProduct = (productId, updatedData) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p))
    showToast('Produto atualizado com sucesso!')
  }

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    showToast('Produto removido com sucesso!')
  }

  const toggleProductVisibility = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStatus = p.status === 'active' ? 'hidden' : 'active'
        showToast(nextStatus === 'active' ? 'Produto agora visível no catálogo!' : 'Produto ocultado do catálogo.')
        return { ...p, status: nextStatus }
      }
      return p
    }))
  }

  // Gestão de Clientes
  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: customerData.id || `cust-${Date.now()}`,
      totalOrders: customerData.totalOrders || 0,
      totalSpent: parseFloat(customerData.totalSpent) || 0,
      currentDebt: parseFloat(customerData.currentDebt) || 0,
      debtDueDate: customerData.debtDueDate || null,
      notes: customerData.notes || ''
    }
    setCustomers(prev => [newCust, ...prev])
    showToast(`Cliente "${newCust.name}" cadastrada com sucesso!`)
    return newCust
  }

  const updateCustomer = (customerId, updatedData) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...updatedData } : c))
    showToast('Dados da cliente atualizados com sucesso!')
  }

  // Gestão de Fornecedores
  const addSupplier = (supplierData) => {
    const newSupp = {
      ...supplierData,
      id: `supp-${Date.now()}`,
      totalSpent: 0,
      rating: 5.0
    }
    setSuppliers(prev => [...prev, newSupp])
    showToast(`Fornecedor "${newSupp.name}" adicionado com sucesso!`)
    return newSupp
  }

  const updateSupplier = (supplierId, updatedData) => {
    setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, ...updatedData } : s))
    showToast('Fornecedor atualizado com sucesso!')
  }

  const deleteSupplier = (supplierId) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId))
    showToast('Fornecedor removido com sucesso!')
  }

  // Gestão de Despesas
  const addExpense = (expenseData) => {
    const newExp = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      amount: parseFloat(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    }
    setExpenses(prev => [newExp, ...prev])
    showToast('Despesa registrada com sucesso!')
  }

  const deleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId))
    showToast('Despesa removida.')
  }

  // Configurações
  const updateSettings = (section, newValues) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newValues
      }
    }))
    showToast('Configurações salvas!')
  }

  // Restaurar dados originais para teste
  const resetToDefaultData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_products`)
    localStorage.removeItem(`${STORAGE_KEY}_suppliers`)
    localStorage.removeItem(`${STORAGE_KEY}_customers`)
    localStorage.removeItem(`${STORAGE_KEY}_requests`)
    localStorage.removeItem(`${STORAGE_KEY}_sales`)
    localStorage.removeItem(`${STORAGE_KEY}_currentTrip`)
    localStorage.removeItem(`${STORAGE_KEY}_pastTrips`)
    localStorage.removeItem(`${STORAGE_KEY}_expenses`)
    localStorage.removeItem(`${STORAGE_KEY}_settings`)

    setProducts(INITIAL_PRODUCTS)
    setSuppliers(INITIAL_SUPPLIERS)
    setCustomers(INITIAL_CUSTOMERS)
    setRequests(INITIAL_REQUESTS)
    setSales(INITIAL_SALES)
    setCurrentTrip(INITIAL_CURRENT_TRIP)
    setPastTrips(INITIAL_PAST_TRIPS)
    setExpenses(INITIAL_EXPENSES)
    setSettings(INITIAL_SETTINGS)
    setCart([])

    showToast('Dados de demonstração restaurados!')
  }

  return (
    <AppContext.Provider value={{
      // Estados
      products,
      suppliers,
      customers,
      requests,
      sales,
      currentTrip,
      pastTrips,
      expenses,
      settings,
      cart,
      currentView,
      viewParams,
      isAdminLoggedIn,
      toasts,

      // Navegação e Auth
      navigateTo,
      setIsAdminLoggedIn,

      // Feedback
      showToast,

      // Ações Catálogo / Carrinho
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      submitOrderRequest,

      // Ações Admin
      addSale,
      confirmOrderRequest,
      cancelOrderRequest,
      updateSaleStatus,
      recordPayment,
      updateTripItemStatus,
      addCustomer,
      updateCustomer,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductVisibility,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addExpense,
      deleteExpense,
      updateSettings,
      resetToDefaultData
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider')
  }
  return context
}
