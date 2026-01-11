import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfficeLocationDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsBoolean()
  is_headquarters?: boolean;
}
