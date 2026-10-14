import React from 'react'

export function Logo({ size = 'normal', className = '' }) {
  const isSmall = size === 'small'

  return (
    <div className={`mi-store-logo ${className}`} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      userSelect: 'none'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* M_I Serif Text */}
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: isSmall ? '26px' : '34px',
          fontWeight: 700,
          color: '#731A30',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          position: 'relative'
        }}>
          M<span style={{
            display: 'inline-block',
            borderBottom: `${isSmall ? '2.5px' : '3.5px'} solid #731A30`,
            width: isSmall ? '12px' : '16px',
            margin: isSmall ? '0 2px' : '0 3px',
            verticalAlign: 'bottom',
            marginBottom: isSmall ? '2px' : '3px'
          }}></span>I
        </span>

        {/* Store Cursive Script */}
        <span style={{
          fontFamily: "'Dancing Script', 'Alex Brush', cursive",
          fontSize: isSmall ? '30px' : '40px',
          fontWeight: 700,
          color: '#731A30',
          marginLeft: isSmall ? '3px' : '4px',
          lineHeight: 1,
          position: 'relative',
          top: '-1px'
        }}>
          Store
        </span>

        {/* Heart Outline ♡ */}
        <svg
          viewBox="0 0 24 24"
          width={isSmall ? "13" : "17"}
          height={isSmall ? "13" : "17"}
          fill="none"
          stroke="#C03C54"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            top: isSmall ? '-4px' : '-6px',
            right: isSmall ? '-12px' : '-16px',
            transform: 'rotate(12deg)'
          }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>

      {/* Slogan */}
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: isSmall ? '8px' : '9.5px',
        fontWeight: 600,
        color: '#731A30',
        letterSpacing: '0.28em',
        marginTop: isSmall ? '5px' : '7px',
        textTransform: 'uppercase',
        paddingLeft: '0.28em' // Compensa o espaçamento na última letra
      }}>
        Moda que te acompanha
      </span>
    </div>
  )
}
