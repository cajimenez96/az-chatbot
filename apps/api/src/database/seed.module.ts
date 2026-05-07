import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FAQ } from '../faqs/faq.entity'
import { SeedService } from './seed.service'

@Module({
  imports: [TypeOrmModule.forFeature([FAQ])],
  providers: [SeedService],
})
export class SeedModule {}
