import { addKeyword, EVENTS } from '@builderbot/bot'
import { autosNuevosFlow } from './autos-nuevos.flow'
import { autosUsadosFlow } from './autos-usados.flow'
import { financiacionFlow } from './financiacion.flow'
import { serviciosFlow } from './servicios.flow'
import { derivacionFlow } from './derivacion.flow'
import { updateConversationStatus } from '../services/api.service'

export const welcomeFlow = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx) => {
    await updateConversationStatus(ctx.from, 'bot_active')
  })
  .addAnswer(
    [
      '¡Hola! 👋 Bienvenido al concesionario *Renault*.',
      '',
      '¿En qué puedo ayudarte hoy?',
      '',
      '1️⃣ Autos nuevos',
      '2️⃣ Autos usados',
      '3️⃣ Financiación',
      '4️⃣ Service y mantenimiento',
      '5️⃣ Hablar con un asesor',
    ],
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const option = ctx.body.trim()

      if (option === '1' || /nuevo/i.test(option)) return gotoFlow(autosNuevosFlow)
      if (option === '2' || /usado/i.test(option)) return gotoFlow(autosUsadosFlow)
      if (option === '3' || /financ/i.test(option)) return gotoFlow(financiacionFlow)
      if (option === '4' || /service|taller|mant/i.test(option)) return gotoFlow(serviciosFlow)
      if (option === '5' || /asesor|humano|persona/i.test(option)) return gotoFlow(derivacionFlow)

      return fallBack(
        '❌ No entendí tu respuesta. Por favor elegí una opción del 1 al 5.',
      )
    },
  )
