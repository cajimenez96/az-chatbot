import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = ({ variant = 'primary', size = 'md', style, ...props }: ButtonProps) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
          border: 'none',
        }
      case 'dark':
        return {
          backgroundColor: 'var(--color-surface-dark)',
          color: 'var(--color-on-dark)',
          border: 'none',
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-ink)',
          border: '1px solid var(--color-hairline-strong)',
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-ink)',
          border: 'none',
        }
      case 'danger':
        return {
          backgroundColor: 'var(--color-error)',
          color: 'white',
          border: 'none',
        }
      default:
        return {}
    }
  }

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '8px 16px', fontSize: '11px' }
      case 'lg':
        return { padding: '16px 32px', fontSize: '15px' }
      default:
        return { padding: '12px 24px', fontSize: '13px' }
    }
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    font: 'var(--text-button-md)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: 'var(--rounded-xs)',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  }

  return (
    <button
      {...props}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-deep)'
        else if (variant === 'dark') e.currentTarget.style.backgroundColor = 'var(--color-charcoal)'
        else if (variant === 'outline' || variant === 'ghost') e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'
      }}
      onMouseLeave={(e) => {
        const vs = getVariantStyles()
        e.currentTarget.style.backgroundColor = (vs.backgroundColor as string) || 'transparent'
      }}
    />
  )
}
