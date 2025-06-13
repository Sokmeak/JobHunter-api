import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
