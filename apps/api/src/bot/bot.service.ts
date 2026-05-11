import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  
  // Mantenemos estas para compatibilidad por ahora, 
  // pero priorizaremos los datos de Evolution API
  private localQrCode: string | null = null;
  private localIsConnected = false;

  constructor(private configService: ConfigService) {}

  setQrCode(qr: string) {
    this.localQrCode = qr;
    this.localIsConnected = false;
  }

  setConnected(status: boolean) {
    this.localIsConnected = status;
    if (status) this.localQrCode = null;
  }

  async getStatus() {
    const apiUrl = this.configService.get('EVOLUTION_API_URL');
    const apiKey = this.configService.get('EVOLUTION_API_KEY');
    const instance = this.configService.get('EVOLUTION_INSTANCE');

    // 0. PRIORIDAD: Si el bot local (WPPConnect) ya nos mandó un QR o está conectado, usamos eso.
    // Esto evita que el error de Evolution API bloquee la visualización del bot local.
    if (this.localIsConnected || this.localQrCode) {
      return {
        qrCode: this.localQrCode,
        isConnected: this.localIsConnected,
        source: 'local'
      };
    }

    // Si no hay configuración de Evolution, devolvemos lo que tengamos local (que a este punto será null)
    if (!apiUrl || !instance) {
      return {
        qrCode: this.localQrCode,
        isConnected: this.localIsConnected,
      };
    }

    try {
      // 1. Consultamos el estado de la conexión en el servidor
      const response = await fetch(`${apiUrl}/instance/connectionState/${instance}`, {
        headers: { 'apikey': apiKey },
      });

      if (response.status === 404) {
        this.logger.log(`Instancia ${instance} no existe. Creándola...`);
        await this.createInstance(apiUrl, apiKey, instance);
        return { qrCode: null, isConnected: false, message: 'Creando instancia...' };
      }

      const data: any = await response.json();
      const isConnected = data.instance?.state === 'open';

      if (isConnected) {
        return { qrCode: null, isConnected: true };
      }

      // 2. Si no está conectada, pedimos el QR actualizado a Evolution
      const qrResponse = await fetch(`${apiUrl}/instance/connect/${instance}`, {
        headers: { 'apikey': apiKey },
      });
      
      if (!qrResponse.ok) {
          throw new Error(`Evolution API responded with status ${qrResponse.status}`);
      }

      const qrData: any = await qrResponse.json();

      return {
        qrCode: qrData.base64 || qrData.code || null,
        isConnected: false,
      };

    } catch (error) {
      this.logger.error(`Error con Evolution API: ${error.message}`);
      // Fallback a lo local si el servidor falla
      return {
        qrCode: this.localQrCode,
        isConnected: this.localIsConnected,
        error: 'Servidor Evolution API no disponible'
      };
    }
  }

  private async createInstance(apiUrl: string, apiKey: string, instance: string) {
    try {
      const res = await fetch(`${apiUrl}/instance/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': apiKey 
        },
        body: JSON.stringify({
          instanceName: instance,
          token: apiKey,
          qrcode: true
        }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        this.logger.error(`Fallo al crear instancia: ${JSON.stringify(data)}`);
      } else {
        this.logger.log(`Instancia ${instance} creada con éxito.`);
      }
    } catch (e: any) {
      this.logger.error(`Fallo de red al crear instancia: ${e.message}`);
    }
  }
}
