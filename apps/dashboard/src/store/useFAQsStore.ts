import { create } from 'zustand'
import { api } from '@/lib/axios'
import type { IFAQ, CreateFAQDTO, UpdateFAQDTO } from '@az-chatbot/types'

interface FAQsState {
  faqs: IFAQ[]
  categories: { id: string, label: string }[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchFAQs: () => Promise<void>
  addFAQ: (dto: CreateFAQDTO) => Promise<void>
  updateFAQ: (id: string, dto: UpdateFAQDTO) => Promise<void>
  deleteFAQ: (id: string) => Promise<void>
  
  // Categories
  fetchCategories: () => Promise<void>
  addCategory: (label: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  // Local only (for testing/preview)
  setLocalFAQs: (faqs: IFAQ[]) => void
}

export const useFAQsStore = create<FAQsState>((set, get) => ({
  faqs: [],
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      const res = await api.get('/faqs/categories/all')
      set({ categories: res.data })
    } catch (err) {}
  },

  addCategory: async (label: string) => {
    try {
      const res = await api.post('/faqs/categories', { label })
      set((state) => ({ categories: [...state.categories, res.data] }))
    } catch (err) {}
  },

  deleteCategory: async (id: string) => {
    try {
      await api.delete(`/faqs/categories/${id}`)
      set((state) => ({ categories: state.categories.filter(c => c.id !== id) }))
    } catch (err) {}
  },

  fetchFAQs: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get<IFAQ[]>('/faqs/admin')
      set({ faqs: res.data, loading: false })
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Error al cargar FAQs de la API', 
        loading: false 
      })
    }
  },

  addFAQ: async (dto) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post<IFAQ>('/faqs', dto)
      set((state) => ({ 
        faqs: [res.data, ...state.faqs],
        loading: false 
      }))
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Error al crear FAQ', 
        loading: false 
      })
      throw err
    }
  },

  updateFAQ: async (id, dto) => {
    set({ loading: true, error: null })
    try {
      const res = await api.patch<IFAQ>(`/faqs/${id}`, dto)
      set((state) => ({
        faqs: state.faqs.map((f) => (f.id === id ? res.data : f)),
        loading: false
      }))
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Error al actualizar FAQ', 
        loading: false 
      })
      throw err
    }
  },

  deleteFAQ: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/faqs/${id}`)
      set((state) => ({
        faqs: state.faqs.filter((f) => f.id !== id),
        loading: false
      }))
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Error al eliminar FAQ', 
        loading: false 
      })
      throw err
    }
  },

  setLocalFAQs: (faqs) => set({ faqs }),
}))
