import { addKeyword, EVENTS } from "@builderbot/bot";
import {
  updateConversationStatus,
  saveLead,
  getConversationStatus,
  checkLead,
  getBlock,
  findFAQ,
} from "../services/api.service";
import { FlowRenderer } from "../services/flow-renderer.service";
import { faqFlow } from "./faq.flow";
import { derivacionFlow } from "./derivacion.flow";

/**
 * FLUJO DINÁMICO PRINCIPAL
 * Este flujo reemplaza toda la lógica hardcodeada anterior.
 */
export const dynamicFlow = addKeyword(EVENTS.WELCOME)
  .addAction(async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    const waitingFor = state.get("waitingFor");
    console.log(`[Bot Action] From: ${ctx.from}, waitingFor: ${waitingFor}`);

    if (waitingFor) {
      console.log(`[Bot Action] Already in flow, skipping welcome.`);
      return;
    }

    // 2. Verificar estado de la conversación (humano, etc)
    const status = await getConversationStatus(ctx.from);
    if (status === "waiting_human" || status === "human_active") {
      return endFlow();
    }

    const existingLead = await checkLead(ctx.from);
    if (existingLead) {
      await state.update({
        name: existingLead.name,
        email: existingLead.email,
      });
    }

    await updateConversationStatus(ctx.from, "bot_active");

    // 3. Empezar siempre por el bloque 'welcome'
    return await FlowRenderer.renderBlock("welcome", {
      flowDynamic,
      state,
      gotoFlow,
    });
  })
  .addAnswer(
    [],
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow, fallBack }) => {
      const userInput = ctx.body.trim();
      const waitingForId = state.get("waitingFor");
      console.log(
        `[Bot] Received: "${userInput}", Waiting for: ${waitingForId}`,
      );

      if (!waitingForId) return;

      const currentBlock = await getBlock(waitingForId);
      if (!currentBlock) return;

      // 1. PROCESAR RESPUESTA ACTUAL
      if (currentBlock.type === "question" && currentBlock.saveAs) {
        await state.update({ [currentBlock.saveAs]: userInput });
        if (currentBlock.saveAs === "email") {
          const name = state.get("name");
          await saveLead({ phone: ctx.from, name, email: userInput });
        }
      }

      let nextId = currentBlock.nextBlockId;

      // --- LÓGICA ESPECIAL DE FAQs ---
      if (waitingForId === "faq_search_input") {
        const faq = await findFAQ(userInput);
        if (faq) {
          await state.update({ directFaqId: faq.id });
          return gotoFlow(faqFlow);
        } else {
          await flowDynamic(
            "No encontré una respuesta específica para eso, pero podés intentar con otras palabras.",
          );
          return await FlowRenderer.renderBlock("faq_search_input", {
            flowDynamic,
            state,
            gotoFlow,
          });
        }
      }

      if (currentBlock.type === "menu") {
        const optionIndex = parseInt(userInput) - 1;
        const selectedOption = currentBlock.options?.[optionIndex];
        if (selectedOption) {
          nextId = selectedOption.nextBlockId;
        } else {
          await flowDynamic(
            "❌ Opción inválida. Por favor, elegí un número de la lista.",
          );
          return await FlowRenderer.renderBlock(currentBlock, {
            flowDynamic,
            state,
            gotoFlow,
          });
        }
      }

      // 2. RENDERIZAR SIGUIENTE BLOQUE
      if (nextId) {
        // INTERCEPCIÓN DE FLUJOS ESPECIALES
        if (nextId === "faq_search") {
          return gotoFlow(faqFlow);
        }
        if (nextId === "human_handoff" || nextId === "derivacion") {
          return gotoFlow(derivacionFlow);
        }

        await FlowRenderer.renderBlock(nextId, {
          flowDynamic,
          state,
          gotoFlow,
        });

        // Si el siguiente bloque también espera respuesta (es question o menu),
        // usamos fallBack() para que este mismo addAnswer capture el siguiente mensaje.
        const updatedWaitingFor = state.get("waitingFor");
        if (updatedWaitingFor) {
          return fallBack();
        }
      } else {
        // Si no hay más bloques, limpiamos el estado
        await state.update({ waitingFor: null });
      }
    },
  );

// Flujos auxiliares exportados
export { faqFlow, derivacionFlow };
