import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  user_id: number;
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean;
}
