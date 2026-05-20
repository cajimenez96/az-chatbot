import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm'
import type { Block } from './block.entity'

@Entity('block_options')
export class BlockOption {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  blockId!: string

  @ManyToOne('Block', 'options', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockId' })
  block!: Relation<Block>

  @Column()
  label!: string

  @Column({ nullable: true })
  nextBlockId?: string

  // nextBlockId es polimórfico: puede ser un ID de bloque real o una
  // instrucción de ruteo del sistema (ej: 'human_handoff', 'faq_search').
  // No se usa FK para permitir ambos casos.
  nextBlock?: Relation<Block>
}
