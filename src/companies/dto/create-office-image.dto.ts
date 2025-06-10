import { IsString, IsOptional } from 'class-validator';

export class CreateOfficeImageDto {
  @IsOptional()
  @IsString()
  caption?: string;
}
