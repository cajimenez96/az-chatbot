import { addKeyword, EVENTS } from '@builderbot/bot'
import { createLead } from '../services/api.service'
import { derivacionFlow } from './derivacion.flow'

export const autosNuevosFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      '🚗 *Autos Nuevos Renault*',
      '',
      'Contamos con toda la gama Renault 2024-2025:',
      '• Renault Sandero y Stepway',
      '• Renault Kwid',
      '• Renault Logan',
      '• Renault Duster',
      '• Renault Oroch',
      '• Renault Megane E-Tech ⚡',
      '',
      '¿Cuál te interesa conocer?',
    ],
    { capture: true },
    async (ctx, { flowDynamic }) => {
      await flowDynamic('¡Excelente elección! 🌟')
    },
  )
  .addAnswer(
    '¿Podrías decirme tu nombre para que un asesor pueda preparar la cotización?',
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ name: ctx.body, vehicle: ctx.prevAnswer ?? 'consulta general' })
    },
  )
  .addAnswer(
    '¿Tenés un presupuesto aproximado en mente? (Podés escribir "no sé" si no tenés uno)',
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      const { name, vehicle } = state.getMyState()
      await createLead({
        phone: ctx.from,
        name,
        interest: 'autos-nuevos',
        vehicle,
        budget: ctx.body,
      })
      await flowDynamic([
        `¡Gracias ${name}! 🎉`,
        '',
        'Registramos tu consulta. Un asesor de autos nuevos te va a contactar a la brevedad con la información y cotización.',
        '',
        '¿Hay algo más en lo que pueda ayudarte?',
        '1️⃣ Volver al menú principal',
        '2️⃣ Hablar con un asesor ahora',
      ])
    },
  )
  .addAnswer(
    '',
    { capture: true },
    async (ctx, { gotoFlow }) => {
      if (ctx.body === '2' || /asesor/i.test(ctx.body)) {
        return gotoFlow(derivacionFlow)
      }
    },
  )
