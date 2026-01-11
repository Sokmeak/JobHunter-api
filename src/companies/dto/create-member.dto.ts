import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsOptional()
  @IsUrl()
  insta_url?: string;

  @IsOptional()
  @IsUrl()
  linked_url?: string;
}
