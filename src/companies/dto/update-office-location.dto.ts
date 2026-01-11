import { CreateOfficeLocationDto } from "./create-office-location.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateOfficeLocationDto extends PartialType(CreateOfficeLocationDto) {}