import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { BlockOption } from './block-option.entity'
import type { BlockType } from '@az-chatbot/types'

@Entity('blocks')
export class Block {
  @PrimaryColumn({ type: 'varchar' })
  id!: string

  @Column({ type: 'varchar', nullable: true })
  tenantId?: string

  @Column({ type: 'varchar', default: 'message' })
  type!: BlockType

  @Column('text')
  message!: string

  @OneToMany(() => BlockOption, (option) => option.block, { cascade: true, eager: true })
  options?: BlockOption[]

  @Column({ type: 'varchar', nullable: true })
  saveAs?: string

  @Column({ type: 'varchar', nullable: true })
  nextBlockId?: string

  // nextBlockId es polimórfico: puede ser un ID de bloque real o una
  // instrucción de ruteo del sistema (ej: 'human_handoff', 'faq_search').
  // No se usa FK para permitir ambos casos.
  nextBlock?: Block

  @Column({ type: 'boolean', default: false })
  isFaq!: boolean

  @Column({ type: 'varchar', nullable: true })
  question?: string

  @Column('simple-array', { nullable: true })
  keywords?: string[]

  @Column({ type: 'varchar', default: 'general', nullable: true })
  category?: string

  @Column({ type: 'boolean', default: true })
  active!: boolean

  @Column({ type: 'integer', default: 0 })
  hits!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
