import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator'
import type { BlockType, BlockOption } from '@az-chatbot/types'

export class UpdateBlockDto {
  @IsString()
  @IsOptional()
  id?: string

  @IsEnum(['message', 'question', 'menu'])
  @IsOptional()
  type?: BlockType

  @IsString()
  @IsOptional()
  message?: string

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
