import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { BlocksService } from './blocks.service'
import { CreateBlockDto } from './dto/create-block.dto'
import { UpdateBlockDto } from './dto/update-block.dto'

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  findAll() {
    return this.blocksService.findAll()
  }

  @Get('graph/validate')
  validateGraph() {
    return this.blocksService.validateFlowGraph()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateBlockDto) {
    return this.blocksService.create(dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlockDto) {
    return this.blocksService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blocksService.remove(id)
  }
}
