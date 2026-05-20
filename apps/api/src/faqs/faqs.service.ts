import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { CreateFAQDTO } from "@az-chatbot/types";
import { MetricsService } from "../metrics/metrics.service";
import { BlocksService } from "../blocks/blocks.service";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FAQsService implements OnModuleInit {
  private readonly categoriesPath = path.join(
    process.cwd(),
    "data",
    "faq-categories.json"
  );

  constructor(
    private readonly blocksService: BlocksService,
    private readonly metricsService: MetricsService
  ) {}

  onModuleInit() {
    // Categories folder init
    const dir = path.dirname(this.categoriesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.categoriesPath)) {
      fs.writeFileSync(this.categoriesPath, JSON.stringify([{ id: "general", label: "General" }], null, 2));
    }
  }

  // --- Categorías (Stored in JSON) ---
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

  async removeCategory(id: string) {
    return this.deleteCategory(id);
  }

  // --- FAQs (Delegating to BlocksService) ---
  async findAll(category?: string): Promise<any[]> {
    const blocks = await this.blocksService.findAllFaqs(category);
    // Map blocks to the expected shape of FAQs
    return blocks.map(b => ({
      ...b,
      question: b.question || '',
    }));
  }

  async findAllAdmin(): Promise<any[]> {
    const blocks = await this.blocksService.findAll();
    return blocks
      .filter(b => b.isFaq)
      .map(b => ({
        ...b,
        question: b.question || '',
      }));
  }

  async findOne(id: string): Promise<any> {
    const block = await this.blocksService.findOne(id);
    return {
      ...block,
      question: block.question || '',
    };
  }

  async create(dto: CreateFAQDTO): Promise<any> {
    console.log(`[FAQsService] Delegating FAQ creation to BlocksService:`, dto);
    
    // Ensure answer is mapped to message if received from legacy front
    const message = dto.message || (dto as any).answer || '';
    
    const block = await this.blocksService.create({
      id: dto.id,
      type: dto.type || 'message',
      message,
      question: dto.question,
      category: dto.category || 'general',
      keywords: dto.keywords || [],
      options: dto.options || [],
      saveAs: dto.saveAs,
      nextBlockId: dto.nextBlockId,
      isFaq: true,
      active: true,
    });

    return {
      ...block,
      question: block.question || '',
    };
  }

  async update(id: string, dto: any): Promise<any> {
    console.log(`[FAQsService] Delegating FAQ update to BlocksService:`, id, dto);

    // Map legacy answer to message
    if (dto.answer && !dto.message) {
      dto.message = dto.answer;
    }

    const block = await this.blocksService.update(id, {
      ...dto,
      isFaq: true,
    });

    return {
      ...block,
      question: block.question || '',
    };
  }

  async remove(id: string): Promise<void> {
    if (id === 'main_faq_menu') {
      throw new Error('No se puede eliminar el menú principal de FAQs');
    }
    await this.blocksService.remove(id);
  }

  async incrementHits(id: string): Promise<void> {
    await this.blocksService.incrementHits(id);
    await this.metricsService.registerEvent({ event: 'faq_served' });
  }

  async findByKeyword(keyword: string): Promise<any | null> {
    const block = await this.blocksService.findFaqByKeyword(keyword);
    if (!block) return null;
    return {
      ...block,
      question: block.question || '',
    };
  }
}
