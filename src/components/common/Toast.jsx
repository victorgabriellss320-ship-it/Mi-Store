import React from 'react'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react'

export function ToastContainer() {
  const { toasts } = useApp()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success'
        const isWarning = toast.type === 'warning'
        const Icon = isSuccess ? CheckCircle2 : isWarning ? AlertTriangle : Info

        return (
          <div
            key={toast.id}
            className={`toast ${isSuccess ? 'toast-success' : isWarning ? 'toast-warning' : 'toast-info'}`}
          >
            <Icon size={18} style={{ color: isSuccess ? '#28a745' : isWarning ? '#e67e22' : 'var(--color-primary)' }} />
            <span>{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}
