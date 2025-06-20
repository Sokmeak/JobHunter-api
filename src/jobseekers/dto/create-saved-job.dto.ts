import { IsString } from 'class-validator';

export class CreateSavedJobDto {
  @IsString()
  job_id: string;
}
