import { addKeyword, EVENTS } from '@builderbot/bot'
import { createLead } from '../services/api.service'

export const autosUsadosFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      '🚗 *Usados Seleccionados Renault*',
      '',
      'Nuestros usados cuentan con garantía oficial y revisión técnica completa.',
      '',
      '¿Qué tipo de vehículo estás buscando? (Sedán, SUV, Utilitario, etc.)',
    ],
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ vehicle: ctx.body })
    },
  )
  .addAnswer(
    '¿Cuál es tu presupuesto máximo para esta unidad?',
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ budget: ctx.body })
    },
  )
  .addAnswer(
    'Por último, decime tu nombre completo:',
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      const { vehicle, budget } = state.getMyState()
      const name = ctx.body

      await createLead({
        phone: ctx.from,
        name,
        interest: 'autos-usados',
        vehicle,
        budget,
      })

      await flowDynamic([
        `¡Perfecto ${name}! Tenemos varias opciones que podrían encajar.`,
        '',
        'Un asesor de usados va a revisar nuestro stock actual y se contactará con vos para enviarte fotos y detalles.',
      ])
    },
  )
