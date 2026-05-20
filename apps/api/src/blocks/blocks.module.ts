import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlocksService } from './blocks.service'
import { BlocksController } from './blocks.controller'
import { Block } from './entities/block.entity'
import { BlockOption } from './entities/block-option.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Block, BlockOption])],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
