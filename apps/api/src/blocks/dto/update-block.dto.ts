import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsNumber } from 'class-validator'
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

  @IsBoolean()
  @IsOptional()
  isFaq?: boolean

  @IsString()
  @IsOptional()
  question?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[]

  @IsString()
  @IsOptional()
  category?: string

  @IsBoolean()
  @IsOptional()
  active?: boolean

  @IsNumber()
  @IsOptional()
  hits?: number

  @IsOptional()
  createdAt?: any

  @IsOptional()
  updatedAt?: any
}
