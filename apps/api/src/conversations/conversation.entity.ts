import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { ConversationStatus } from '@az-chatbot/types'

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  phone: string

  @Column({ type: 'varchar', default: 'bot_active' })
  status: ConversationStatus

  @Column({ nullable: true })
  assignedTo?: string

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
