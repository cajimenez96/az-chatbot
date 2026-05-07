import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FAQ } from './faq.entity'
import type { CreateFAQDTO, UpdateFAQDTO, FAQCategory } from '@az-chatbot/types'
import { MetricsService } from '../metrics/metrics.service'

@Injectable()
export class FAQsService {
  constructor(
    @InjectRepository(FAQ)
    private readonly repo: Repository<FAQ>,
    private readonly metricsService: MetricsService,
  ) {}

  async findAll(category?: FAQCategory): Promise<FAQ[]> {
    const qb = this.repo.createQueryBuilder('faq').where('faq.active = true')
    if (category) qb.andWhere('faq.category = :category', { category })
    return qb.orderBy('faq.hits', 'DESC').getMany()
  }

  async findAllAdmin(): Promise<FAQ[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async create(dto: CreateFAQDTO): Promise<FAQ> {
    const faq = this.repo.create(dto)
    return this.repo.save(faq)
  }

  async update(id: string, dto: UpdateFAQDTO): Promise<FAQ> {
    const faq = await this.repo.findOne({ where: { id } })
    if (!faq) throw new NotFoundException(`FAQ ${id} not found`)
    Object.assign(faq, dto)
    return this.repo.save(faq)
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id)
  }

  async incrementHits(id: string): Promise<void> {
    await this.repo.increment({ id }, 'hits', 1)
    await this.metricsService.registerEvent({ event: 'faq_served' })
  }

  async findByKeyword(keyword: string): Promise<FAQ | null> {
    const faqs = await this.findAll()
    const lower = keyword.toLowerCase()
    return (
      faqs.find(
        (f) =>
          f.keywords?.some((k) => lower.includes(k.toLowerCase())) ||
          f.question.toLowerCase().includes(lower),
      ) ?? null
    )
  }
}
