import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dtos';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    this.logger.log('[create] - Body: ' + JSON.stringify(createProductDto));
    //send espera respuesta | emit no
    return this.client.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    let page = query.page ?? 1;
    let limit = query.limit ?? 10;
    page = typeof page === 'string' ? Number(page) : page;
    limit = typeof limit === 'string' ? Number(limit) : limit;
    const finalQuery = { ...query, page, limit };
    this.logger.log('[findAll] - Query: ' + JSON.stringify(finalQuery));
    return this.client.send({ cmd: 'find_all_products' }, finalQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('[findOne] - ID: ' + id);
    return this.client.send({ cmd: 'find_one_product' }, { id });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: any) {
    this.logger.log(
      '[update] - ID: ' + id + ', Body: ' + JSON.stringify(updateProductDto),
    );
    return this.client.send(
      { cmd: 'update_product' },
      { id, ...updateProductDto },
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('[remove] - ID: ' + id);
    return this.client.send({ cmd: 'remove_product' }, id);
  }
}
