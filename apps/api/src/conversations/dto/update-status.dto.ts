import { IsEnum } from 'class-validator'
import type { ConversationStatus } from '@az-chatbot/types'

export class UpdateStatusDto {
  @IsEnum(['bot_active', 'waiting_human', 'human_active', 'closed'])
  status!: ConversationStatus
}
