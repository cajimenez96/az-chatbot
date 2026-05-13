import { Injectable, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common'
import type { IBlock } from '@az-chatbot/types'
import { CreateBlockDto } from './dto/create-block.dto'
import { UpdateBlockDto } from './dto/update-block.dto'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class BlocksService implements OnModuleInit {
  private readonly jsonPath = path.join(process.cwd(), 'data', 'blocks.json')

  onModuleInit() {
    const dir = path.dirname(this.jsonPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(this.jsonPath)) fs.writeFileSync(this.jsonPath, '[]')
  }

  private readJSON(): IBlock[] {
    try {
      const data = fs.readFileSync(this.jsonPath, 'utf8')
      return JSON.parse(data)
    } catch (e) {
      return []
    }
  }

  private writeJSON(data: IBlock[]) {
    fs.writeFileSync(this.jsonPath, JSON.stringify(data, null, 2))
  }

  async findAll(): Promise<IBlock[]> {
    return this.readJSON().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  async findOne(id: string): Promise<IBlock> {
    const blocks = this.readJSON()
    const block = blocks.find((b) => b.id.trim() === id.trim())
    if (!block) throw new NotFoundException(`Block with ID ${id} not found`)
    return block
  }

  async create(dto: CreateBlockDto): Promise<IBlock> {
    const now = new Date()
    const block: IBlock = {
      id: dto.id || Math.random().toString(36).substring(2, 11),
      ...dto,
      createdAt: now,
      updatedAt: now,
    } as IBlock

    const blocks = this.readJSON()
    blocks.push(block)
    this.writeJSON(blocks)
    return block
  }

  async update(id: string, dto: UpdateBlockDto): Promise<IBlock> {
    const blocks = this.readJSON()
    const index = blocks.findIndex((b) => b.id.trim() === id.trim())
    if (index === -1) throw new NotFoundException(`Block with ID ${id} not found`)

    const updated = {
      ...blocks[index],
      ...dto,
      updatedAt: new Date(),
    } as IBlock

    blocks[index] = updated
    this.writeJSON(blocks)
    return updated
  }

  async remove(id: string): Promise<void> {
    if (id.trim().toLowerCase() === 'welcome') {
      throw new BadRequestException('El bloque welcome es vital y no puede ser eliminado.')
    }
    const blocks = this.readJSON().filter((b) => b.id.trim() !== id.trim())
    this.writeJSON(blocks)
  }
}
