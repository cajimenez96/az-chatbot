import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DailyMetric } from './metric.entity'
import type { RegisterEventDTO } from '@az-chatbot/types'

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(DailyMetric)
    private readonly repo: Repository<DailyMetric>,
  ) {}

  private today(): string {
    return new Date().toISOString().slice(0, 10)
  }

  private async getOrCreate(date: string): Promise<DailyMetric> {
    let metric = await this.repo.findOne({ where: { date } })
    if (!metric) {
      metric = this.repo.create({ date })
      await this.repo.save(metric)
    }
    return metric
  }

  async registerEvent(dto: RegisterEventDTO): Promise<void> {
    const date = dto.date ?? this.today()
    const columnMap: Record<RegisterEventDTO['event'], keyof DailyMetric> = {
      conversation_started: 'conversationsTotal',
      lead_captured: 'leadsTotal',
      derivation_requested: 'derivationsTotal',
      derivation_answered: 'derivationsAnswered',
      faq_served: 'faqsServed',
    }
    const column = columnMap[dto.event]
    await this.getOrCreate(date)
    await this.repo.increment({ date }, column as string, 1)
  }

  async getSummary(days = 30): Promise<DailyMetric[]> {
    return this.repo.find({
      order: { date: 'DESC' },
      take: days,
    })
  }

  async getToday(): Promise<DailyMetric> {
    return this.getOrCreate(this.today())
  }
}
