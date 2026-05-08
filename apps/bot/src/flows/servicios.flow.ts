import { addKeyword, EVENTS } from '@builderbot/bot'
import { saveLead } from '../services/api.service'

export const serviciosFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      '🔧 *Postventa y Servicios*',
      '',
      '¿Qué servicio necesitás realizar?',
      '1️⃣ Service de mantenimiento (10k, 20k, etc.)',
      '2️⃣ Reparación mecánica',
      '3️⃣ Repuestos oficiales',
      '4️⃣ Chapa y pintura',
    ],
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const option = ctx.body.trim()
      const services: Record<string, string> = {
        '1': 'Service de mantenimiento',
        '2': 'Reparación mecánica',
        '3': 'Repuestos oficiales',
        '4': 'Chapa y pintura',
      }

      if (!services[option]) return fallBack('Por favor, seleccioná una opción del 1 al 4.')
      
      await state.update({ serviceType: services[option] })
      await flowDynamic(`Seleccionaste: *${services[option]}*`)
    },
  )
  .addAnswer(
    '¿Para qué modelo de Renault es la consulta?',
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      const { serviceType } = state.getMyState()
      
      await createLead({
        phone: ctx.from,
        interest: 'servicios',
        vehicle: ctx.body,
        budget: serviceType,
      })

      await flowDynamic(
        '¡Recibido! El equipo de taller verificará disponibilidad de turnos y se contactará con vos para coordinar. 🗓️'
      )
    },
  )
