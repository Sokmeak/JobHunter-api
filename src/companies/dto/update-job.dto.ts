// import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDto } from "./create-job.dto";

// export class UpdateJobDto {
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsString()
//   responsibility?: string;

//   @IsOptional()
//   @IsString()
//   qualification?: string;

//   @IsOptional()
//   @IsString()
//   job_type?: string;

//   @IsOptional()
//   @IsString()
//   skill_required?: string;

//   @IsOptional()
//   @IsString()
//   salary_range?: string;

//   @IsOptional()
//   @IsDateString()
//   expired_date?: string;

//   @IsOptional()
//   @IsBoolean()
//   is_visible?: boolean;
// }

export class UpdateJobDto extends PartialType(CreateJobDto){

}