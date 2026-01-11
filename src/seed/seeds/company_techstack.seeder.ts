import { Repository } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Technology } from '../../companies/technology/technology.entity';
import { CompanyTechStack } from '../../companies/entities/company-tech-stack.entity';

export class CompanyTechStackSeeder {
  constructor(
    private readonly companyTechStackRepository: Repository<CompanyTechStack>,
    private readonly companyRepository: Repository<Company>,
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  async run(): Promise<void> {
    const companies = await this.companyRepository.find({
      select: ['id', 'industry'],
    });
    const technologies = await this.technologyRepository.find({
      select: ['id', 'name'],
    });

    if (companies.length < 26) {
      throw new Error(
        `Insufficient companies: found ${companies.length}, need 26`,
      );
    }
    if (technologies.length < 10) {
      throw new Error(
        `Insufficient technologies: found ${technologies.length}, need 10`,
      );
    }

    // Map industries to preferred technologies
    const techByIndustry: { [key: string]: string[] } = {
      'Business Service': ['React', 'Vue', 'Node.js', 'Express'],
      'Cloud Storage': ['Node.js', 'Express', 'Django', 'Spring Boot'],
      Cryptocurrency: ['Node.js', 'Express', 'Django', 'NestJS'],
      Infrastructure: ['Node.js', 'Spring Boot', 'NestJS', 'Django'],
      'Financial Technology': ['React', 'Angular', 'Spring Boot', 'Node.js'],
      Design: ['React', 'Vue', 'Angular', 'Flutter'],
      Fitness: ['Flutter', 'React', 'Vue', 'Node.js'],
      Productivity: ['React', 'Vue', 'Node.js', 'Express'],
      'Web Development': ['React', 'Vue', 'Angular', 'NestJS'],
      DevOps: ['Node.js', 'Express', 'Django', 'Spring Boot'],
      'Social Media': ['React', 'Vue', 'Node.js', 'Express'],
      Automation: ['Node.js', 'Django', 'Spring Boot', 'NestJS'],
      Communication: ['React', 'Vue', 'Node.js', 'Express'],
      Creative: ['React', 'Vue', 'Angular', 'Flutter'],
      Networking: ['React', 'Vue', 'Node.js', 'Express'],
      Music: ['React', 'Vue', 'Flutter', 'Node.js'],
      AI: ['Django', 'Spring Boot', 'Node.js', 'NestJS'],
      'Web Design': ['React', 'Vue', 'Angular', 'Flutter'],
      'E-commerce': ['React', 'Vue', 'Node.js', 'Laravel'],
      Technology: ['React', 'Vue', 'Node.js', 'Express'],
    };

    const techStacks: Partial<CompanyTechStack>[] = [];
    const usedPairs = new Set<string>(); // Track company_id:technology_id pairs

    for (const company of companies) {
      const industry = company.industry || 'Technology';
      const availableTechs =
        techByIndustry[industry] || techByIndustry['Technology'];
      const numTechs = Math.floor(Math.random() * 3) + 2; // 2-4 technologies
      const companyTechs = technologies
        .filter((tech) => availableTechs.includes(tech.name))
        .sort(() => 0.5 - Math.random())
        .slice(0, numTechs);

      for (const tech of companyTechs) {
        const pairKey = `${company.id}:${tech.id}`;
        if (usedPairs.has(pairKey)) continue; // Skip duplicates
        usedPairs.add(pairKey);

        techStacks.push({
          company_id: company.id,
          technology_id: tech.id,
        });
      }
    }

    await this.companyTechStackRepository.save(techStacks);
    console.log(`✅ Seeded ${techStacks.length} company-tech-stack entries`);
  }
}
