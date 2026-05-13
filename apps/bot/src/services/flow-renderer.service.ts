import { getBlock } from './api.service'
import type { IBlock } from '@az-chatbot/types'
import { faqFlow } from '../flows/faq.flow'
import { derivacionFlow } from '../flows/derivacion.flow'

/**
 * Service to handle dynamic block rendering and variable injection.
 */
export class FlowRenderer {
  /**
   * Replaces placeholders like {name} with values from the state.
   */
  static injectVariables(text: string, state: any): string {
    if (!state || typeof state.get !== 'function') return text
    return text.replace(/{(\w+)}/g, (match, key) => {
      return state.get(key) || match
    })
  }

  /**
   * Renders a block to the user.
   */
  static async renderBlock(blockOrId: string | IBlock, flowProps: any): Promise<any> {
    const { flowDynamic, state, gotoFlow } = flowProps
    
    let block: IBlock | null = null
    
    if (typeof blockOrId === 'string') {
      console.log(`[FlowRenderer] Rendering block by ID: ${blockOrId}`)

      // --- INTERCEPCIÓN TEMPRANA DE IDs ESPECIALES ---
      if (blockOrId === 'faq_search' || blockOrId === 'faq_search_input') {
        const searchBlock: IBlock = {
          id: 'faq_search_input',
          type: 'question',
          message: 'Entendido. Escribí tu duda o pregunta y voy a buscarla en mi base de conocimientos. 🔍',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        return await this.renderBlock(searchBlock, flowProps)
      }

      if (blockOrId.startsWith('faq_search_direct_')) {
        const faqId = blockOrId.replace('faq_search_direct_', '')
        await state.update({ directFaqId: faqId })
        return gotoFlow(faqFlow)
      }

      if (blockOrId.startsWith('faq_cat_direct_')) {
        const catId = blockOrId.replace('faq_cat_direct_', '')
        await state.update({ directFaqCatId: catId })
        return gotoFlow(faqFlow)
      }

      if (blockOrId === 'human_handoff' || blockOrId === 'derivacion') {
        return gotoFlow(derivacionFlow)
      }

      block = await getBlock(blockOrId)
    } else {
      console.log(`[FlowRenderer] Rendering virtual block: ${blockOrId.id}`)
      block = blockOrId
    }

    if (!block) {
      return await flowDynamic('⚠️ Error: No se pudo cargar el bloque de conversación.')
    }

    const message = this.injectVariables(block.message, state)

    if (block.type === 'message') {
      await state.update({ waitingFor: null })
      await flowDynamic(message)
      if (block.nextBlockId) {
        return await this.renderBlock(block.nextBlockId, flowProps)
      }
    }

    if (block.type === 'question') {
      // In BuilderBot, questions are usually handled via addAnswer.
      // But since we are inside an ACTION, we might need a different approach 
      // or use state to track that we are waiting for an answer.
      await flowDynamic(message)
      await state.update({ waitingFor: block.id })
    }

    if (block.type === 'menu') {
      const optionsText = block.options
        ?.filter(opt => opt.label && opt.label.trim() !== '')
        .map((opt, i) => `${i + 1}. ${opt.label}`)
        .join('\n')
      
      const fullMessage = optionsText ? `${message}\n\n${optionsText}` : message
      await flowDynamic(fullMessage)
      await state.update({ waitingFor: block.id })
    }
  }
}
