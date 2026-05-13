// ─── Lead ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost'

export type LeadInterest =
  | 'autos-nuevos'
  | 'autos-usados'
  | 'financiacion'
  | 'servicios'
  | 'contacto'
  | 'otro'

export interface ILead {
  id: string
  phone: string
  name?: string
  interest?: LeadInterest
  vehicle?: string
  budget?: string
  status: LeadStatus
  conversationId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateLeadDTO {
  phone: string
  name?: string
  interest?: LeadInterest
  vehicle?: string
  budget?: string
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export type ConversationStatus =
  | 'bot_active'
  | 'waiting_human'
  | 'human_active'
  | 'closed'

export interface IConversation {
  id: string
  phone: string
  status: ConversationStatus
  assignedTo?: string
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface UpdateConversationDTO {
  status?: ConversationStatus
  assignedTo?: string
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export type FAQCategory =
  | 'horarios'
  | 'ubicacion'
  | 'vehiculos'
  | 'financiacion'
  | 'servicios'
  | 'general'

export interface FAQOption {
  id: string
  label: string
  answer?: string
  nextFaqId?: string
}

export interface IFAQ {
  id: string
  type: BlockType       // 'message' | 'question' | 'menu'
  question: string      // El título/activador
  message: string       // La respuesta/mensaje (reemplaza 'answer')
  category: string      // ID de la categoría
  keywords: string[]
  options?: BlockOption[]
  saveAs?: string
  nextBlockId?: string
  active: boolean
  hits: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateFAQDTO {
  id?: string
  type: BlockType
  question: string
  message: string
  category: string
  keywords?: string[]
  options?: BlockOption[]
  saveAs?: string
  nextBlockId?: string
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export interface IDailyMetric {
  id: string
  date: string // YYYY-MM-DD
  conversationsTotal: number
  leadsTotal: number
  derivationsTotal: number
  derivationsAnswered: number
  faqsServed: number
  createdAt: Date
}

export interface RegisterEventDTO {
  event:
    | 'conversation_started'
    | 'lead_captured'
    | 'derivation_requested'
    | 'derivation_answered'
    | 'faq_served'
  date?: string // YYYY-MM-DD, defaults to today
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  expiresIn: number
}

// ─── Blocks (Dynamic Flows) ───────────────────────────────────────────────────

export type BlockType = 'message' | 'question' | 'menu'

export interface BlockOption {
  id: string
  label: string
  nextBlockId: string
}

export interface IBlock {
  id: string
  type: BlockType
  message: string
  options?: BlockOption[]
  saveAs?: string // For 'question' type, key to save in state
  nextBlockId?: string // For 'message' and 'question' type
  createdAt: Date
  updatedAt: Date
}

export interface CreateBlockDTO {
  id?: string
  type: BlockType
  message: string
  options?: BlockOption[]
  saveAs?: string
  nextBlockId?: string
}

export interface UpdateBlockDTO extends Partial<CreateBlockDTO> {}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
