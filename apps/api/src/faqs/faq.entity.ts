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

  @Column({ default: 'message' })
  type!: 'message' | 'question' | 'menu'

  @Column()
  question!: string

  @Column('text', { nullable: true })
  message!: string

  @Column({ type: 'varchar', default: 'general' })
  category!: string

  @Column('simple-array', { nullable: true })
  keywords!: string[]

  @Column('json', { nullable: true })
  options?: any[]

  @Column({ nullable: true })
  saveAs?: string

  @Column({ nullable: true })
  nextBlockId?: string

  @Column({ default: true })
  active!: boolean

  @Column({ default: 0 })
  hits!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
