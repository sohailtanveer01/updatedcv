import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  count: number;
}
