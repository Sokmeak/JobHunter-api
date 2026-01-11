import { Repository } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Member } from '../../companies/entities/member.entity';

export class MembersSeeder {
  constructor(
    private readonly memberRepository: Repository<Member>,
    private readonly companyRepository: Repository<Company>,
  ) {}

  async run(): Promise<void> {
    const companies = await this.companyRepository.find();
    if (companies.length < 26) {
      throw new Error('Need at least 26 companies to seed members');
    }

    const positionsByIndustry: { [key: string]: string[] } = {
      'Business Service': [
        'Community Manager',
        'Operations Specialist',
        'Customer Support',
        'Project Coordinator',
        'Product Manager',
      ],
      'Cloud Storage': [
        'Software Engineer',
        'Cloud Architect',
        'Data Engineer',
        'DevOps Engineer',
        'Product Manager',
      ],
      Cryptocurrency: [
        'Blockchain Developer',
        'Security Analyst',
        'Financial Analyst',
        'Trader',
        'Product Manager',
      ],
      Infrastructure: [
        'DevOps Engineer',
        'Infrastructure Engineer',
        'Systems Administrator',
        'Network Engineer',
        'Software Engineer',
      ],
      'Financial Technology': [
        'Fintech Developer',
        'Compliance Analyst',
        'Data Analyst',
        'Product Manager',
        'Customer Success Manager',
      ],
      Design: [
        'Graphic Designer',
        'UI/UX Designer',
        'Product Designer',
        'Visual Designer',
        'Creative Director',
      ],
      Fitness: [
        'Fitness Program Manager',
        'Community Manager',
        'Marketing Specialist',
        'App Developer',
        'Customer Support',
      ],
      Productivity: [
        'Software Engineer',
        'Product Manager',
        'UX Designer',
        'Customer Success Manager',
        'Technical Writer',
      ],
      'Web Development': [
        'Frontend Developer',
        'Backend Developer',
        'Full-Stack Developer',
        'DevOps Engineer',
        'Product Manager',
      ],
      DevOps: [
        'DevOps Engineer',
        'Site Reliability Engineer',
        'CI/CD Specialist',
        'Cloud Engineer',
        'Systems Administrator',
      ],
      'Social Media': [
        'Content Creator',
        'Social Media Manager',
        'Marketing Specialist',
        'Community Manager',
        'Analyst',
      ],
      Automation: [
        'Automation Engineer',
        'Software Developer',
        'Product Manager',
        'Customer Success Manager',
        'Data Analyst',
      ],
      Communication: [
        'Software Engineer',
        'Product Manager',
        'Support Specialist',
        'UX Designer',
        'Technical Writer',
      ],
      Creative: [
        'Motion Designer',
        'Graphic Designer',
        'Creative Director',
        'Content Creator',
        'UX Designer',
      ],
      Networking: [
        'Software Engineer',
        'Product Manager',
        'Community Manager',
        'Data Analyst',
        'Marketing Specialist',
      ],
      Music: [
        'Audio Engineer',
        'Software Developer',
        'Product Manager',
        'Content Creator',
        'Marketing Specialist',
      ],
      AI: [
        'AI Researcher',
        'Machine Learning Engineer',
        'Data Scientist',
        'Software Engineer',
        'Product Manager',
      ],
      'Web Design': [
        'Web Designer',
        'Frontend Developer',
        'UI/UX Designer',
        'Product Manager',
        'Creative Director',
      ],
      'E-commerce': [
        'E-commerce Developer',
        'Product Manager',
        'Marketing Specialist',
        'Customer Success Manager',
        'Data Analyst',
      ],
      Technology: [
        'Software Engineer',
        'Product Designer',
        'Product Manager',
        'Data Analyst',
        'Marketing Specialist',
      ],
    };

    const members: Partial<Member>[] = [];
    const usedNames = new Set<string>();
    const baseNames = [
      'Alex',
      'Jordan',
      'Taylor',
      'Morgan',
      'Casey',
      'Riley',
      'Quinn',
      'Avery',
      'Peyton',
      'Logan',
      'Cameron',
      'Skylar',
      'Reese',
      'Parker',
      'Dakota',
      'Sydney',
      'Emerson',
      'Finley',
      'Rowan',
      'Sage',
      'Aspen',
      'River',
      'Willow',
      'Juniper',
      'Harper',
      'Eden',
    ];

    for (const company of companies) {
      const industry = company.industry || 'Technology';
      const availablePositions =
        positionsByIndustry[industry] || positionsByIndustry['Technology'];

      for (let j = 0; j < 5; j++) {
        const memberIndex = members.length;
        const baseName = baseNames[memberIndex % baseNames.length];
        const suffix = Math.floor(memberIndex / baseNames.length) + 1;
        const name = `${baseName} ${suffix}`;
        if (usedNames.has(name)) continue;
        usedNames.add(name);

        const position =
          availablePositions[
            Math.floor(Math.random() * availablePositions.length)
          ];
        const includeSocial = Math.random() > 0.3; // 70% chance to include social URLs

        members.push({
          company_id: company.id,
          name,
          position,
          profile_img_url: includeSocial
            ? `https://example.com/profiles/${name.toLowerCase().replace(' ', '-')}.jpg`
            : undefined,
          insta_url: includeSocial
            ? `https://instagram.com/${name.toLowerCase().replace(' ', '_')}`
            : undefined,
          linked_url: includeSocial
            ? `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`
            : undefined,
        });
      }
    }

    await this.memberRepository.save(members);
    console.log(`✅ Seeded ${members.length} members`);
  }
}
