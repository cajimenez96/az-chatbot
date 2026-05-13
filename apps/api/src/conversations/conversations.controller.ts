import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ConversationsService } from './conversations.service'
import type { ConversationStatus } from '@az-chatbot/types'
import { UpdateStatusDto } from './dto/update-status.dto'

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly config: ConfigService,
  ) {}

  // Bot calls this to check/update status
  @Patch(':phone/status')
  async updateStatus(
    @Headers('x-api-key') apiKey: string,
    @Param('phone') phone: string,
    @Body() dto: UpdateStatusDto,
  ) {
    if (apiKey !== this.config.get('BOT_API_KEY')) {
      throw new UnauthorizedException('Invalid API key')
    }
    return this.conversationsService.updateStatus(phone, dto.status)
  }

  @Get(':phone/status')
  async getStatus(
    @Headers('x-api-key') apiKey: string,
    @Param('phone') phone: string,
  ) {
    if (apiKey !== this.config.get('BOT_API_KEY')) {
      throw new UnauthorizedException('Invalid API key')
    }
    const status = await this.conversationsService.getStatus(phone)
    return { phone, status }
  }

  // Dashboard
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.conversationsService.findAll(+page, +limit)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':phone/close')
  async close(@Param('phone') phone: string) {
    return this.conversationsService.close(phone)
  }
}
