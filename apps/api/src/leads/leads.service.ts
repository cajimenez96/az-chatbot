import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lead } from './lead.entity'
import { CreateLeadDto } from './dto/create-lead.dto'
import type { LeadStatus } from '@az-chatbot/types'
import { MetricsService } from '../metrics/metrics.service'

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly repo: Repository<Lead>,
    private readonly metricsService: MetricsService,
  ) {}

  async create(dto: CreateLeadDto): Promise<Lead> {
    const { phone } = dto
    if (!phone) throw new Error('Phone is required to create a lead')

    let lead = await this.findByPhone(phone)

    if (lead) {
      Object.assign(lead, dto)
    } else {
      lead = this.repo.create(dto)
    }

    const saved = await this.repo.save(lead)
    await this.metricsService.registerEvent({ event: 'lead_captured' })
    return saved
  }

  async findAll(opts: { page: number; limit: number; status?: string; phone?: string }) {
    const { page, limit, status, phone } = opts
    const qb = this.repo.createQueryBuilder('lead')

    if (status) qb.andWhere('lead.status = :status', { status })
    if (phone) qb.andWhere('lead.phone LIKE :phone', { phone: `%${phone}%` })

    const [data, total] = await qb
      .orderBy('lead.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { data, total, page, limit }
  }

  async findByPhone(phone: string): Promise<Lead | null> {
    return this.repo.findOne({ where: { phone } })
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.repo.findOne({ where: { id } })
    if (!lead) throw new NotFoundException(`Lead ${id} not found`)
    return lead
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const lead = await this.findOne(id)
    lead.status = status
    return this.repo.save(lead)
  }
}
