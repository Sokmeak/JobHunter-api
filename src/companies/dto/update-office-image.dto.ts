import { PartialType } from '@nestjs/mapped-types';

import { CreateOfficeImageDto } from './create-office-image.dto';

export class UpdateOfficeImageDto extends PartialType(CreateOfficeImageDto) {}
