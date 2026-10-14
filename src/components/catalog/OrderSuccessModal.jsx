import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, MessageCircle, Copy, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'

export function OrderSuccessModal({ result, isOpen, onClose }) {
  const { navigateTo, showToast } = useApp()
  const [copied, setCopied] = useState(false)

  if (!result || !result.request) return null

  const { request, waLink, waMessage } = result

  const handleCopy = () => {
    navigator.clipboard.writeText(waMessage)
    setCopied(true)
    showToast('Mensagem copiada para a área de transferência!')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleGoToAdmin = () => {
    onClose()
    navigateTo('admin-solicitacoes', { selectedRequestId: request.id })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitação Gerada com Sucesso!" maxWidth="520px">
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '999px',
          background: 'var(--status-success-bg)',
          color: 'var(--status-success-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <span style={{
          background: 'var(--color-gold-light)',
          color: '#8c5d1c',
          fontWeight: 700,
          fontSize: '0.875rem',
          padding: '4px 12px',
          borderRadius: '999px',
          display: 'inline-block',
          marginBottom: '8px'
        }}>
          Código: {request.code}
        </span>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Tudo pronto, {request.customerName}!
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
          Para que Edvania inclua seus itens na lista de compras desta semana em João Pessoa, envie agora a mensagem pré-formatada no WhatsApp.
        </p>

        {/* Pré-visualização da Mensagem */}
        <div style={{
          background: '#f9f6f3',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          textAlign: 'left',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          maxHeight: '130px',
          overflowY: 'auto',
          whiteSpace: 'pre-line',
          fontFamily: 'monospace',
          marginBottom: '16px'
        }}>
          {waMessage}
        </div>

        {/* Botão de Enviar WhatsApp Real */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg"
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
            }}
          >
            <MessageCircle size={20} />
            <span>Enviar Mensagem no WhatsApp</span>
            <ExternalLink size={16} />
          </a>

          <Button
            variant="secondary"
            size="md"
            icon={Copy}
            onClick={handleCopy}
            style={{ width: '100%' }}
          >
            {copied ? 'Mensagem Copiada!' : 'Copiar Texto da Mensagem'}
          </Button>

          {/* Destaque para demonstração: Atalho de Administrador */}
          <div style={{
            marginTop: '12px',
            paddingTop: '14px',
            borderTop: '1px dashed var(--border-subtle)',
            background: 'var(--color-primary-light)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              <Sparkles size={14} />
              <span>Modo Demonstração do Protótipo</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 10px 0' }}>
              Esta solicitação já foi salva e enviada instantaneamente para o <strong>Painel Administrativo da Edvania</strong>!
            </p>
            <Button
              variant="primary"
              size="sm"
              iconRight={ArrowRight}
              onClick={handleGoToAdmin}
              style={{ width: '100%' }}
            >
              Ver Pedido {request.code} no Painel da Edvania
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
