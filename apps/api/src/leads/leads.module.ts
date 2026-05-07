import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lead } from './lead.entity'
import { LeadsController } from './leads.controller'
import { LeadsService } from './leads.service'
import { ConversationsModule } from '../conversations/conversations.module'
import { MetricsModule } from '../metrics/metrics.module'

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), ConversationsModule, MetricsModule],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
