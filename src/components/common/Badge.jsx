import React from 'react'

export function Badge({ children, variant = 'neutral', className = '', icon: Icon }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
