import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';

import { RoleENUM } from '../../roles/interface/roles.interface';
import { Job } from 'src/companies/entities/job.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { log } from 'console';

export class JobSeekersSeeder {
  constructor(
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    private readonly jobRepository: Repository<Job>,
    private readonly users: User[],
  ) {}

  async run(): Promise<void> {
    // Clear existing job seeker data
    // await this.jobSeekerRepository.createQueryBuilder().delete().execute();

    // Filter JOB SEEKER users (30 users)
    const jobSeekerUsers = this.users.filter(
      (user) => user.role.type === RoleENUM.APPLICANT,
    );

    // log(jobSeekerUsers);

    // Validate that we have enough JOB SEEKER users
    if (jobSeekerUsers.length < 30 || jobSeekerUsers.some((user) => !user.id)) {
      throw new Error(
        'Insufficient or invalid JOB SEEKER users for seeding job seekers',
      );
    }

    // Fetch jobs to link to job seekers
    const jobs = await this.jobRepository.find();
    const jobsData = jobs.slice(0, Math.min(3, jobs.length));
    if (jobs.length < 10) {
      console.warn(
        'Fewer than 10 jobs found; some job seekers may not be linked to jobs.',
      );
    }

    const jobSeekers: Partial<JobSeeker>[] = [
      {
        user_id: jobSeekerUsers[0].id,
        jobseeker_name: 'Emma Johnson',
        jobseeker_email: 'emma.johnson@example.com',
        profile_image: 'https://example.com/profiles/emma.jpg',
        headline: 'Full-Stack Developer with a Passion for Innovation',
        bio: 'Experienced in building scalable web applications with React and Node.js.',
        current_status: 'Open to work',
        preferred_location: 'San Francisco, USA',
        expected_salary: 120000,
      },
      {
        user_id: jobSeekerUsers[1].id,
        jobseeker_name: 'Liam Smith',
        jobseeker_email: 'liam.smith@example.com',
        profile_image: 'https://example.com/profiles/liam.jpg',
        headline: 'UX Designer Focused on User-Centric Solutions',
        bio: 'Skilled in creating intuitive interfaces using Figma and conducting user research.',
        current_status: 'Open to work',
        preferred_location: 'London, UK',
        expected_salary: 90000,
      },
      {
        user_id: jobSeekerUsers[2].id,
        jobseeker_name: 'Olivia Brown',
        jobseeker_email: 'olivia.brown@example.com',
        profile_image: 'https://example.com/profiles/olivia.jpg',
        headline: 'Data Analyst with Expertise in Python',
        bio: 'Proficient in data visualization and statistical analysis using Python and SQL.',
        current_status: 'Open to work',
        preferred_location: 'New York, USA',
        expected_salary: 85000,
      },
      {
        user_id: jobSeekerUsers[3].id,
        jobseeker_name: 'Noah Davis',
        jobseeker_email: 'noah.davis@example.com',
        profile_image: 'https://example.com/profiles/noah.jpg',
        headline: 'DevOps Engineer Specializing in Cloud Infrastructure',
        bio: 'Experienced in automating CI/CD pipelines with Docker and AWS.',
        current_status: 'Open to work',
        preferred_location: 'Berlin, Germany',
        expected_salary: 110000,
      },
      {
        user_id: jobSeekerUsers[4].id,
        jobseeker_name: 'Sophia Wilson',
        jobseeker_email: 'sophia.wilson@example.com',
        profile_image: 'https://example.com/profiles/sophia.jpg',
        headline: 'Product Manager with a Track Record of Success',
        bio: 'Skilled in leading cross-functional teams to deliver innovative products.',
        current_status: 'Open to work',
        preferred_location: 'Toronto, Canada',
        expected_salary: 130000,
      },
      {
        user_id: jobSeekerUsers[5].id,
        jobseeker_name: 'James Taylor',
        jobseeker_email: 'james.taylor@example.com',
        profile_image: 'https://example.com/profiles/james.jpg',
        headline: 'Backend Developer with Java Expertise',
        bio: 'Proficient in building robust APIs using Spring Boot and Java.',
        current_status: 'Open to work',
        preferred_location: 'Sydney, Australia',
        expected_salary: 100000,
      },
      {
        user_id: jobSeekerUsers[6].id,
        jobseeker_name: 'Isabella Martinez',
        jobseeker_email: 'isabella.martinez@example.com',
        profile_image: 'https://example.com/profiles/isabella.jpg',
        headline: 'Graphic Designer with a Creative Edge',
        bio: 'Experienced in branding and visual design using Adobe Creative Suite.',
        current_status: 'Open to work',
        preferred_location: 'Paris, France',
        expected_salary: 75000,
      },
      {
        user_id: jobSeekerUsers[7].id,
        jobseeker_name: 'Ethan Anderson',
        jobseeker_email: 'ethan.anderson@example.com',
        profile_image: 'https://example.com/profiles/ethan.jpg',
        headline: 'Cybersecurity Analyst Protecting Digital Assets',
        bio: 'Skilled in identifying vulnerabilities and implementing security protocols.',
        current_status: 'Open to work',
        preferred_location: 'Tokyo, Japan',
        expected_salary: 95000,
      },
      {
        user_id: jobSeekerUsers[8].id,
        jobseeker_name: 'Ava Thomas',
        jobseeker_email: 'ava.thomas@example.com',
        profile_image: 'https://example.com/profiles/ava.jpg',
        headline: 'Marketing Specialist with Digital Expertise',
        bio: 'Proficient in SEO, content marketing, and social media strategy.',
        current_status: 'Open to work',
        preferred_location: 'Amsterdam, Netherlands',
        expected_salary: 80000,
      },
      {
        user_id: jobSeekerUsers[9].id,
        jobseeker_name: 'Lucas White',
        jobseeker_email: 'lucas.white@example.com',
        profile_image: 'https://example.com/profiles/lucas.jpg',
        headline: 'AI Engineer Building Intelligent Systems',
        bio: 'Experienced in machine learning and deep learning frameworks like TensorFlow.',
        current_status: 'Open to work',
        preferred_location: 'Singapore',
        expected_salary: 140000,
      },
      {
        user_id: jobSeekerUsers[10].id,
        jobseeker_name: 'Mia Harris',
        jobseeker_email: 'mia.harris@example.com',
        profile_image: 'https://example.com/profiles/mia.jpg',
        headline: 'Frontend Developer with React Expertise',
        bio: 'Skilled in building responsive and interactive UIs with React and TypeScript.',
        current_status: 'Open to work',
        preferred_location: 'San Francisco, USA',
        expected_salary: 115000,
      },
      {
        user_id: jobSeekerUsers[11].id,
        jobseeker_name: 'Alexander Lee',
        jobseeker_email: 'alexander.lee@example.com',
        profile_image: 'https://example.com/profiles/alexander.jpg',
        headline: 'Mobile App Developer Specializing in Flutter',
        bio: 'Experienced in developing cross-platform mobile apps with Flutter and Dart.',
        current_status: 'Open to work',
        preferred_location: 'London, UK',
        expected_salary: 95000,
      },
      {
        user_id: jobSeekerUsers[12].id,
        jobseeker_name: 'Charlotte Clark',
        jobseeker_email: 'charlotte.clark@example.com',
        profile_image: 'https://example.com/profiles/charlotte.jpg',
        headline: 'Data Scientist with Machine Learning Experience',
        bio: 'Proficient in predictive modeling and data analysis using Python and R.',
        current_status: 'Open to work',
        preferred_location: 'New York, USA',
        expected_salary: 125000,
      },
      {
        user_id: jobSeekerUsers[13].id,
        jobseeker_name: 'Daniel Lewis',
        jobseeker_email: 'daniel.lewis@example.com',
        profile_image: 'https://example.com/profiles/daniel.jpg',
        headline: 'Cloud Engineer with AWS Expertise',
        bio: 'Skilled in designing and managing cloud infrastructure on AWS.',
        current_status: 'Open to work',
        preferred_location: 'Berlin, Germany',
        expected_salary: 105000,
      },
      {
        user_id: jobSeekerUsers[14].id,
        jobseeker_name: 'Amelia Walker',
        jobseeker_email: 'amelia.walker@example.com',
        profile_image: 'https://example.com/profiles/amelia.jpg',
        headline: 'Scrum Master Driving Agile Success',
        bio: 'Experienced in facilitating agile processes and team collaboration.',
        current_status: 'Open to work',
        preferred_location: 'Toronto, Canada',
        expected_salary: 100000,
      },
      {
        user_id: jobSeekerUsers[15].id,
        jobseeker_name: 'Henry Hall',
        jobseeker_email: 'henry.hall@example.com',
        profile_image: 'https://example.com/profiles/henry.jpg',
        headline: 'Software Engineer Specializing in Python',
        bio: 'Proficient in building backend systems with Python and Django.',
        current_status: 'Open to work',
        preferred_location: 'Sydney, Australia',
        expected_salary: 110000,
      },
      {
        user_id: jobSeekerUsers[16].id,
        jobseeker_name: 'Evelyn Allen',
        jobseeker_email: 'evelyn.allen@example.com',
        profile_image: 'https://example.com/profiles/evelyn.jpg',
        headline: 'UI Designer Creating Seamless Experiences',
        bio: 'Skilled in designing user interfaces with Adobe XD and Figma.',
        current_status: 'Open to work',
        preferred_location: 'Paris, France',
        expected_salary: 85000,
      },
      {
        user_id: jobSeekerUsers[17].id,
        jobseeker_name: 'William Young',
        jobseeker_email: 'william.young@example.com',
        profile_image: 'https://example.com/profiles/william.jpg',
        headline: 'Network Engineer Ensuring Connectivity',
        bio: 'Experienced in managing network infrastructure and troubleshooting.',
        current_status: 'Open to work',
        preferred_location: 'Tokyo, Japan',
        expected_salary: 90000,
      },
      {
        user_id: jobSeekerUsers[18].id,
        jobseeker_name: 'Harper King',
        jobseeker_email: 'harper.king@example.com',
        profile_image: 'https://example.com/profiles/harper.jpg',
        headline: 'Content Strategist with SEO Expertise',
        bio: 'Skilled in crafting content strategies to boost online presence.',
        current_status: 'Open to work',
        preferred_location: 'Amsterdam, Netherlands',
        expected_salary: 75000,
      },
      {
        user_id: jobSeekerUsers[19].id,
        jobseeker_name: 'Benjamin Scott',
        jobseeker_email: 'benjamin.scott@example.com',
        profile_image: 'https://example.com/profiles/benjamin.jpg',
        headline: 'Machine Learning Engineer with TensorFlow Skills',
        bio: 'Experienced in developing AI models for predictive analytics.',
        current_status: 'Open to work',
        preferred_location: 'Singapore',
        expected_salary: 135000,
      },
      {
        user_id: jobSeekerUsers[20].id,
        jobseeker_name: 'Chloe Adams',
        jobseeker_email: 'chloe.adams@example.com',
        profile_image: 'https://example.com/profiles/chloe.jpg',
        headline: 'Full-Stack JavaScript Developer',
        bio: 'Proficient in MERN stack development and building scalable apps.',
        current_status: 'Open to work',
        preferred_location: 'San Francisco, USA',
        expected_salary: 125000,
      },
      {
        user_id: jobSeekerUsers[21].id,
        jobseeker_name: 'Jack Turner',
        jobseeker_email: 'jack.turner@example.com',
        profile_image: 'https://example.com/profiles/jack.jpg',
        headline: 'iOS Developer with Swift Expertise',
        bio: 'Skilled in building high-performance iOS applications with Swift.',
        current_status: 'Open to work',
        preferred_location: 'London, UK',
        expected_salary: 100000,
      },
      {
        user_id: jobSeekerUsers[22].id,
        jobseeker_name: 'Grace Parker',
        jobseeker_email: 'grace.parker@example.com',
        profile_image: 'https://example.com/profiles/grace.jpg',
        headline: 'Business Analyst with Data Expertise',
        bio: 'Experienced in analyzing business processes and data-driven decision making.',
        current_status: 'Open to work',
        preferred_location: 'New York, USA',
        expected_salary: 90000,
      },
      {
        user_id: jobSeekerUsers[23].id,
        jobseeker_name: 'Samuel Green',
        jobseeker_email: 'samuel.green@example.com',
        profile_image: 'https://example.com/profiles/samuel.jpg',
        headline: 'Site Reliability Engineer Ensuring Uptime',
        bio: 'Skilled in maintaining high-availability systems with Kubernetes.',
        current_status: 'Open to work',
        preferred_location: 'Berlin, Germany',
        expected_salary: 115000,
      },
      {
        user_id: jobSeekerUsers[24].id,
        jobseeker_name: 'Lily Evans',
        jobseeker_email: 'lily.evans@example.com',
        profile_image: 'https://example.com/profiles/lily.jpg',
        headline: 'Project Manager with Agile Experience',
        bio: 'Experienced in leading agile projects and cross-functional teams.',
        current_status: 'Open to work',
        preferred_location: 'Toronto, Canada',
        expected_salary: 120000,
      },
      {
        user_id: jobSeekerUsers[25].id,
        jobseeker_name: 'Michael Carter',
        jobseeker_email: 'michael.carter@example.com',
        profile_image: 'https://example.com/profiles/michael.jpg',
        headline: 'Backend Developer with Go Expertise',
        bio: 'Proficient in building high-performance APIs with Go and PostgreSQL.',
        current_status: 'Open to work',
        preferred_location: 'Sydney, Australia',
        expected_salary: 110000,
      },
      {
        user_id: jobSeekerUsers[26].id,
        jobseeker_name: 'Sophie Mitchell',
        jobseeker_email: 'sophie.mitchell@example.com',
        profile_image: 'https://example.com/profiles/sophie.jpg',
        headline: 'Visual Designer with Branding Skills',
        bio: 'Skilled in creating compelling visual identities and marketing materials.',
        current_status: 'Open to work',
        preferred_location: 'Paris, France',
        expected_salary: 80000,
      },
      {
        user_id: jobSeekerUsers[27].id,
        jobseeker_name: 'Thomas Baker',
        jobseeker_email: 'thomas.baker@example.com',
        profile_image: 'https://example.com/profiles/thomas.jpg',
        headline: 'Security Engineer with Penetration Testing Experience',
        bio: 'Experienced in securing systems and conducting penetration tests.',
        current_status: 'Open to work',
        preferred_location: 'Tokyo, Japan',
        expected_salary: 100000,
      },
      {
        user_id: jobSeekerUsers[28].id,
        jobseeker_name: 'Ella Phillips',
        jobseeker_email: 'ella.phillips@example.com',
        profile_image: 'https://example.com/profiles/ella.jpg',
        headline: 'Digital Marketing Manager with Analytics Skills',
        bio: 'Proficient in Google Analytics, SEO, and campaign management.',
        current_status: 'Open to work',
        preferred_location: 'Amsterdam, Netherlands',
        expected_salary: 85000,
      },
      {
        user_id: jobSeekerUsers[29].id,
        jobseeker_name: 'David Wright',
        jobseeker_email: 'david.wright@example.com',
        profile_image: 'https://example.com/profiles/david.jpg',
        headline: 'AI Research Scientist with Deep Learning Expertise',
        bio: 'Skilled in developing cutting-edge AI models with PyTorch.',
        current_status: 'Open to work',
        preferred_location: 'Singapore',
        expected_salary: 150000,
      },
    ];

    // Save job seekers to the database
    await this.jobSeekerRepository.save(jobSeekers);
    // await this.jobSeekerRepository.save(jobSeekers.slice(10, 20));

    console.log(`✅ Seeded ${jobSeekers.length} job seekers successfully.`);
  }
}
