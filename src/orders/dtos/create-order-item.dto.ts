import { IsNumber, Min } from "class-validator";

export class CreateOrderItemDto {
  @IsNumber()
  @Min(1)
  public productId: number;

  @IsNumber()
  @Min(1)
  public quantity: number;
}
