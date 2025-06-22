// src/companies/dto/company-response.dto.ts
import { Technology } from '../technology/technology.entity';
import { Company } from '../entities/company.entity';
import { OfficeLocation } from '../entities/office-location.entity';
import { Member } from '../entities/member.entity';
import { CompanyDocument } from '../entities/company-document.entity'; // Import your custom document entity

import { Job } from '../entities/job.entity';
import { CompanyTechStack } from '../entities/company-tech-stack.entity';

export interface EnhancedOfficeImage {
  id: number;
  image_url: string;
  thumbnail_url: string;
  caption?: string;
}

export interface EnhancedTechnology {
  id: number;
  technology: Technology;
}
export class CompanyResponseDto {
  id: number;
  name: string;
  isActive: boolean;
  headquartersLocation?: string;
  cultureDescription?: string;
  tags?: string[];
  benefits?: string[]; // ✅ Add this line
  brandLogo?: string;
  members?: Member[];
  documents?: CompanyDocument[];
  jobs?: Job[];

  techStacks?: CompanyTechStack[];
  website_url?: string;
  founded_date?: string;
  employee_count?: string;
  industry?: string;
  office_location?: OfficeLocation[];
  twitter_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  email?: string;
  hr_contact_name?: string;
  hr_contact_email?: string;

  officeImages: EnhancedOfficeImage[];
  technologies: EnhancedTechnology[];
  brand_logo_thumbnail: string;

  constructor(
    company: Partial<Company>,
    officeImages: EnhancedOfficeImage[],
    technologies: EnhancedTechnology[],
    brandLogoThumbnail: string,
  ) {
    this.id = company.id ?? 0;
    this.name = company.name ?? '';
    this.isActive = company.isActive ?? false;
    this.headquartersLocation = company.headquarters_location ?? '';
    this.cultureDescription = company.culture_description ?? '';
    this.tags = company.tags ?? [];
    this.benefits = company.benefits ?? [];
    this.brandLogo = company.brand_logo ?? '';

    this.members = company.members ?? [];
    this.documents = company.documents ?? [];
    this.jobs = company.jobs ?? [];
    this.techStacks = company.techStacks ?? [];
    this.website_url = company.website_url ?? '';
    this.founded_date = company.founded_date ?? '';
    this.employee_count = company.employee_count ?? '';
    this.industry = company.industry ?? '';
    this.office_location = company.officeLocations ?? [];
    this.twitter_url = company.twitter_url ?? '';
    this.facebook_url = company.facebook_url ?? '';
    this.linkedin_url = company.linkedin_url ?? '';
    this.email = company.email ?? '';
    this.hr_contact_name = company.hr_contact_name ?? '';
    this.hr_contact_email = company.hr_contact_email ?? '';
    this.officeImages = officeImages;
    this.technologies = technologies;
    this.brand_logo_thumbnail = brandLogoThumbnail;
  }
}
