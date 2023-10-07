import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCountDto {
  @IsNumber()
  @IsNotEmpty()
  count: number;
}
