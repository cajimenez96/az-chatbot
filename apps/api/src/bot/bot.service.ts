import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  private qrCode: string | null = null;
  private isConnected = false;

  setQrCode(qr: string) {
    this.qrCode = qr;
    this.isConnected = false;
  }

  setConnected(status: boolean) {
    this.isConnected = status;
    if (status) this.qrCode = null; // Si se conectó, borramos el QR
  }

  getStatus() {
    return {
      qrCode: this.qrCode,
      isConnected: this.isConnected,
    };
  }
}
