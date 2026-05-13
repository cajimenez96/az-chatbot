import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FAQ } from "./faq.entity";
import type { CreateFAQDTO } from "@az-chatbot/types";
import { MetricsService } from "../metrics/metrics.service";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FAQsService implements OnModuleInit {
  private readonly jsonPath = path.join(process.cwd(), "data", "faqs.json");
  private readonly categoriesPath = path.join(
    process.cwd(),
    "data",
    "faq-categories.json"
  );
  private useJson = true;

  constructor(
    @InjectRepository(FAQ)
    private readonly repo: Repository<FAQ>,
    private readonly metricsService: MetricsService
  ) {}

  onModuleInit() {
    this.useJson = process.env.PERSISTENCE === 'json' || true
    console.log(`[FAQsService] Using JSON persistence at: ${this.jsonPath}`)
    
    if (!fs.existsSync(path.dirname(this.jsonPath))) {
      fs.mkdirSync(path.dirname(this.jsonPath), { recursive: true })
    }
    if (!fs.existsSync(this.jsonPath)) {
      fs.writeFileSync(this.jsonPath, JSON.stringify([]))
    }
    // ... resto del onModuleInit

    // Asegurar que existe el menú principal de FAQs
    if (this.useJson) {
      const faqs = this.readJSON()
      const hasMainMenu = faqs.find((f: any) => f.id === 'main_faq_menu')
      if (!hasMainMenu) {
        const mainMenu = {
          id: 'main_faq_menu',
          type: 'menu',
          question: 'Menú Principal de FAQs',
          message: 'Entendido. ¿Sobre qué tema te gustaría consultar? 🔍',
          category: 'general',
          keywords: ['menu', 'ayuda', 'preguntas'],
          options: [
            { id: 'opt_gen', label: 'General', nextBlockId: 'faq_cat_direct_general' },
            { id: 'opt_search', label: '🔍 Buscar por texto', nextBlockId: 'faq_search_input' }
          ],
          active: true,
          hits: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        faqs.push(mainMenu as any)
        this.writeJSON(faqs)
      }
    }
  }

  private readJSON(): FAQ[] {
    try {
      const data = fs.readFileSync(this.jsonPath, 'utf8')
      const faqs = JSON.parse(data)
      return faqs.map((f: any) => ({
        ...f,
        id: f.id,
        type: f.type || 'message',
        question: f.question || '',
        message: f.message || f.answer || '',
        category: f.category || 'general',
        active: f.active ?? true,
      })) as FAQ[]
    } catch (e) {
      console.error(`[FAQsService] Error reading JSON:`, e)
      return []
    }
  }

  private writeJSON(faqs: FAQ[]) {
    fs.writeFileSync(this.jsonPath, JSON.stringify(faqs, null, 2));
  }

  // --- Categorías ---
  async findAllCategories() {
    try {
      if (fs.existsSync(this.categoriesPath)) {
        return JSON.parse(fs.readFileSync(this.categoriesPath, "utf-8"));
      }
      return [{ id: "general", label: "General" }];
    } catch (e) {
      return [{ id: "general", label: "General" }];
    }
  }

  async addCategory(label: string) {
    const cats = await this.findAllCategories();
    const newCat = {
      id: label.toLowerCase().replace(/\s+/g, "_"),
      label,
    };
    cats.push(newCat);
    fs.writeFileSync(this.categoriesPath, JSON.stringify(cats, null, 2));
    return newCat;
  }

  async deleteCategory(id: string) {
    const cats = await this.findAllCategories();
    const filtered = cats.filter((c: any) => c.id !== id);
    fs.writeFileSync(this.categoriesPath, JSON.stringify(filtered, null, 2));
  }

  // --- FAQs ---
  async findAll(category?: string): Promise<FAQ[]> {
    if (this.useJson) {
      let faqs = this.readJSON().filter((f: FAQ) => f.active)
      if (category) faqs = faqs.filter((f: FAQ) => f.category === category)
      return faqs.sort((a, b) => (b.hits || 0) - (a.hits || 0))
    }
    const qb = this.repo.createQueryBuilder('faq').where('faq.active = true')
    if (category) qb.andWhere('faq.category = :category', { category })
    return qb.orderBy('faq.hits', 'DESC').getMany()
  }

  async findAllAdmin(): Promise<FAQ[]> {
    if (this.useJson) {
      return this.readJSON().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<FAQ> {
    if (this.useJson) {
      const faq = this.readJSON().find((f: FAQ) => f.id === id)
      if (!faq) throw new NotFoundException(`FAQ ${id} not found`)
      return faq
    }
    const faq = await this.repo.findOne({ where: { id } })
    if (!faq) throw new NotFoundException(`FAQ ${id} not found`)
    return faq
  }

  async create(dto: CreateFAQDTO): Promise<FAQ> {
    console.log(`[FAQsService] Creating FAQ:`, dto)
    if (this.useJson) {
      const now = new Date()
      const faq = {
        id: dto.id || Math.random().toString(36).substring(2, 11),
        type: dto.type || 'message',
        question: dto.question,
        message: dto.message || (dto as any).answer || '',
        category: dto.category || 'general',
        keywords: dto.keywords || [],
        options: dto.options || [],
        saveAs: dto.saveAs,
        nextBlockId: dto.nextBlockId,
        active: true,
        hits: 0,
        createdAt: now,
        updatedAt: now,
      } as FAQ

      const faqs = this.readJSON()
      faqs.push(faq)
      this.writeJSON(faqs)
      console.log(`[FAQsService] FAQ saved to JSON: ${faq.id}`)
      return faq
    }

    const entity = this.repo.create(dto as any)
    const saved = await this.repo.save(entity)
    return saved as unknown as FAQ
  }

  async update(id: string, dto: any): Promise<FAQ> {
    console.log(`[FAQsService] Updating FAQ ${id}:`, dto)
    if (this.useJson) {
      const faqs = this.readJSON()
      const index = faqs.findIndex((f: FAQ) => f.id === id)
      if (index === -1) throw new NotFoundException(`FAQ ${id} not found`)

      // Mapear answer a message si viene del dashboard viejo
      if (dto.answer && !dto.message) {
        dto.message = dto.answer
      }

      const updated = {
        ...faqs[index],
        ...dto,
        updatedAt: new Date(),
      }
      faqs[index] = updated as FAQ
      this.writeJSON(faqs)
      console.log(`[FAQsService] FAQ updated in JSON: ${id}`)
      return updated as FAQ
    }

    const faq = await this.repo.findOne({ where: { id } })
    if (!faq) throw new NotFoundException(`FAQ ${id} not found`)
    Object.assign(faq, dto)
    const saved = await this.repo.save(faq)
    return saved as unknown as FAQ
  }

  async remove(id: string): Promise<void> {
    if (id === 'main_faq_menu') {
      throw new Error('No se puede eliminar el menú principal de FAQs')
    }
    if (this.useJson) {
      const faqs = this.readJSON().filter((f: FAQ) => f.id !== id)
      this.writeJSON(faqs)
      return
    }
    await this.repo.delete(id)
  }

  async incrementHits(id: string): Promise<void> {
    if (this.useJson) {
      const faqs = this.readJSON()
      const index = faqs.findIndex((f: FAQ) => f.id === id)
      if (index !== -1) {
        faqs[index].hits = (faqs[index].hits || 0) + 1
        this.writeJSON(faqs)
      }
    } else {
      await this.repo.increment({ id }, 'hits', 1)
    }
    await this.metricsService.registerEvent({ event: 'faq_served' })
  }

  async findByKeyword(keyword: string): Promise<FAQ | null> {
    const faqs = await this.findAll()
    const lower = keyword.toLowerCase()
    return (
      faqs.find(
        (f: FAQ) =>
          f.keywords?.some((k: string) => lower.includes(k.toLowerCase())) ||
          f.question.toLowerCase().includes(lower),
      ) ?? null
    )
  }
}
