import { Company } from 'src/companies/entities/company.entity';
import { Member } from 'src/companies/entities/member.entity';
import { Repository } from 'typeorm';



export class MembersSeeder {
  constructor(
    private readonly memberRepository: Repository<Member>,
    private readonly companies: Company[],
  ) {}

  async run() {
    // A pool of real-ish names and positions
    const names = [
      'John Doe',
      'Jane Smith',
      'Michael Chen',
      'Sara Lee',
      'David Kim',
      'Emily Johnson',
      'Daniel Martinez',
      'Sophia Nguyen',
      'Chris Evans',
      'Olivia Brown',
      'Liam Wilson',
      'Emma Garcia',
      'Noah Anderson',
      'Ava Thomas',
      'Lucas Taylor',
      'Mia Hernandez',
      'Ethan Moore',
      'Isabella Martin',
      'Logan Thompson',
      'Charlotte White',
      'James Clark',
      'Amelia Lewis',
      'Benjamin Walker',
      'Abigail Hall',
      'Alexander Allen',
      'Ella Young',
      'William King',
      'Grace Wright',
      'Jacob Scott',
      'Chloe Green',
      'Matthew Adams',
      'Lily Baker',
      'Samuel Nelson',
      'Zoe Carter',
      'Henry Mitchell',
      'Aria Perez',
      'Jack Roberts',
      'Scarlett Turner',
      'Sebastian Phillips',
      'Hannah Campbell',
      'Aiden Parker',
      'Nora Evans',
      'Owen Edwards',
      'Riley Collins',
      'Jackson Stewart',
      'Victoria Sanchez',
      'Levi Morris',
      'Natalie Rogers',
      'Ryan Reed',
      'Penelope Cook',
    ];

    const positions = ['Developer', 'UI/UX Designer', 'Project Manager', 'QA Engineer', 'DevOps Engineer'];

    const members: Partial<Member>[] = [];
    let nameIndex = 0;

    for (const company of this.companies) {
      for (let i = 0; i < 5; i++) {
        const name = names[nameIndex++ % names.length];
        const position = positions[i % positions.length];

        members.push({
          company_id: company.id,
          name,
          position,
          profile_img_url: '',
          insta_url: `https://instagram.com/${name.toLowerCase().replace(/ /g, '')}`,
          linked_url: `https://linkedin.com/in/${name.toLowerCase().replace(/ /g, '')}`,
        });
      }
    }

    const result = await this.memberRepository.save(members);
    console.log(`✅ Seeded ${result.length} members (5 per company) with real names.`);

    return result;
  }
}
