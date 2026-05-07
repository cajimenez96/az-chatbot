import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DailyMetric } from './metric.entity'
import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'

@Module({
  imports: [TypeOrmModule.forFeature([DailyMetric])],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
