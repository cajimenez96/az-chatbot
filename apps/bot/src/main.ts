import 'dotenv/config'
import { createBot, createFlow, MemoryDB } from "@builderbot/bot";
import { WPPConnectProvider } from "@builderbot/provider-wppconnect";
import { dynamicFlow, faqFlow } from "./flows/welcome.flow";
import { derivacionFlow } from "./flows/derivacion.flow";
import { sendQrToApi, sendConnectedStatus } from "./services/api.service";
import * as wppconnect from "@wppconnect-team/wppconnect";

process.env.DEBUG = "wppconnect:*";

const main = async () => {
  console.log("🚀 [Renault] Iniciando motor (MODO FORZADO)...");

  // ... (rest of the logic)

  const adapterDB = new MemoryDB();
  const adapterFlow = createFlow([
    dynamicFlow,
    faqFlow,
    derivacionFlow,
  ]);

  // Inicializamos el proveedor
  const adapterProvider = new WPPConnectProvider({
    name: "renault-bot",
    headless: true,
    useChrome: true,
    logQR: true,
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  } as any);

  // Listeners de emergencia
  adapterProvider.on("qr", (qr: string) => {
    sendQrToApi(qr);
  });

  try {
    const client = await wppconnect.create({
      session: "renault-bot",
      deviceName: "Bot Renault Gestión",
      autoClose: 0,
      headless: true,
      useChrome: true,
      updatesLog: true,
      logQR: true,
      browserArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
      catchQR: (base64Qr, asciiQR, attempt, urlCode) => {
        if (urlCode) {
          sendQrToApi(urlCode);
        }
      },
    });

    // Inyección reforzada: Seteamos en múltiples propiedades por si acaso
    const provAny = adapterProvider as any;
    provAny.client = client;
    provAny.vendor = client;
    provAny.instance = client;

    await createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    // Volvemos a setear después de createBot por si la librería lo limpió
    provAny.vendor = client;
    provAny.client = client;

    // NOTIFICAR CONEXIÓN EXITOSA
    sendConnectedStatus(true);
    // Listener para cambios de estado con FILTRO
    let lastKnownStatus: boolean | null = null;

    client.onStateChange((state: any) => {
      const s = String(state).toUpperCase();
      const isConnected = s.includes("CONNECTED");
      if (isConnected !== lastKnownStatus) {
        lastKnownStatus = isConnected;
        sendConnectedStatus(isConnected);
      }
    });

    // PUENTE MANUAL DE MENSAJES (Para que BuilderBot sepa que llegó algo)
    client.onMessage((message: any) => {
      if (message.from !== "status@broadcast") {
        adapterProvider.emit("message", message);
      }
    });
  } catch (err: any) {
    console.error("❌ [ERROR DE MOTOR] Falló el arranque de WPPConnect:", err);
    console.error("Stack Trace:", err.stack);
  }
};

// Captura de errores globales
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ [Unhandled Rejection] Razón:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ [Uncaught Exception] Error:", err);
});

main();
