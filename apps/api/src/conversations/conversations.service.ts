import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Conversation } from './conversation.entity'
import type { ConversationStatus } from '@az-chatbot/types'
import { MetricsService } from '../metrics/metrics.service'

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly repo: Repository<Conversation>,
    private readonly metricsService: MetricsService,
  ) {}

  async upsert(phone: string): Promise<Conversation> {
    let conv = await this.repo.findOne({ where: { phone } })
    if (!conv) {
      conv = this.repo.create({ phone, status: 'bot_active', lastMessageAt: new Date() })
      await this.repo.save(conv)
      await this.metricsService.registerEvent({ event: 'conversation_started' })
    } else {
      conv.lastMessageAt = new Date()
      await this.repo.save(conv)
    }
    return conv
  }

  async updateStatus(phone: string, status: ConversationStatus): Promise<Conversation> {
    let conv = await this.repo.findOne({ where: { phone } })
    if (!conv) {
      conv = this.repo.create({ phone })
    }
    conv.status = status
    conv.lastMessageAt = new Date()
    return this.repo.save(conv)
  }

  async getStatus(phone: string): Promise<ConversationStatus> {
    const conv = await this.repo.findOne({ where: { phone } })
    return conv?.status ?? 'bot_active'
  }

  async findAll(page = 1, limit = 20) {
    const query = this.repo.createQueryBuilder('conv')
      .leftJoin('leads', 'lead', 'lead.phone = conv.phone')
      .select([
        'conv.id as id',
        'conv.phone as phone',
        'conv.status as status',
        'conv.lastMessageAt as "lastMessageAt"',
        'MAX(lead.name) as "leadName"',
        'MAX(lead.email) as "leadEmail"'
      ])
      .groupBy('conv.id')
      .orderBy('conv.lastMessageAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)

    const data = await query.getRawMany()
    const total = await this.repo.count()

    return { data, total, page, limit }
  }

  async close(phone: string): Promise<Conversation> {
    return this.updateStatus(phone, 'closed')
  }
}
