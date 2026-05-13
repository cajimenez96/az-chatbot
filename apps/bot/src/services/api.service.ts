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

export async function saveLead(data: {
  phone: string
  name?: string
  email?: string
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
    if (!res.ok) console.error('[API] saveLead failed:', await res.text())
    return res.ok
  } catch (e) {
    console.error('[API] saveLead error:', e)
    return false
  }
}

export async function getConversationStatus(phone: string): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/conversations/${phone}/status`, { headers })
    if (!res.ok) {
      console.error(`[API] getConversationStatus failed (${res.status}):`, await res.text())
      return 'bot_active'
    }
    const json = await res.json() as { status: string }
    console.log(`[API] Status de ${phone}: ${json.status}`)
    return json.status
  } catch (e) {
    console.error('[API] getConversationStatus network error:', e)
    return 'bot_active'
  }
}

export async function updateConversationStatus(phone: string, status: string) {
  try {
    const res = await fetch(`${API_URL}/conversations/${phone}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    })
    if (!res.ok) {
      console.error(`[API] updateConversationStatus failed (${res.status}):`, await res.text())
    } else {
      console.log(`[API] Status de ${phone} actualizado a: ${status}`)
    }
  } catch (e) {
    console.error('[API] updateConversationStatus network error:', e)
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

export async function sendQrToApi(qr: string, retry = 3) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${API_URL}/bot/qr`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ qr }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId))
    if (!res.ok && retry > 0) throw new Error('Retry')
  } catch (e) {
    if (retry > 0) {
      console.log(`[API] API no lista, reintentando sincronizar QR en 3s... (${retry} intentos restantes)`)
      await new Promise(resolve => setTimeout(resolve, 3000))
      return sendQrToApi(qr, retry - 1)
    }
    console.error('[API] sendQrToApi error final:', e)
  }
}

export async function sendConnectedStatus(connected: boolean, retry = 3) {
  try {
    const res = await fetch(`${API_URL}/bot/connected`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ connected }),
    })
    if (!res.ok && retry > 0) throw new Error('Retry')
  } catch (e) {
    if (retry > 0) {
      console.log(`[API] API no lista, reintentando sincronizar estado en 3s... (${retry} intentos restantes)`)
      await new Promise(resolve => setTimeout(resolve, 3000))
      return sendConnectedStatus(connected, retry - 1)
    }
    console.error('[API] sendConnectedStatus error final:', e)
  }
}



export async function getFAQ(id: string) {
  try {
    const res = await fetch(`${API_URL}/faqs/${id}`, { headers })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error('[API] getFAQ error:', e)
    return null
  }
}

export async function findFAQ(query: string) {
  try {
    const res = await fetch(`${API_URL}/faqs/search?q=${encodeURIComponent(query)}`, { headers })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error('[API] findFAQ error:', e)
    return null
  }
}

export async function incrementFAQHit(id: string) {
  try {
    await fetch(`${API_URL}/faqs/${id}/hit`, {
      method: 'PATCH',
      headers,
    })
  } catch (e) {
    console.error('[API] incrementFAQHit error:', e)
  }
}

export async function checkLead(phone: string) {
  try {
    const res = await fetch(`${API_URL}/leads/check/${phone}`, { headers })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error('[API] checkLead error:', e)
    return null
  }
}

export async function listFAQs(category?: string) {
  try {
    const url = category 
      ? `${API_URL}/faqs?category=${category}` 
      : `${API_URL}/faqs`
    const res = await fetch(url, { headers })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    console.error('[API] listFAQs error:', e)
    return []
  }
}

export async function getBlock(id: string) {
  try {
    const res = await fetch(`${API_URL}/blocks/${id}`, { headers })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error('[API] getBlock error:', e)
    return null
  }
}

export async function listBlocks() {
  try {
    const res = await fetch(`${API_URL}/blocks`, { headers })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    console.error('[API] listBlocks error:', e)
    return []
  }
}

export async function listCategories() {
  try {
    const res = await fetch(`${API_URL}/faqs/categories/all`, { headers })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    console.error('[API] listCategories error:', e)
    return []
  }
}
