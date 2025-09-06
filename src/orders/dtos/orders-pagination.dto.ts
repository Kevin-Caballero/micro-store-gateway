import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { OrderStatus } from './order-status.enum';

export class OrdersPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;
}
