import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { OrdersPaginationDto } from './dtos/orders-pagination.dto';
import { CreateOrderDto } from './dtos';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    this.logger.log('[create] - Body: ' + JSON.stringify(createOrderDto));
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAll(
    @Query()
    query: OrdersPaginationDto,
  ) {
    let page = query.page ?? 1;
    let limit = query.limit ?? 10;
    page = typeof page === 'string' ? Number(page) : page;
    limit = typeof limit === 'string' ? Number(limit) : limit;
    const finalQuery = { ...query, page, limit };
    this.logger.log('[findAll] - Query: ' + JSON.stringify(finalQuery));
    return this.client.send({ cmd: 'find_all_orders' }, finalQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log('[findOne] - ID: ' + id);
    return this.client.send({ cmd: 'find_one_order' }, { id });
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string },
  ) {
    this.logger.log(
      '[changeOrderStatus] - ID: ' + id + ', Status: ' + body.status,
    );
    return this.client.send(
      { cmd: 'change_order_status' },
      { id, status: body.status },
    );
  }
}
