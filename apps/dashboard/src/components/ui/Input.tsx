import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ label, type, style, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

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
      )}
      <div style={{ position: 'relative' }}>
        <input
          {...props}
          type={inputType}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            paddingRight: isPassword ? 'var(--space-xxxl)' : 'var(--space-md)',
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
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 'var(--space-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-ash)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}
