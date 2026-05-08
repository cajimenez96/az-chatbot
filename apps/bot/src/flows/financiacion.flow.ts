import { addKeyword, EVENTS } from '@builderbot/bot'
import { saveLead } from '../services/api.service'

export const financiacionFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      '🏦 *Financiación Renault*',
      '',
      'Tenemos planes a medida con tasas preferenciales:',
      '• Cuotas fijas en pesos',
      '• Créditos UVA',
      '• Leasing para empresas',
      '',
      '¿Sobre qué modelo te gustaría consultar la financiación?',
    ],
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ vehicle: ctx.body })
    },
  )
  .addAnswer(
    '¿De cuánto sería el anticipo que tenés disponible?',
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      const { vehicle } = state.getMyState()
      
      await createLead({
        phone: ctx.from,
        interest: 'financiacion',
        vehicle,
        budget: `Anticipo: ${ctx.body}`,
      })

      await flowDynamic(
        '¡Gracias por la información! Un asesor financiero analizará las mejores tasas para vos y te contactará en breve. 📈'
      )
    },
  )
