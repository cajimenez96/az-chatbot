import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { LeadsService } from './leads.service'
import { CreateLeadDto } from './dto/create-lead.dto'

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly config: ConfigService,
  ) {}

  // Bot calls this — authenticated via API key
  @Post()
  async create(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: CreateLeadDto,
  ) {
    if (apiKey !== this.config.get('BOT_API_KEY')) {
      throw new UnauthorizedException('Invalid API key')
    }
    return this.leadsService.create(dto)
  }

  // Dashboard calls these — authenticated via JWT
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('phone') phone?: string,
  ) {
    return this.leadsService.findAll({ page: +page, limit: +limit, status, phone })
  }

  // Bot check for existing lead
  @Get('check/:phone')
  async checkExistence(
    @Headers('x-api-key') apiKey: string,
    @Param('phone') phone: string,
  ) {
    if (apiKey !== this.config.get('BOT_API_KEY')) {
      throw new UnauthorizedException('Invalid API key')
    }
    return this.leadsService.findByPhone(phone)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.leadsService.updateStatus(id, status as any)
  }
}
