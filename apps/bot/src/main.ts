import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import { welcomeFlow } from './flows/welcome.flow'
import { autosNuevosFlow } from './flows/autos-nuevos.flow'
import { autosUsadosFlow } from './flows/autos-usados.flow'
import { financiacionFlow } from './flows/financiacion.flow'
import { serviciosFlow } from './flows/servicios.flow'
import { derivacionFlow } from './flows/derivacion.flow'
import { getConversationStatus } from './services/api.service'

/**
 * Main entry point for the BuilderBot
 */
const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        autosNuevosFlow,
        autosUsadosFlow,
        financiacionFlow,
        serviciosFlow,
        derivacionFlow
    ])

    const adapterProvider = createProvider(BaileysProvider)
    const adapterDB = new MemoryDB()

    const { handleMsg } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    // Middleware to check if the bot should answer or if a human is in control
    adapterProvider.on('message', async (ctx) => {
        const status = await getConversationStatus(ctx.from)
        
        // If human is active, we don't process the message through BuilderBot flows
        if (status === 'human_active' || status === 'waiting_human') {
            console.log(`[Bot] Skipping message from ${ctx.from} - Human status: ${status}`)
            return
        }
    })

    console.log('🤖 Renault Bot is ready!')
}

main()
