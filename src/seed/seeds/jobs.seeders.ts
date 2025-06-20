import { Company } from 'src/companies/entities/company.entity';
import { Job } from 'src/companies/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

// JobsSeeder (updated: removed created_by, added qualification, updated responsibilities)
export class JobsSeeder {
  constructor(
    private readonly jobRepo: Repository<Job>,
    private readonly companies: Company[],
    private readonly users: User[],
  ) {}

  async run() {
    const companies = this.companies.slice(0, 10);

    if (companies.length < 10 || companies.some((company) => !company.id)) {
      throw new Error('Insufficient or invalid companies for seeding jobs');
    }

    const employerUsers = this.users.slice(0, 10);

    const jobs: Partial<Job>[] = [
      {
        id: 1,
        company_id: companies[0].id,
        title: 'Social Media Assistant',
        description:
          'Nomad is seeking a Social Media Assistant to enhance our brand presence across digital platforms. You will create engaging content, manage community interactions, and analyze performance metrics to drive growth.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Marketing, Communications, or related field,1-2 years of experience in social media management,Proficiency with platforms like Instagram, Twitter, and LinkedIn,Strong writing and editing skills,Basic knowledge of analytics tools',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$500 - $1000',
        posted_at: '2025-04-01 00:00:00',
        expired_date: '2025-05-30 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 5,
        who_you_are: [
          'Creative with a passion for storytelling',
          'Strong communicator with attention to detail',
          'Familiar with social media analytics tools',
          'Team player with a proactive attitude',
          'Comfortable in a fast-paced environment',
        ],
        nice_to_haves: [
          'Experience with graphic design tools like Canva',
          'Knowledge of SEO principles',
          'Fluency in French',
        ],
        perks_benefits: {
          health_coverage: 'Comprehensive medical and dental plans.',
          flexible_hours: 'Work-life balance with flexible scheduling.',
          learning_stipend: 'Annual budget for courses and workshops.',
          team_retreats: 'Annual company-wide retreats for collaboration.',
        },
        created_by: employerUsers[0].id,
      },
      {
        id: 2,
        company_id: companies[1].id,
        title: 'Brand Designer',
        description:
          'Dropbox is looking for a Brand Designer to shape our visual identity. You will design marketing materials, ensure brand consistency, and collaborate with cross-functional teams to elevate our brand.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Graphic Design or related field,3+ years of experience in branding or graphic design,Proficiency in Adobe Creative Suite,Strong portfolio showcasing brand work,Understanding of print and digital media',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$1500 - $2000',
        posted_at: '2025-03-15 00:00:00',
        expired_date: '2025-06-15 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 2,
        who_you_are: [
          'Skilled in typography and color theory',
          'Proficient in Adobe Creative Suite',
          'Detail-oriented with a creative mindset',
          'Able to manage multiple projects',
          'Passionate about brand storytelling',
        ],
        nice_to_haves: [
          'Experience with motion graphics',
          'Knowledge of UI/UX design',
          'Familiarity with tech industry trends',
        ],
        perks_benefits: {
          stock_options: 'Equity in a leading tech company.',
          remote_work: 'Option to work from home or office.',
          wellness_program: 'Gym memberships and mental health support.',
          professional_development: 'Mentorship and training opportunities.',
        },
        created_by: employerUsers[1].id,
      },
      {
        id: 3,
        company_id: companies[2].id,
        title: 'Interactive Developer',
        description:
          'Terraform seeks an Interactive Developer to build engaging web experiences. You will code interactive features, optimize performance, and work with designers to bring ideas to life.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Computer Science or related field,2+ years of experience in front-end development,Proficiency in JavaScript, HTML, and CSS,Experience with React or Vue,Knowledge of web performance optimization',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$1500 - $2000',
        posted_at: '2025-04-10 00:00:00',
        expired_date: '2025-06-10 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 8,
        who_you_are: [
          'Proficient in JavaScript, HTML, and CSS',
          'Experienced with frameworks like React or Vue',
          'Problem-solver with a focus on user experience',
          'Able to work in a collaborative environment',
          'Passionate about emerging web technologies',
        ],
        nice_to_haves: [
          'Experience with WebGL or Three.js',
          'Knowledge of backend development',
          'Familiarity with DevOps tools',
        ],
        perks_benefits: {
          relocation_assistance: 'Assistance for moving to Hamburg.',
          health_coverage: 'Comprehensive medical coverage.',
          team_retreats: 'Regular team-building activities.',
        },
        created_by: employerUsers[2].id,
      },
      {
        id: 4,
        company_id: companies[3].id,
        title: 'Email Marketing',
        description:
          'Revolut is hiring an Email Marketing specialist to drive customer engagement. You will design email campaigns, analyze performance, and optimize for conversions.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Marketing or related field,2+ years of experience in email marketing,Proficiency with platforms like Mailchimp or HubSpot,Strong analytical skills,Knowledge of GDPR and email compliance',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$1500 - $2000',
        posted_at: '2025-04-20 00:00:00',
        expired_date: '2025-06-20 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 0,
        who_you_are: [
          'Experienced with email marketing platforms',
          'Data-driven with strong analytical skills',
          'Creative in crafting compelling content',
          'Organized and detail-oriented',
          'Able to work under tight deadlines',
        ],
        nice_to_haves: [
          'Experience with A/B testing',
          'Knowledge of CRM systems',
          'Fluency in Spanish',
        ],
        perks_benefits: {
          stock_options: 'Equity in a fast-growing fintech.',
          remote_work: 'Hybrid work model.',
          health_coverage: 'Full medical and dental coverage.',
          professional_development: 'Access to training programs.',
        },
        created_by: employerUsers[3].id,
      },
      {
        id: 5,
        company_id: companies[4].id,
        title: 'Lead Engineer',
        description:
          'Canva is seeking a Lead Engineer to oversee development projects. You will lead a team, architect solutions, and ensure high-quality code delivery.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Computer Science or related field,5+ years of software engineering experience,2+ years in a leadership role,Proficiency in modern tech stacks (e.g., Node.js, React),Experience with cloud platforms',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$500 - $1000',
        posted_at: '2025-03-25 00:00:00',
        expired_date: '2025-05-25 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 5,
        who_you_are: [
          'Experienced in leading engineering teams',
          'Proficient in modern tech stacks',
          'Strong problem-solving skills',
          'Excellent communicator',
          'Passionate about design tools',
        ],
        nice_to_haves: [
          'Experience with Node.js or Go',
          'Knowledge of cloud infrastructure',
          'Familiarity with design platforms',
        ],
        perks_benefits: {
          stock_options: 'Stock options for employees.',
          health_coverage: 'Comprehensive medical plans.',
          remote_work: 'Flexible work-from-home policy.',
          team_retreats: 'Global team gatherings.',
        },
        created_by: employerUsers[4].id,
      },
      {
        id: 6,
        company_id: companies[5].id,
        title: 'Product Designer',
        description:
          'ClassPass is looking for a Product Designer to craft user-centric experiences. You will design interfaces, conduct user research, and collaborate with developers.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Design, HCI, or related field,3+ years of experience in product or UX design,Proficiency in Figma or Sketch,Strong portfolio of user-centered designs,Experience with user research methods',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$1500 - $2000',
        posted_at: '2025-04-05 00:00:00',
        expired_date: '2025-06-05 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 5,
        who_you_are: [
          'Skilled in Figma and prototyping tools',
          'Empathetic to user needs',
          'Strong visual design skills',
          'Collaborative and communicative',
          'Passionate about fitness tech',
        ],
        nice_to_haves: [
          'Experience with animation design',
          'Knowledge of HTML/CSS',
          'Familiarity with fitness industry',
        ],
        perks_benefits: {
          wellness_program: 'Free ClassPass subscription.',
          flexible_hours: 'Work when you’re most productive.',
          learning_stipend: 'Funds for professional growth.',
          team_retreats: 'Regular social and team activities.',
        },
        created_by: employerUsers[5].id,
      },
      {
        id: 7,
        company_id: companies[6].id,
        title: 'Customer Manager',
        description:
          'Pitch seeks a Customer Manager to support our clients. You will handle inquiries, provide solutions, and ensure customer satisfaction.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Business, Communications, or related field,2+ years of experience in customer support,Proficiency with CRM tools,Strong interpersonal skills,Ability to handle high-pressure situations',
        job_type: 'Full-Time',
        skill_required: 'Marketing,Design',
        salary_range: '$1500 - $2000',
        posted_at: '2025-05-15 00:00:00',
        expired_date: '2025-06-15 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 5,
        who_you_are: [
          'Empathetic and patient',
          'Strong communication skills',
          'Organized and detail-oriented',
          'Experienced in customer support',
          'Passionate about client success',
        ],
        nice_to_haves: [
          'Experience with CRM tools',
          'Knowledge of presentation software',
          'Fluency in German',
        ],
        perks_benefits: {
          health_coverage: 'Full medical coverage.',
          remote_work: 'Hybrid work arrangements.',
          team_retreats: 'Regular team-building events.',
          learning_stipend: 'Access to training resources.',
        },
        created_by: employerUsers[6].id,
      },
      {
        id: 8,
        company_id: companies[7].id,
        title: 'UI/UX Designer',
        description:
          'Figma is hiring a UI/UX Designer to create seamless user experiences. You will design interfaces, conduct research, and collaborate remotely with global teams.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Design, HCI, or related field,3+ years of experience in UI/UX design,Expertise in Figma or similar tools,Strong portfolio of digital products,Experience with usability testing',
        job_type: 'Remote',
        skill_required: 'Design',
        salary_range: '$3000 - $3500',
        posted_at: '2025-04-01 00:00:00',
        expired_date: '2025-05-31 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 3,
        who_you_are: [
          'Expert in Figma and design tools',
          'Strong understanding of UX principles',
          'Creative with a user-centric mindset',
          'Able to work independently',
          'Passionate about design collaboration',
        ],
        nice_to_haves: [
          'Experience with accessibility standards',
          'Knowledge of front-end development',
          'Familiarity with remote work tools',
        ],
        perks_benefits: {
          remote_work: 'Fully remote with flexible hours.',
          stock_options: 'Stock in a growing company.',
          health_coverage: 'Comprehensive medical plans.',
          learning_stipend: 'Budget for professional growth.',
        },
        created_by: employerUsers[7].id,
      },
      {
        id: 9,
        company_id: companies[8].id,
        title: 'Frontend Developer',
        description:
          'Vercel is seeking a Frontend Developer to build high-performance web applications. You will work on our platform, optimize user interfaces, and ensure scalability.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Computer Science or related field,3+ years of experience in front-end development,Proficiency in React and Next.js,Strong understanding of JavaScript and CSS,Experience with performance optimization',
        job_type: 'Full-Time',
        skill_required: 'Engineering',
        salary_range: '$1500 - $2000',
        posted_at: '2025-05-10 00:00:00',
        expired_date: '2025-06-10 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 4,
        who_you_are: [
          'Proficient in React and Next.js',
          'Experienced with modern JavaScript',
          'Detail-oriented with a focus on quality',
          'Collaborative and communicative',
          'Passionate about web performance',
        ],
        nice_to_haves: [
          'Experience with TypeScript',
          'Knowledge of serverless architecture',
          'Familiarity with Vercel platform',
        ],
        perks_benefits: {
          stock_options: 'Equity in a leading platform.',
          health_coverage: 'Comprehensive medical plans.',
          remote_work: 'Flexible work arrangements.',
          team_retreats: 'Global team gatherings.',
        },
        created_by: employerUsers[8].id,
      },
      {
        id: 10,
        company_id: companies[9].id,
        title: 'Community Manager',
        description:
          'Notion is looking for a Community Manager to engage our audience. You will moderate forums, organize events, and foster a vibrant community.',
        responsibility: [
          'Create visually compelling brand assets',
          'Maintain brand guidelines across all channels',
        ],
        qualification:
          'Bachelor’s degree in Communications, Marketing, or related field,2+ years of experience in community management,Strong organizational and event planning skills,Proficiency with social media platforms,Excellent written communication skills',
        job_type: 'Part-Time',
        skill_required: 'Marketing',
        salary_range: '$1500 - $2000',
        posted_at: '2025-04-05 00:00:00',
        expired_date: '2025-06-05 00:00:00',
        is_visible: true,
        views: 0,
        applicant_applied: 6,
        who_you_are: [
          'Outgoing and empathetic',
          'Strong written and verbal skills',
          'Organized with event planning experience',
          'Passionate about productivity tools',
          'Able to work part-time hours',
        ],
        nice_to_haves: [
          'Experience with Notion',
          'Knowledge of community platforms',
          'Fluency in French',
        ],
        perks_benefits: {
          flexible_hours: 'Work around your schedule.',
          health_coverage: 'Part-time medical coverage.',
          team_retreats: 'Access to company gatherings.',
          tool_access: 'Free Notion subscription.',
        },
        created_by: employerUsers[9].id,
      },
    ];

    const result = await this.jobRepo.save(jobs);
    console.log(`✅ Seeded ${result.length} jobs successfully.`);
    return result;
  }
}