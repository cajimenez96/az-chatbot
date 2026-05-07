import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ label, style, ...props }: InputProps) => {
  return (
    <div style={{ width: '100%', marginBottom: 'var(--space-md)' }}>
      {label && (
        <label
          style={{
            display: 'block',
            font: 'var(--text-overline)',
            textTransform: 'uppercase',
            color: 'var(--color-mute)',
            marginBottom: 'var(--space-xxs)',
          }}
        >
          {label}
        </label>
      ) }
      <input
        {...props}
        style={{
          width: '100%',
          padding: 'var(--space-md)',
          border: '1px solid var(--color-stone)',
          borderRadius: 'var(--rounded-none)',
          font: 'var(--text-body-md)',
          color: 'var(--color-ink)',
          backgroundColor: 'var(--color-canvas)',
          outline: 'none',
          ...style,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-ink)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-stone)')}
      />
    </div>
  )
}
