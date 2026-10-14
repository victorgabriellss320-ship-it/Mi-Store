import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/common/Button'
import { Sparkles, ArrowRight, ShieldCheck, ShoppingBag, Luggage } from 'lucide-react'

export function LoginPage() {
  const { setIsAdminLoggedIn, navigateTo } = useApp()
  const [email, setEmail] = useState('edvania@mistore.com.br')
  const [password, setPassword] = useState('••••••••')

  const handleLogin = (e) => {
    e.preventDefault()
    setIsAdminLoggedIn(true)
    navigateTo('admin-dashboard')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 37px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(135deg, #f7eff2 0%, #faf8f5 50%, #f4eae7 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Brand Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #85334c 0%, #6e283d 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          boxShadow: '0 8px 18px rgba(133, 51, 76, 0.25)'
        }}>
          <Sparkles size={28} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            M_I Store Gestão
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Painel Operacional Exclusivo de Edvania
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">E-mail de Acesso</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{
            background: 'var(--color-primary-light)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>Modo Demonstração: clique abaixo para entrar sem digitar senha.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            iconRight={ArrowRight}
            style={{ width: '100%', marginTop: '6px' }}
          >
            Acessar Painel da Edvania
          </Button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={() => navigateTo('catalog')}
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={14} />
            <span>Ir para o Catálogo Público de Encomendas</span>
          </button>
        </div>
      </div>
    </div>
  )
}
