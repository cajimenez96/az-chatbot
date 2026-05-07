import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
}

export const Button = ({ variant = 'primary', style, ...props }: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    font: 'var(--text-button-md)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: 'var(--space-md) var(--space-xxl)',
    borderRadius: 'var(--rounded-none)',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-xs)',
    width: '100%',
    ...style,
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-on-primary)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--color-hairline-strong)',
      color: 'var(--color-ink)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-ink)',
    },
  }

  return (
    <button
      {...props}
      style={{ ...baseStyle, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-deep)'
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary)'
      }}
    />
  )
}
