import { addKeyword, EVENTS } from '@builderbot/bot'
import { updateConversationStatus, registerEvent, assignLabel } from '../services/api.service'

export const derivacionFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    'Entiendo. Voy a derivar tu consulta a uno de nuestros asesores para que pueda ayudarte personalmente. ⏳',
    null,
    async (ctx) => {
      // 1. Update status in NestJS API
      await updateConversationStatus(ctx.from, 'waiting_human')
      
      // 2. Register metric event
      await registerEvent('derivation_requested')
      
      // 3. Assign label in Evolution API (🔴 Derivado)
      // Note: You'll need to create the label first in Evolution API UI or via API
      // For this example we assume labelId "derivado" exists
      await assignLabel(ctx.from, 'derivado')
    }
  )
  .addAnswer(
    [
      'Ya di aviso al equipo. Un asesor humano te responderá por este mismo chat a la brevedad.',
      '',
      'El bot se desactivará temporalmente para que puedas hablar tranquilo. ¡Muchas gracias!',
    ]
  )
