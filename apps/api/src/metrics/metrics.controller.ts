import { Controller, Get, Post, Body, Query, UseGuards, Headers, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { MetricsService } from './metrics.service'
import type { RegisterEventDTO } from '@az-chatbot/types'

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly config: ConfigService,
  ) {}

  // Bot registers events
  @Post('event')
  async registerEvent(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: RegisterEventDTO,
  ) {
    if (apiKey !== this.config.get('BOT_API_KEY')) {
      throw new UnauthorizedException('Invalid API key')
    }
    await this.metricsService.registerEvent(dto)
    return { ok: true }
  }

  // Dashboard reads metrics
  @UseGuards(JwtAuthGuard)
  @Get()
  async getSummary(@Query('days') days = 30) {
    return this.metricsService.getSummary(+days)
  }

  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getToday() {
    return this.metricsService.getToday()
  }
}
