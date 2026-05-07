import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FAQ } from '../faqs/faq.entity'

const GENERIC_FAQS = [
  {
    question: '¿Cuáles son los horarios de atención?',
    answer:
      'Nuestros horarios de atención son:\n🗓 Lunes a Viernes: 9:00 a 18:00hs\n🗓 Sábados: 9:00 a 13:00hs\nDomingos: cerrado.',
    category: 'horarios' as const,
    keywords: ['horario', 'horarios', 'atencion', 'abierto', 'cerrado', 'cuando'],
  },
  {
    question: '¿Dónde están ubicados?',
    answer:
      'Estamos ubicados en [Dirección del concesionario]. Podés encontrarnos en Google Maps buscando "Renault [Nombre concesionario]".',
    category: 'ubicacion' as const,
    keywords: ['ubicacion', 'donde', 'direccion', 'como llegar', 'local', 'mapa'],
  },
  {
    question: '¿Tienen modelos eléctricos?',
    answer:
      'Sí, contamos con los modelos eléctricos e híbridos de Renault:\n⚡ Renault Megane E-Tech\n⚡ Renault Kangoo E-Tech\n🔋 Renault Austral E-Tech Hybrid\n\n¿Te gustaría más información sobre alguno en particular?',
    category: 'vehiculos' as const,
    keywords: ['electrico', 'hibrido', 'etech', 'electrica', 'carga', 'autonomia'],
  },
  {
    question: '¿Ofrecen planes de financiación?',
    answer:
      'Sí, contamos con múltiples opciones de financiación:\n💳 Planes propios del concesionario\n🏦 Financiación bancaria con tasas preferenciales\n📋 Planes en cuotas fijas\n\n¿Querés que un asesor te contacte para explicarte las opciones según tu situación?',
    category: 'financiacion' as const,
    keywords: ['financiacion', 'financiar', 'cuotas', 'credito', 'prestamo', 'banco', 'pagar'],
  },
  {
    question: '¿Qué incluye el service oficial?',
    answer:
      'Nuestro taller oficial Renault realiza:\n🔧 Services periódicos (aceite, filtros, frenos)\n🔩 Reparaciones mecánicas\n🎨 Chapa y pintura\n✅ Diagnóstico computarizado\n📦 Repuestos originales Renault\n\n¿Querés sacar un turno de service?',
    category: 'servicios' as const,
    keywords: ['service', 'taller', 'reparacion', 'mantenimiento', 'turno', 'revision', 'aceite'],
  },
  {
    question: '¿Tienen vehículos usados?',
    answer:
      'Sí, contamos con una amplia variedad de seminuevos y usados seleccionados:\n🚗 Autos usados con garantía\n🔍 Todos chequeados mecánicamente\n📄 Con documentación en orden\n\n¿Tenés algún modelo o presupuesto en mente?',
    category: 'vehiculos' as const,
    keywords: ['usado', 'usados', 'seminuevo', 'segunda mano', 'segunda'],
  },
  {
    question: '¿Cuánto demora el patentamiento?',
    answer:
      'El trámite de patentamiento estándar demora entre 30 y 45 días hábiles desde la firma del contrato. Para casos de financiación el tiempo puede variar según la entidad bancaria.',
    category: 'general' as const,
    keywords: ['patentamiento', 'entrega', 'cuando', 'tiempo', 'demora', 'cuanto tarda'],
  },
  {
    question: '¿Cómo puedo pedir una cotización?',
    answer:
      'Podés pedir tu cotización de varias formas:\n1️⃣ Directamente por este chat\n2️⃣ Llamando al [número del concesionario]\n3️⃣ Visitándonos en el concesionario\n\n¿Querés que un asesor te contacte para preparar una cotización personalizada?',
    category: 'general' as const,
    keywords: ['cotizacion', 'precio', 'cuanto cuesta', 'valor', 'presupuesto'],
  },
]

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    @InjectRepository(FAQ)
    private readonly faqRepo: Repository<FAQ>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.faqRepo.count()
    if (count > 0) {
      this.logger.log(`FAQs already seeded (${count} found) — skipping`)
      return
    }

    await this.faqRepo.save(GENERIC_FAQS.map((f) => this.faqRepo.create(f)))
    this.logger.log(`✅ Seeded ${GENERIC_FAQS.length} generic FAQs for Renault`)
  }
}
