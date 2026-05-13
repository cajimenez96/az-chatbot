import { addKeyword, EVENTS } from '@builderbot/bot'
import { FlowRenderer } from '../services/flow-renderer.service'
import { getFAQ, incrementFAQHit } from '../services/api.service'
import type { IFAQ } from '@az-chatbot/types'

/**
 * Este flujo ahora es puramente un RENDERIZADOR de bloques FAQ.
 * Como cada FAQ ahora tiene estructura de Bloque (type, message, options),
 * simplemente las pasamos al FlowRenderer.
 */
export const faqFlow = addKeyword<any, any>(EVENTS.ACTION)
    .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
        const directId = state.get('directFaqId')
        if (!directId) return

        await state.update({ directFaqId: null })
        const faq = await getFAQ(directId) as IFAQ
        
        if (faq) {
            await incrementFAQHit(faq.id)
            // Renderizamos la FAQ como si fuera un bloque normal
            return await FlowRenderer.renderBlock(faq as any, { flowDynamic, state, gotoFlow })
        } else {
            return await flowDynamic('⚠️ No pude encontrar la información solicitada.')
        }
    })
