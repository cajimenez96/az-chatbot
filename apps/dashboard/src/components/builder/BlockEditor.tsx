import React, { useState, useEffect } from 'react'
import { IBlock, BlockType, BlockOption } from '@az-chatbot/types'
import { useBlocksStore } from '@/store/useBlocksStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface BlockEditorProps {
  block: IBlock | null
  onCancel: () => void
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ block, onCancel }) => {
  const { createBlock, updateBlock, blocks } = useBlocksStore()
  const [formData, setFormData] = useState<Partial<IBlock>>({
    id: '',
    type: 'message',
    message: '',
    options: [],
    saveAs: '',
    nextBlockId: '',
  })

  useEffect(() => {
    if (block) {
      setFormData(block)
    } else {
      setFormData({
        id: '',
        type: 'message',
        message: '',
        options: [],
        saveAs: '',
        nextBlockId: '',
      })
    }
  }, [block])

  const handleSave = async () => {
    if (block) {
      await updateBlock(block.id, formData)
    } else {
      await createBlock(formData as any)
    }
    onCancel()
  }

  const addOption = () => {
    const newOption: BlockOption = {
      id: Math.random().toString(36).substring(2, 7),
      label: '',
      nextBlockId: '',
    }
    setFormData({ ...formData, options: [...(formData.options || []), newOption] })
  }

  const updateOption = (index: number, field: keyof BlockOption, value: string) => {
    const newOptions = [...(formData.options || [])]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setFormData({ ...formData, options: newOptions })
  }

  const removeOption = (index: number) => {
    setFormData({ ...formData, options: (formData.options || []).filter((_, i) => i !== index) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px', backgroundColor: 'white', borderRadius: 'var(--rounded-none)', border: '1px solid var(--color-hairline-strong)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '24px' }}>
        <h2 style={{ font: 'var(--text-heading-md)', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
          {block ? `Configurar: ${block.id}` : 'Crear Nuevo Bloque'}
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <Input 
          label="ID del Bloque"
          value={formData.id} 
          onChange={(e) => setFormData({ ...formData, id: e.target.value })} 
          placeholder="ej: welcome"
          disabled={!!block}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ font: 'var(--text-overline)', color: 'var(--color-mute)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Tipo de Bloque</label>
          <select 
            style={{ 
              width: '100%', 
              height: '48px', 
              padding: '12px 0', 
              borderRadius: 'var(--rounded-none)', 
              border: 'none',
              borderBottom: '1px solid var(--color-stone)', 
              backgroundColor: 'transparent', 
              font: 'var(--text-body-md)', 
              outline: 'none', 
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid var(--color-ink)'}
            onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid var(--color-stone)'}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as BlockType })}
          >
            <option value="message">Mensaje Simple</option>
            <option value="question">Pregunta (Captura de dato)</option>
            <option value="menu">Menú de Opciones</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ font: 'var(--text-overline)', color: 'var(--color-mute)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Contenido del Mensaje</label>
        <textarea 
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: 'var(--rounded-none)', 
            border: '1px solid var(--color-stone)', 
            font: 'var(--text-body-md)', 
            outline: 'none', 
            minHeight: '150px', 
            backgroundColor: 'var(--color-surface-soft)', 
            transition: 'all 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-ink)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-stone)'}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Escribí el mensaje que verá el usuario en WhatsApp..."
        />
        <p style={{ font: 'var(--text-caption)', color: 'var(--color-ash)', marginTop: '8px', textTransform: 'uppercase', fontStyle: 'italic' }}>Tip: Usá &#123;name&#125; para personalizar.</p>
      </div>

      {formData.type === 'question' && (
        <Input 
          label="Variable de almacenamiento (saveAs)"
          value={formData.saveAs} 
          onChange={(e) => setFormData({ ...formData, saveAs: e.target.value })} 
          placeholder="ej: nombre_cliente"
        />
      )}

      {(formData.type === 'message' || formData.type === 'question') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ font: 'var(--text-overline)', color: 'var(--color-mute)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Siguiente Paso</label>
          <select 
            style={{ 
              width: '100%', 
              height: '48px', 
              padding: '12px 0', 
              borderRadius: 'var(--rounded-none)', 
              border: 'none',
              borderBottom: '1px solid var(--color-stone)', 
              backgroundColor: 'transparent', 
              font: 'var(--text-body-md)', 
              outline: 'none', 
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid var(--color-ink)'}
            onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid var(--color-stone)'}
            value={formData.nextBlockId}
            onChange={(e) => setFormData({ ...formData, nextBlockId: e.target.value })}
          >
            <option value="">Ninguno (Fin de la conversación)</option>
            {/* Bloques reales */}
            {blocks?.filter(b => b && b.id).map(b => (
              <option key={b.id} value={b.id}>{b.id.toUpperCase()}</option>
            ))}
            {/* Bloques especiales (Virtuales) */}
            <optgroup label="Acciones Especiales">
              <option value="faq_search_direct_main_faq_menu">📖 MENÚ DE FAQs</option>
              <option value="faq_search">🔍 BUSCADOR (Directo)</option>
              <option value="human_handoff">👨‍💻 DERIVAR A HUMANO</option>
            </optgroup>
          </select>
        </div>
      )}

      {formData.type === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ font: 'var(--text-heading-sm)', color: 'var(--color-ink)', textTransform: 'uppercase' }}>Opciones del Menú</h3>
            <Button variant="ghost" size="sm" onClick={addOption} style={{ width: 'auto' }}>+ Añadir Opción</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {formData.options?.map((opt, i) => (
              <div key={opt.id} style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', backgroundColor: 'var(--color-surface-soft)', padding: '24px', border: '1px solid var(--color-hairline)', position: 'relative' }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <Input 
                    label={`Etiqueta #${i + 1}`}
                    value={opt.label} 
                    onChange={(e) => updateOption(i, 'label', e.target.value)} 
                    placeholder="Texto del botón"
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ font: 'var(--text-overline)', color: 'var(--color-mute)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Destino</label>
                    <select 
                      style={{ 
                        width: '100%', 
                        height: '48px', 
                        padding: '12px 0', 
                        borderRadius: 'var(--rounded-none)', 
                        border: 'none',
                        borderBottom: '1px solid var(--color-stone)', 
                        backgroundColor: 'transparent', 
                        font: 'var(--text-body-sm)', 
                        outline: 'none', 
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderBottom = '1px solid var(--color-ink)'}
                      onBlur={(e) => e.currentTarget.style.borderBottom = '1px solid var(--color-stone)'}
                      value={opt.nextBlockId}
                      onChange={(e) => updateOption(i, 'nextBlockId', e.target.value)}
                    >
                      <option value="">Seleccionar bloque...</option>
                      {/* Bloques reales */}
                      {blocks.filter(b => b.id).map(b => (
                        <option key={b.id} value={b.id}>{b.id.toUpperCase()}</option>
                      ))}
                      {/* Bloques especiales (Virtuales) */}
                      <optgroup label="Acciones Especiales">
                        <option value="faq_search_direct_main_faq_menu">📖 MENÚ DE FAQs</option>
                        <option value="faq_search">🔍 BUSCADOR (Directo)</option>
                        <option value="human_handoff">👨‍💻 DERIVAR A HUMANO</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={() => removeOption(i)} 
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    border: 'none', 
                    background: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--color-ash)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-ash)'}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
