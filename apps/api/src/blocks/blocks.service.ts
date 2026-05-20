import { Injectable, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Block } from './entities/block.entity'
import { BlockOption } from './entities/block-option.entity'
import { CreateBlockDto } from './dto/create-block.dto'
import { UpdateBlockDto } from './dto/update-block.dto'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class BlocksService implements OnModuleInit {
  private readonly jsonPath = path.join(process.cwd(), 'data', 'blocks.json')
  private readonly faqsJsonPath = path.join(process.cwd(), 'data', 'faqs.json')

  constructor(
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
    @InjectRepository(BlockOption)
    private readonly optionRepository: Repository<BlockOption>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.blockRepository.count()
      if (count > 0) {
        console.log(`[BlocksService] DB ya contiene ${count} bloques. Omitiendo semillado.`)
        return
      }

      console.log('[BlocksService] Tabla blocks vacía en Postgres. Iniciando semillado automático...')

      // ──────────────────────────────────────────────────────────────────
      // Estrategia de dos pasadas para respetar las FK relacionales:
      //   PASADA 1 → insertar todos los bloques sin nextBlockId (sin links)
      //   PASADA 2 → actualizar nextBlockId de cada bloque para conectar el grafo
      // ──────────────────────────────────────────────────────────────────

      const blockLinks: Array<{ id: string; nextBlockId: string | null }> = []

      // ── PASADA 1A: Insertar bloques del flujo conversacional ──────────
      if (fs.existsSync(this.jsonPath)) {
        const blocksData = JSON.parse(fs.readFileSync(this.jsonPath, 'utf8'))
        for (const raw of blocksData) {
          const { options, nextBlockId, ...rest } = raw
          blockLinks.push({ id: raw.id, nextBlockId: nextBlockId || null })

          const entity = this.blockRepository.create({
            ...rest,
            nextBlockId: null, // sin link por ahora
            isFaq: false,
          }) as any

          if (options && options.length > 0) {
            entity.options = options.map((opt: any) =>
              this.optionRepository.create({
                label: opt.label,
                nextBlockId: opt.nextBlockId || null,
              })
            )
          }
          await this.blockRepository.save(entity)
        }
        console.log(`[BlocksService] Pasada 1: ${blocksData.length} bloques insertados (sin links).`)
      }

      // ── PASADA 1B: Insertar FAQs ──────────────────────────────────────
      if (fs.existsSync(this.faqsJsonPath)) {
        const faqsData = JSON.parse(fs.readFileSync(this.faqsJsonPath, 'utf8'))
        for (const raw of faqsData) {
          const { options, nextBlockId, ...rest } = raw
          blockLinks.push({ id: raw.id, nextBlockId: nextBlockId || null })

          const entity = this.blockRepository.create({
            id: raw.id,
            type: raw.type || 'message',
            message: raw.message || raw.answer || '',
            question: raw.question || '',
            category: raw.category || 'general',
            keywords: raw.keywords || [],
            active: raw.active ?? true,
            hits: raw.hits || 0,
            isFaq: true,
            saveAs: raw.saveAs,
            nextBlockId: null, // sin link por ahora
          }) as any

          if (options && options.length > 0) {
            entity.options = options.map((opt: any) =>
              this.optionRepository.create({
                label: opt.label,
                nextBlockId: opt.nextBlockId || null,
              })
            )
          }
          await this.blockRepository.save(entity)
        }
        console.log(`[BlocksService] Pasada 1: FAQs insertadas (sin links).`)
      }

      // ── PASADA 2: Conectar el grafo (actualizar nextBlockId) ──────────
      let linkedCount = 0
      for (const link of blockLinks) {
        if (!link.nextBlockId) continue
        // Solo linkear si el bloque destino existe en la DB
        const targetExists = await this.blockRepository.existsBy({ id: link.nextBlockId })
        if (targetExists) {
          await this.blockRepository.update({ id: link.id }, { nextBlockId: link.nextBlockId })
          linkedCount++
        } else {
          console.warn(`[BlocksService] Pasada 2: nextBlockId="${link.nextBlockId}" no encontrado, link omitido.`)
        }
      }
      console.log(`[BlocksService] Pasada 2: ${linkedCount} links de grafo conectados exitosamente.`)
    } catch (e) {
      console.error('[BlocksService] Error en semillado automático:', e)
    }
  }

  async findAll(): Promise<Block[]> {
    return this.blockRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['options'],
    })
  }

  async findOne(id: string): Promise<Block> {
    const block = await this.blockRepository.findOne({
      where: { id: id.trim() },
      relations: ['options'],
    })
    if (!block) throw new NotFoundException(`Block with ID ${id} not found`)
    return block
  }

  async create(dto: CreateBlockDto): Promise<Block> {
    const { options, ...rest } = dto
    const id = dto.id || Math.random().toString(36).substring(2, 11)
    
    // Check duplication
    const exists = await this.blockRepository.findOne({ where: { id } })
    if (exists) {
      throw new BadRequestException(`Block with ID ${id} already exists`)
    }

    const block = this.blockRepository.create({
      id,
      ...rest,
    })

    if (options && options.length > 0) {
      block.options = options.map((opt: any) =>
        this.optionRepository.create({
          label: opt.label,
          nextBlockId: opt.nextBlockId,
        })
      )
    }

    return this.blockRepository.save(block)
  }

  async update(id: string, dto: UpdateBlockDto): Promise<Block> {
    const block = await this.blockRepository.findOne({
      where: { id: id.trim() },
      relations: ['options'],
    })
    if (!block) throw new NotFoundException(`Block with ID ${id} not found`)

    const { options, ...rest } = dto
    Object.assign(block, rest)

    if (options !== undefined) {
      if (block.options && block.options.length > 0) {
        await this.optionRepository.remove(block.options)
      }
      block.options = options.map((opt: any) =>
        this.optionRepository.create({
          label: opt.label,
          nextBlockId: opt.nextBlockId,
        })
      )
    }

    return this.blockRepository.save(block)
  }

  async remove(id: string): Promise<void> {
    const trimmedId = id.trim()
    if (trimmedId.toLowerCase() === 'welcome') {
      throw new BadRequestException('El bloque welcome es vital y no puede ser eliminado.')
    }
    const block = await this.blockRepository.findOne({ where: { id: trimmedId } })
    if (!block) throw new NotFoundException(`Block with ID ${id} not found`)
    
    await this.blockRepository.remove(block)
  }

  // --- Unified FAQ Helpers for delegators ---
  async findAllFaqs(category?: string): Promise<Block[]> {
    const qb = this.blockRepository.createQueryBuilder('block')
      .leftJoinAndSelect('block.options', 'options')
      .where('block.isFaq = :isFaq', { isFaq: true })
      .andWhere('block.active = :active', { active: true })

    if (category) {
      qb.andWhere('block.category = :category', { category })
    }

    return qb.orderBy('block.hits', 'DESC').getMany()
  }

  async findFaqByKeyword(keyword: string): Promise<Block | null> {
    const faqs = await this.findAllFaqs()
    const lower = keyword.toLowerCase()
    return (
      faqs.find(
        (f) =>
          f.keywords?.some((k) => lower.includes(k.toLowerCase())) ||
          f.question?.toLowerCase().includes(lower)
      ) ?? null
    )
  }

  async incrementHits(id: string): Promise<void> {
    await this.blockRepository.increment({ id }, 'hits', 1)
  }

  async validateFlowGraph(): Promise<{
    isValid: boolean
    cycles: string[][]
    unreachable: string[]
  }> {
    const blocks = await this.blockRepository.find({ relations: ['options'] })
    
    // Build adjacency list
    const adj: Record<string, string[]> = {}
    for (const b of blocks) {
      adj[b.id] = []
      if (b.nextBlockId) {
        adj[b.id].push(b.nextBlockId)
      }
      if (b.options) {
        for (const opt of b.options) {
          if (opt.nextBlockId) {
            adj[b.id].push(opt.nextBlockId)
          }
        }
      }
    }

    const cycles: string[][] = []
    const visited = new Set<string>()
    const recursionStack: string[] = []

    const detectCycles = (node: string) => {
      visited.add(node)
      recursionStack.push(node)

      const neighbors = adj[node] || []
      for (const neighbor of neighbors) {
        if (!recursionStack.includes(neighbor)) {
          if (!visited.has(neighbor)) {
            detectCycles(neighbor)
          }
        } else {
          // Cycle detected!
          const cycleStartIndex = recursionStack.indexOf(neighbor)
          const cyclePath = [...recursionStack.slice(cycleStartIndex), neighbor]
          cycles.push(cyclePath)
        }
      }

      recursionStack.pop()
    }

    // Run cycle detection across all nodes
    for (const b of blocks) {
      if (!visited.has(b.id)) {
        detectCycles(b.id)
      }
    }

    // Detect unreachable blocks starting from the root ('welcome')
    const reached = new Set<string>()
    const traverse = (node: string) => {
      if (reached.has(node)) return
      reached.add(node)
      const neighbors = adj[node] || []
      for (const neighbor of neighbors) {
        traverse(neighbor)
      }
    }

    const hasWelcome = blocks.some(b => b.id === 'welcome')
    if (hasWelcome) {
      traverse('welcome')
    }

    const unreachable = blocks
      .filter(b => !reached.has(b.id) && b.id !== 'welcome')
      .map(b => b.id)

    return {
      isValid: cycles.length === 0,
      cycles,
      unreachable,
    }
  }
}
