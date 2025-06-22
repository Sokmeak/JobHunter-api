import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialLinkDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  platform?: string;
}
