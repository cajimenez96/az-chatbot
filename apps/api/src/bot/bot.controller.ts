import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard) // El Dashboard necesita estar logueado para ver esto
  getStatus() {
    return this.botService.getStatus();
  }

  @Post('qr')
  updateQr(@Body() data: { qr: string }) {
    // Aquí podríamos validar un API_KEY si quisiéramos más seguridad
    this.botService.setQrCode(data.qr);
    return { success: true };
  }

  @Post('connected')
  updateConnected(@Body() data: { connected: boolean }) {
    this.botService.setConnected(data.connected);
    return { success: true };
  }
}
