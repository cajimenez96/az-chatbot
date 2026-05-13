import React from 'react'

interface WhatsAppPreviewProps {
  message: string
  type: 'message' | 'question' | 'menu'
  options?: { label: string }[]
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ message, type, options }) => {
  return (
    <div style={{ width: '320px', backgroundColor: 'white', border: '1px solid var(--color-hairline-strong)', borderRadius: 'var(--rounded-none)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
      {/* WhatsApp Header */}
      <div style={{ backgroundColor: '#075e54', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>Renault Bot</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', margin: 0 }}>En línea</p>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ height: '400px', backgroundColor: '#e5ddd5', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', borderTopLeftRadius: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '85%', alignSelf: 'flex-start', position: 'relative' }}>
          <p style={{ fontSize: '14px', color: '#1f2937', whiteSpace: 'pre-wrap', margin: 0 }}>{message}</p>
          <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'right', marginTop: '4px', margin: 0 }}>14:41</p>
        </div>

        {type === 'menu' && options && options.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', width: '100%', padding: '0 16px' }}>
            {options.map((opt, i) => (
              <div 
                key={i} 
                style={{ 
                  backgroundColor: 'white', 
                  color: '#00a884', 
                  fontWeight: '600', 
                  fontSize: '14px', 
                  padding: '10px 16px', 
                  borderRadius: '24px', 
                  textAlign: 'center', 
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)', 
                  border: '1px solid #f3f4f6'
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Input area */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', height: '40px', borderRadius: '20px', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Mensaje...</p>
        </div>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#00a884', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
