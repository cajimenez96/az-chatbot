'use client'

import React, { useEffect, useState } from 'react'
import { useBlocksStore } from '@/store/useBlocksStore'
import { IBlock } from '@az-chatbot/types'
import { Button } from '@/components/ui/Button'
import { BlockEditor } from '@/components/builder/BlockEditor'
import { WhatsAppPreview } from '@/components/builder/WhatsAppPreview'

export default function BuilderPage() {
  const { blocks, fetchBlocks, loading, removeBlock } = useBlocksStore()
  const [selectedBlock, setSelectedBlock] = useState<IBlock | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const handleEdit = (block: IBlock) => {
    setSelectedBlock(block)
    setIsCreating(true)
  }

  const handleCreate = () => {
    setSelectedBlock(null)
    setIsCreating(true)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('¿Estás seguro de eliminar este bloque?')) {
      await removeBlock(id)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xxl)', padding: 'var(--space-xxxl)', backgroundColor: 'var(--color-canvas)', height: '100%', overflow: 'hidden' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-hairline)', paddingBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ font: 'var(--text-display-md)', color: 'var(--color-ink)', textTransform: 'uppercase' }}>Constructor de Chatbot</h1>
          <p style={{ font: 'var(--text-overline)', color: 'var(--color-mute)', marginTop: '8px', letterSpacing: '1px' }}>Diseño de flujos conversacionales dinámicos</p>
        </div>
        <Button onClick={handleCreate} style={{ width: 'auto' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Bloque
        </Button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-xxxl)', height: '100%', minHeight: 0 }}>
        {/* Sidebar: Blocks List */}
        <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', overflowY: 'auto', paddingRight: '12px' }}>
          <h3 style={{ font: 'var(--text-overline)', color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '2px' }}>Bloques Disponibles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {loading && blocks.length === 0 ? (
              <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-ash)', fontStyle: 'italic' }}>Cargando bloques...</p>
            ) : blocks.length === 0 ? (
              <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-ash)', fontStyle: 'italic' }}>No hay bloques creados.</p>
            ) : (
              blocks?.filter(b => b && b.id).map((block, index) => (
                <div
                  key={block.id || `block-${index}`}
                  onClick={() => handleEdit(block)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--space-xl)',
                    borderRadius: 'var(--rounded-none)',
                    border: '1px solid var(--color-hairline-strong)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: selectedBlock?.id === block.id ? 'var(--color-surface-dark)' : 'white',
                    color: selectedBlock?.id === block.id ? 'white' : 'var(--color-ink)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBlock?.id !== block.id) e.currentTarget.style.borderColor = 'var(--color-ink)'
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBlock?.id !== block.id) e.currentTarget.style.borderColor = 'var(--color-hairline-strong)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{
                      font: 'var(--text-overline)',
                      padding: '4px 8px',
                      borderRadius: 'var(--rounded-pill)',
                      textTransform: 'uppercase',
                      backgroundColor: selectedBlock?.id === block.id 
                        ? 'var(--color-primary)' 
                        : (block.type === 'question' ? 'rgba(255, 165, 0, 0.1)' : 
                           block.type === 'menu' ? 'rgba(0, 0, 255, 0.1)' : 'rgba(0, 128, 0, 0.1)'),
                      color: selectedBlock?.id === block.id 
                        ? 'black' 
                        : (block.type === 'question' ? 'orange' : 
                           block.type === 'menu' ? 'blue' : 'green'),
                      fontWeight: 'bold'
                    }}>
                      {block.type}
                    </span>
                    {block.id.trim().toLowerCase() !== 'welcome' && (
                      <button 
                        onClick={(e) => handleDelete(e, block.id)}
                        style={{ 
                          border: 'none', 
                          background: 'none', 
                          cursor: 'pointer',
                          color: selectedBlock?.id === block.id ? 'rgba(255,255,255,0.5)' : 'var(--color-ash)',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = selectedBlock?.id === block.id ? 'rgba(255,255,255,0.5)' : 'var(--color-ash)'}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <h4 style={{ font: 'var(--text-button-md)', textTransform: 'uppercase', margin: 0 }}>{block.id}</h4>
                  <p style={{ 
                    font: 'var(--text-caption)', 
                    marginTop: '4px', 
                    color: selectedBlock?.id === block.id ? 'rgba(255,255,255,0.6)' : 'var(--color-mute)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{block.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor & Preview */}
        <div style={{ gridColumn: 'span 9', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-xxxl)', overflowY: 'auto', paddingRight: '12px', paddingBottom: '40px' }}>
          <div style={{ gridColumn: 'span 7' }}>
            {isCreating ? (
              <BlockEditor block={selectedBlock} onCancel={() => setIsCreating(false)} />
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '450px', 
                backgroundColor: 'var(--color-surface-soft)', 
                border: '1px solid var(--color-hairline)', 
                padding: 'var(--space-xxxl)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: 'white', 
                  border: '1px solid var(--color-hairline-strong)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '24px',
                  color: 'var(--color-ink)'
                }}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 style={{ font: 'var(--text-heading-md)', textTransform: 'uppercase' }}>Seleccionar Bloque</h3>
                <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-mute)', marginTop: '12px', maxWidth: '300px', fontStyle: 'italic' }}>Elegí un bloque de la lista para editarlo o empezá una nueva secuencia.</p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div style={{ gridColumn: 'span 5', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <h3 style={{ font: 'var(--text-overline)', color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '2px' }}>Visualización Previa</h3>
            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'var(--color-surface-soft)', padding: 'var(--space-xxl)', border: '1px solid var(--color-hairline)' }}>
              <WhatsAppPreview 
                message={selectedBlock?.message || 'Escribí un mensaje...'} 
                type={selectedBlock?.type || 'message'}
                options={selectedBlock?.options}
              />
            </div>
            <div style={{ backgroundColor: 'var(--color-primary)', padding: 'var(--space-xl)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '16px' }}>
              <div style={{ color: 'black' }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p style={{ font: 'var(--text-caption)', color: 'black', fontWeight: 'bold', textTransform: 'uppercase' }}>
                <strong>Nota:</strong> El bloque <code>welcome</code> es el disparador inicial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
