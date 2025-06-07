// src/companies/dto/company-response.dto.ts
import { Expose, Type } from 'class-transformer';
class UserContact {
  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class CompanyResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  website_url: string;

  @Expose()
  founded_date: string;

  @Expose()
  employee_count: string;

  @Expose()
  industry: string;

  @Expose()
  office_location: string;

  @Expose()
  twitter_url: string;

  @Expose()
  facebook_url: string;

  @Expose()
  linked_url: string;

  @Expose()
  headquarters_location: string;

  @Expose()
  isActive: boolean;

  @Expose()
  isVerified: boolean;

  @Expose()
  @Type(() => UserContact)
  hr_contact: UserContact;
}
