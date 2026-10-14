import React from 'react'
import { ArrowRight } from 'lucide-react'

export function ActionCard({
  title,
  count,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  onClick,
  badgeText
}) {
  const getColors = () => {
    switch (variant) {
      case 'warning':
        return {
          bg: '#fdf7f0',
          border: '#f5d9b8',
          iconBg: '#faebd7',
          iconColor: '#b35e16',
          badgeBg: '#fdead3',
          badgeColor: '#934b0d'
        }
      case 'primary':
        return {
          bg: '#faf2f5',
          border: '#ebd3dc',
          iconBg: '#f5dfe7',
          iconColor: 'var(--color-primary)',
          badgeBg: '#eed1dc',
          badgeColor: '#6e283d'
        }
      case 'success':
        return {
          bg: '#f2f9f4',
          border: '#cdebd6',
          iconBg: '#dcf2e3',
          iconColor: '#216a44',
          badgeBg: '#cbead4',
          badgeColor: '#1a5436'
        }
      case 'info':
        return {
          bg: '#f0f6fa',
          border: '#cbe1f1',
          iconBg: '#dcecf8',
          iconColor: '#1d5583',
          badgeBg: '#cce2f3',
          badgeColor: '#164367'
        }
      default:
        return {
          bg: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          iconBg: 'var(--bg-surface-subtle)',
          iconColor: 'var(--text-secondary)',
          badgeBg: 'var(--bg-surface-subtle)',
          badgeColor: 'var(--text-secondary)'
        }
    }
  }

  const colors = getColors()

  return (
    <div
      onClick={onClick}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-normal)',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)'
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        }
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: colors.iconBg,
            color: colors.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {Icon && <Icon size={20} />}
          </div>

          {badgeText && (
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: colors.badgeBg,
              color: colors.badgeColor
            }}>
              {badgeText}
            </span>
          )}
        </div>

        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {count}
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
          {title}
        </div>

        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>

      {onClick && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: colors.iconColor,
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: `1px solid ${colors.border}`
        }}>
          <span>Ver detalhes</span>
          <ArrowRight size={13} />
        </div>
      )}
    </div>
  )
}
