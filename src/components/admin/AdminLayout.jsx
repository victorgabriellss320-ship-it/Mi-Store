import React from 'react'

export function AdminLayout({ children, title, subtitle, actionButton }) {
  return (
    <div className="page-container">
      {(title || actionButton) && (
        <div className="page-header">
          <div>
            {title && <h1 className="page-header-title">{title}</h1>}
            {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
          </div>
          {actionButton && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {actionButton}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
