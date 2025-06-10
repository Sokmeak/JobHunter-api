import { IsString, IsOptional } from 'class-validator';

export class UpdateCompanyDocumentDto {
  @IsOptional()
  @IsString()
  document_name?: string;
}