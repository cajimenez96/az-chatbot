import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { LeadStatus, LeadInterest } from "@az-chatbot/types";

@Entity("leads")
export class Lead {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: false })
  phone!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: "varchar", nullable: true })
  interest?: LeadInterest;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: "varchar", nullable: true })
  vehicle?: string;

  @Column({ type: "varchar", nullable: true })
  budget?: string;

  @Column({ type: "varchar", default: "new" })
  status!: LeadStatus;

  @Column({ nullable: true })
  conversationId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
