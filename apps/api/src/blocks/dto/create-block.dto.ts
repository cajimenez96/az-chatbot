import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator'
import type { BlockType, BlockOption } from '@az-chatbot/types'

export class CreateBlockDto {
  @IsString()
  @IsOptional()
  id?: string

  @IsEnum(['message', 'question', 'menu'])
  type!: BlockType

  @IsString()
  message!: string

  @IsArray()
  @IsOptional()
  options?: BlockOption[]

  @IsString()
  @IsOptional()
  saveAs?: string

  @IsString()
  @IsOptional()
  nextBlockId?: string

  @IsOptional()
  createdAt?: any

  @IsOptional()
  updatedAt?: any
}
