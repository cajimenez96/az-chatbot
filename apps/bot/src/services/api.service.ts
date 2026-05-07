/**
 * NestJS API client for BuilderBot.
 * All HTTP calls from the bot to the API go through this service.
 */

const API_URL = process.env.NESTJS_API_URL ?? 'http://localhost:3001/api'
const API_KEY = process.env.BOT_API_KEY ?? ''

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
}

export async function createLead(data: {
  phone: string
  name?: string
  interest?: string
  vehicle?: string
  budget?: string
}) {
  try {
    const res = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    if (!res.ok) console.error('[API] createLead failed:', await res.text())
    return res.ok
  } catch (e) {
    console.error('[API] createLead error:', e)
    return false
  }
}

export async function getConversationStatus(phone: string): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/conversations/${phone}/status`, { headers })
    if (!res.ok) return 'bot_active'
    const json = await res.json() as { status: string }
    return json.status
  } catch {
    return 'bot_active'
  }
}

export async function updateConversationStatus(phone: string, status: string) {
  try {
    await fetch(`${API_URL}/conversations/${phone}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    })
  } catch (e) {
    console.error('[API] updateConversationStatus error:', e)
  }
}

export async function registerEvent(event: string) {
  try {
    await fetch(`${API_URL}/metrics/event`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ event }),
    })
  } catch (e) {
    console.error('[API] registerEvent error:', e)
  }
}

export async function assignLabel(phone: string, label: string) {
  const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? 'http://localhost:8080'
  const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? ''
  const INSTANCE = process.env.EVOLUTION_INSTANCE ?? 'renault-bot'

  try {
    await fetch(`${EVOLUTION_URL}/label/handleLabel/${INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: EVOLUTION_KEY,
      },
      body: JSON.stringify({
        number: `${phone}@s.whatsapp.net`,
        labelId: label,
        action: 'add',
      }),
    })
  } catch (e) {
    console.error('[Evolution] assignLabel error:', e)
  }
}
