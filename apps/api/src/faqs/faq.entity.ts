import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { FAQCategory } from '@az-chatbot/types'

@Entity('faqs')
export class FAQ {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  question!: string

  @Column('text')
  answer: string

  @Column({ type: 'varchar', default: 'general' })
  category: FAQCategory

  @Column('simple-array', { nullable: true })
  keywords: string[]

  @Column({ default: true })
  active: boolean

  @Column({ default: 0 })
  hits: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
