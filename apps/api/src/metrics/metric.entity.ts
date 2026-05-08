import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

@Entity('daily_metrics')
export class DailyMetric {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  date!: string // YYYY-MM-DD

  @Column({ default: 0 })
  conversationsTotal: number

  @Column({ default: 0 })
  leadsTotal: number

  @Column({ default: 0 })
  derivationsTotal: number

  @Column({ default: 0 })
  derivationsAnswered: number

  @Column({ default: 0 })
  faqsServed: number

  @CreateDateColumn()
  createdAt: Date
}
