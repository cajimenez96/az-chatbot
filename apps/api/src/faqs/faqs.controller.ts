import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FAQsService } from './faqs.service'
import type { CreateFAQDTO, UpdateFAQDTO, FAQCategory } from '@az-chatbot/types'

@Controller('faqs')
export class FAQsController {
  constructor(private readonly faqsService: FAQsService) {}

  // Public — bot uses this
  @Get()
  async findAll(@Query('category') category?: FAQCategory) {
    return this.faqsService.findAll(category)
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.faqsService.findByKeyword(q)
  }

  // Dashboard — JWT protected
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAllAdmin() {
    return this.faqsService.findAllAdmin()
  }

  // Public — bot uses this
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id)
  }

  @Patch(':id/hit')
  async hit(@Param('id') id: string) {
    await this.faqsService.incrementHits(id)
    return { ok: true }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateFAQDTO) {
    return this.faqsService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFAQDTO) {
    return this.faqsService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.faqsService.remove(id)
    return { ok: true }
  }

  // --- CATEGORIES ---
  @Get('categories/all')
  async getCategories() {
    return this.faqsService.findAllCategories()
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  async createCategory(@Body('label') label: string) {
    return this.faqsService.addCategory(label)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  async removeCategory(@Param('id') id: string) {
    await this.faqsService.removeCategory(id)
    return { ok: true }
  }
}
