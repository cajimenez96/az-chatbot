import { create } from 'zustand'
import { IBlock, CreateBlockDTO, UpdateBlockDTO } from '@az-chatbot/types'

interface BlocksState {
  blocks: IBlock[]
  loading: boolean
  error: string | null
  fetchBlocks: () => Promise<void>
  createBlock: (dto: CreateBlockDTO) => Promise<void>
  updateBlock: (id: string, dto: UpdateBlockDTO) => Promise<void>
  removeBlock: (id: string) => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const useBlocksStore = create<BlocksState>((set, get) => ({
  blocks: [],
  loading: false,
  error: null,

  fetchBlocks: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/blocks`)
      const data = await res.json()
      set({ blocks: Array.isArray(data) ? data : [], loading: false })
    } catch (e) {
      set({ error: 'Failed to fetch blocks', loading: false })
    }
  },

  createBlock: async (dto) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      })
      if (!res.ok) throw new Error('Failed to create block')
      const newBlock = await res.json()
      if (newBlock && newBlock.id) {
        set({ blocks: [newBlock, ...get().blocks], loading: false })
      } else {
        set({ loading: false })
      }
    } catch (e) {
      set({ error: 'Failed to create block', loading: false })
    }
  },

  updateBlock: async (id, dto) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`${API_URL}/blocks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      })
      if (!res.ok) throw new Error('Failed to update block')
      const updated = await res.json()
      if (updated && updated.id) {
        set({
          blocks: get().blocks.map((b) => (b.id === id ? updated : b)),
          loading: false,
        })
      } else {
        set({ loading: false })
      }
    } catch (e) {
      set({ error: 'Failed to update block', loading: false })
    }
  },

  removeBlock: async (id) => {
    set({ loading: true, error: null })
    try {
      await fetch(`${API_URL}/blocks/${id}`, { method: 'DELETE' })
      set({
        blocks: get().blocks.filter((b) => b.id !== id),
        loading: false,
      })
    } catch (e) {
      set({ error: 'Failed to remove block', loading: false })
    }
  },
}))
