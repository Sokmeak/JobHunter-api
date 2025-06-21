import { IsString, Length } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  @Length(1, 100)
  name: string;
}
