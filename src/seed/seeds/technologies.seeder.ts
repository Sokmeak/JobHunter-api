import { Repository } from 'typeorm';
import { Technology } from 'src/companies/technology/technology.entity';

export class TechnologySeeder {
  constructor(private readonly techRepo: Repository<Technology>) {}

  async run() {
    const techNames = [
      'React',
      'Vue',
      'Angular',
      'NestJS',
      'Node.js',
      'Express',
      'Laravel',
      'Django',
      'Spring Boot',
      'Flutter',
    ];

    await this.techRepo.createQueryBuilder().delete().execute();
    const technologies: Partial<Technology>[] = techNames.map((name) => ({
      name,
    }));

    const result = await this.techRepo.save(technologies);
    console.log(`✅ Seeded ${result.length} technologies successfully.`);

    return result;
  }
}
