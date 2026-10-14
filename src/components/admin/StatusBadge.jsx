import React from 'react'
import { Badge } from '../common/Badge'

export function StatusBadge({ status, type = 'sale' }) {
  // Configuração semântica para diferentes entidades
  if (type === 'request') {
    switch (status) {
      case 'new':
        return <Badge variant="warning">Nova Solicitação</Badge>
      case 'waiting_response':
        return <Badge variant="info">Aguardando Cliente</Badge>
      case 'confirmed':
        return <Badge variant="success">Confirmada</Badge>
      case 'cancelled':
        return <Badge variant="danger">Cancelada</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  if (type === 'shopping') {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">A Comprar</Badge>
      case 'purchased':
        return <Badge variant="success">Comprado</Badge>
      case 'not_found':
        return <Badge variant="danger">Não Encontrado</Badge>
      case 'price_changed':
        return <Badge variant="info">Preço Alterado</Badge>
      case 'substituted':
        return <Badge variant="primary">Substituído</Badge>
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  // Padrão: Vendas
  switch (status) {
    case 'awaiting_purchase':
      return <Badge variant="warning">Aguardando Compra</Badge>
    case 'purchased':
      return <Badge variant="info">Comprado em JP</Badge>
    case 'ready_for_delivery':
      return <Badge variant="primary">Pronto p/ Entrega</Badge>
    case 'out_for_delivery':
      return <Badge variant="info">Em Rota de Entrega</Badge>
    case 'delivered':
      return <Badge variant="success">Entregue</Badge>
    case 'finished':
      return <Badge variant="success">Finalizada</Badge>
    case 'cancelled':
      return <Badge variant="danger">Cancelada</Badge>
    default:
      return <Badge variant="neutral">{status}</Badge>
  }
}
