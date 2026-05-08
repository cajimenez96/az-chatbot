import { addKeyword } from "@builderbot/bot";

export const derivacionFlow = addKeyword([
  "asesor",
  "humano",
  "persona",
  "ayuda",
]).addAnswer(
  "Entendido. Un asesor humano revisará tu caso en breve. 👨‍💻",
  null,
  async (ctx, { provider }) => {
    console.log(`🚀 [Bot] EJECUTANDO FLUJO DE DERIVACIÓN PARA: ${ctx.from}`);
    const client = (provider as any).vendor || (provider as any).client;
    
    if (!client) {
        console.error('❌ [Bot] No se encontró el cliente de WhatsApp en el proveedor.');
        return;
    }

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    setTimeout(async () => {
        try {
            const client = (provider as any).vendor || (provider as any).client;
            if (!client) return;

            const chatId = ctx.from;
            console.log(`🚀 [Bot] FORZANDO ACCIONES PARA: ${chatId}`);

            // 1. ETIQUETAR (Usando método nativo de WPPConnect)
            // Nota: El labelId '13' debe existir en tu WhatsApp Business
            try {
                await client.addOrRemoveLabels([chatId], [{ labelId: '13', type: 'add' }]);
                console.log('✅ Etiqueta agregada con éxito.');
            } catch (e: any) {
                console.log('❌ Error al agregar etiqueta:', e.message);
            }

            // 2. MARCAR NO LEÍDO (Usando método nativo de WPPConnect)
            try {
                await client.markUnseenMessage(chatId);
                console.log('✅ Marcado como no leído con éxito.');
            } catch (e: any) {
                console.log('❌ Error al marcar como no leído:', e.message);
            }
            
            console.log(`✅ [Bot] Fin de proceso para ${chatId}`);
        } catch (e: any) {
            console.error(`❌ [Bot] Error general:`, e.message);
        }
    }, 1000);
  },
);
