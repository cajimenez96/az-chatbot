import { addKeyword } from "@builderbot/bot";
import { updateConversationStatus } from "../services/api.service";

export const derivacionFlow = addKeyword([
  "asesor",
  "humano",
  "persona",
  "ayuda",
]).addAnswer(
  "Entendido. Un asesor humano revisará tu caso en breve. 👨‍💻",
  null,
  async (ctx, { provider }) => {
    await updateConversationStatus(ctx.from, 'waiting_human');
    console.log(`🚀 [Bot] EJECUTANDO FLUJO DE DERIVACIÓN PARA: ${ctx.from}`);
    const client = (provider as any).vendor || (provider as any).client;

    if (!client) {
      console.error(
        "❌ [Bot] No se encontró el cliente de WhatsApp en el proveedor.",
      );
      return;
    }

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    setTimeout(async () => {
      try {
        const client = (provider as any).vendor || (provider as any).client;
        if (!client) return;

        const chatId = ctx.from;
        // 1. ETIQUETAR (Usando método nativo de WPPConnect)
        // Nota: El labelId '13' debe existir en tu WhatsApp Business
        try {
          await client.addOrRemoveLabels(
            [chatId],
            [{ labelId: "13", type: "add" }],
          );
        } catch (e: any) {}

        // 2. MARCAR NO LEÍDO (Usando método nativo de WPPConnect)
        try {
          await client.markUnseenMessage(chatId);
        } catch (e: any) {}
      } catch (e: any) {}
    }, 1000);
  },
);
