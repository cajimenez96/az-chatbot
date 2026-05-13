import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, type, error, style, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label style={{ 
          font: 'var(--text-overline)', 
          color: 'var(--color-mute)', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          fontWeight: 'bold'
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          {...props}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            height: '48px',
            padding: '12px 0',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${error ? 'var(--color-error)' : (isFocused ? 'var(--color-ink)' : 'var(--color-stone)')}`,
            font: 'var(--text-body-md)',
            color: 'var(--color-ink)',
            outline: 'none',
            transition: 'all 0.2s ease',
            ...style
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-mute)',
              padding: '4px',
              cursor: 'pointer'
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ 
          font: 'var(--text-caption)', 
          color: 'var(--color-error)', 
          marginTop: '4px',
          fontWeight: '500'
        }}>
          {error}
        </p>
      )}
    </div>
  )
}
