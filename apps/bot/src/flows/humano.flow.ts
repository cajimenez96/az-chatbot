import { addKeyword } from "@builderbot/bot";

export const humanoFlow = addKeyword([
  "humano",
  "persona",
  "asesor",
  "ayuda",
]).addAnswer(
  "Entendido. Un asesor humano revisará tu caso en breve. 👨‍💻",
  null,
  async (ctx, { provider }) => {
    // Acción ultra-rápida en segundo plano
    const client = (provider as any).vendor || (provider as any).client;
    
    if (client && client.markIsUnread) {
        console.log(`📩 [Bot] Intentando marcar ${ctx.from} como no leído...`);
        // Lo lanzamos sin el 'await' para que el bot no se quede esperando
        client.markIsUnread(ctx.from).catch((e: any) => console.log('❌ Error al marcar:', e.message));
    }
  },
);
