import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FAQ } from './faq.entity'
import { FAQsController } from './faqs.controller'
import { FAQsService } from './faqs.service'
import { MetricsModule } from '../metrics/metrics.module'
import { BlocksModule } from '../blocks/blocks.module'

@Module({
  imports: [TypeOrmModule.forFeature([FAQ]), MetricsModule, BlocksModule],
  controllers: [FAQsController],
  providers: [FAQsService],
  exports: [FAQsService],
})
export class FAQsModule {}
