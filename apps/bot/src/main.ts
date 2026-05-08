import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import { welcomeFlow } from './flows/welcome.flow'
import { autosNuevosFlow } from './flows/autos-nuevos.flow'
import { autosUsadosFlow } from './flows/autos-usados.flow'
import { financiacionFlow } from './flows/financiacion.flow'
import { serviciosFlow } from './flows/servicios.flow'
import { derivacionFlow } from './flows/derivacion.flow'
import { sendQrToApi, sendConnectedStatus } from './services/api.service'

const main = async () => {
    console.log('🚀 [Renault] Iniciando motor Baileys...')

    const adapterDB = new MemoryDB()
    const adapterFlow = createFlow([
        welcomeFlow,
        autosNuevosFlow,
        autosUsadosFlow,
        financiacionFlow,
        serviciosFlow,
        derivacionFlow
    ])

    const adapterProvider = createProvider(BaileysProvider, {
        name: 'renault-bot'
    })

    // Sincronización con el Dashboard
    adapterProvider.on('qr', async (qr: string) => {
        console.log('✨ [Bot] QR generado. Sincronizando con Dashboard...')
        await sendQrToApi(qr)
    })

    adapterProvider.on('ready', async () => {
        console.log('✅ [Bot] ¡CONEXIÓN EXITOSA!')
        await sendConnectedStatus(true)
    })

    try {
        await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })
        console.log('🤖 [Renault] Bot activo.')
    } catch (err) {
        console.error('❌ [Error] Falló el arranque:', err)
    }
}

main()
