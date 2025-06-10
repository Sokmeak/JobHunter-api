import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanyDocumentDto {
  @IsString()
  @IsNotEmpty()
  document_name: string;
}