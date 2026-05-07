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

export interface IFAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
  keywords: string[]
  active: boolean
  hits: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateFAQDTO {
  question: string
  answer: string
  category: FAQCategory
  keywords?: string[]
}

export interface UpdateFAQDTO extends Partial<CreateFAQDTO> {
  active?: boolean
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
