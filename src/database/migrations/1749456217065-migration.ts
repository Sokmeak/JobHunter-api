import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749456217065 implements MigrationInterface {
    name = 'Migration1749456217065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."roles_type_enum" AS ENUM('ADMIN', 'JOB SEEKER', 'EMPLOYER')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "type" "public"."roles_type_enum" NOT NULL, "description" character varying, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "website_url" character varying NOT NULL, "founded_date" character varying, "employee_count" character varying NOT NULL, "industry" character varying, "office_location" character varying, "twitter_url" character varying, "facebook_url" character varying, "linked_url" character varying, "email" character varying, "hr_contact_name" character varying, "hr_contact_email" character varying, "headquarters_location" character varying, "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "role_id" character varying, "title" character varying NOT NULL, "message" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "roleId" integer NOT NULL, "companyId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_41c6e4d3e02c152f845cd1dfc03" UNIQUE ("roleId", "email"), CONSTRAINT "REL_6f9395c9037632a31107c8a9e5" UNIQUE ("companyId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "company_id" character varying NOT NULL, "location" character varying NOT NULL, "salary_min" integer, "salary_max" integer, "job_type" character varying NOT NULL, "industry" character varying NOT NULL, "description" text NOT NULL, "required_skills" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_applications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "job_id" character varying NOT NULL, "fullname" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "currentjob" character varying, "linkedinUrl" character varying, "portfolioURL" character varying, "resumePath" character varying NOT NULL, "applied_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'pending', "jobSeekerId" integer, "jobId" integer, CONSTRAINT "PK_c56a5e86707d0f0df18fa111280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "education_history" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "institution_name" character varying NOT NULL, "degree" character varying NOT NULL, "field_of_study" character varying NOT NULL, "start_year" integer NOT NULL, "end_year" integer, "grade" character varying, "jobSeekerId" integer, CONSTRAINT "PK_efd951deaf6ecdd4991eecc2b36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_experience" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "company_name" character varying NOT NULL, "job_title" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "responsibilities" text NOT NULL, "jobSeekerId" integer, CONSTRAINT "PK_d4bef63ad6da7ec327515c121bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill_tags" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "skill_name" character varying NOT NULL, "endorsements_count" integer NOT NULL DEFAULT '0', "jobSeekerId" integer, CONSTRAINT "PK_b9b1d546062451f171f1d8e0ba9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interview_invitations" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "job_id" character varying NOT NULL, "company_id" character varying NOT NULL, "invitation_status" character varying NOT NULL DEFAULT 'pending', "interview_date" TIMESTAMP, "interview_mode" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "jobSeekerId" integer, "jobId" integer, "companyId" integer, CONSTRAINT "PK_44d679ee3e93326ba2703cdd752" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_alerts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "keywords" text, "location" character varying, "job_type" character varying, "industry" character varying, "min_salary" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "jobSeekerId" integer, CONSTRAINT "PK_86de3f72f9720d708e6a2729a09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interview_preferences" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "available_days" text, "preferred_time_slots" text, "interview_mode" character varying, CONSTRAINT "PK_e95cfdbf7d31e563a3624c00f9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saved_jobs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" integer NOT NULL, "job_id" integer NOT NULL, "saved_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e106c66fc89f96addc57f71fb0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_seekers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "profile_image" character varying, "headline" character varying, "bio" text, "current_status" character varying, "preferred_location" character varying, "expected_salary" integer, CONSTRAINT "REL_2e6598127070580810c62369b1" UNIQUE ("user_id"), CONSTRAINT "PK_55226d152f96d335fdeae57b6d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resumes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "job_seeker_id" character varying NOT NULL, "resume_url" character varying NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "jobSeekerId" integer, CONSTRAINT "PK_9c8677802096d6baece48429d2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tests" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "testname" character varying NOT NULL, "status" boolean NOT NULL, CONSTRAINT "PK_4301ca51edf839623386860aed2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_63f6bd3131b751f3ef4950fb544" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_e80bb2ee23aa104efce695fb8ca" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_applications" ADD CONSTRAINT "FK_800dbac1b41b16b232fbf42f100" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education_history" ADD CONSTRAINT "FK_b3953b367eb03320de70f91edfd" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_experience" ADD CONSTRAINT "FK_eae02cc2be25531882d2e1192f4" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_tags" ADD CONSTRAINT "FK_4e365aef15ed70b861bd3171654" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" ADD CONSTRAINT "FK_52273fe499326bfea83649a1c60" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" ADD CONSTRAINT "FK_c725dd707e82d9bb7525685e77d" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" ADD CONSTRAINT "FK_b3bb73738eb2148c9542c6deeff" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_alerts" ADD CONSTRAINT "FK_a9c9844e768e551bab382760dce" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_jobs" ADD CONSTRAINT "FK_ba47134508b5734db1e296a06c5" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_jobs" ADD CONSTRAINT "FK_af5c8a7f3e11e8e646ea0f81a04" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_seekers" ADD CONSTRAINT "FK_2e6598127070580810c62369b10" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resumes" ADD CONSTRAINT "FK_05a868632cb2fa5eece49cc3bec" FOREIGN KEY ("jobSeekerId") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resumes" DROP CONSTRAINT "FK_05a868632cb2fa5eece49cc3bec"`);
        await queryRunner.query(`ALTER TABLE "job_seekers" DROP CONSTRAINT "FK_2e6598127070580810c62369b10"`);
        await queryRunner.query(`ALTER TABLE "saved_jobs" DROP CONSTRAINT "FK_af5c8a7f3e11e8e646ea0f81a04"`);
        await queryRunner.query(`ALTER TABLE "saved_jobs" DROP CONSTRAINT "FK_ba47134508b5734db1e296a06c5"`);
        await queryRunner.query(`ALTER TABLE "job_alerts" DROP CONSTRAINT "FK_a9c9844e768e551bab382760dce"`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" DROP CONSTRAINT "FK_b3bb73738eb2148c9542c6deeff"`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" DROP CONSTRAINT "FK_c725dd707e82d9bb7525685e77d"`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" DROP CONSTRAINT "FK_52273fe499326bfea83649a1c60"`);
        await queryRunner.query(`ALTER TABLE "skill_tags" DROP CONSTRAINT "FK_4e365aef15ed70b861bd3171654"`);
        await queryRunner.query(`ALTER TABLE "work_experience" DROP CONSTRAINT "FK_eae02cc2be25531882d2e1192f4"`);
        await queryRunner.query(`ALTER TABLE "education_history" DROP CONSTRAINT "FK_b3953b367eb03320de70f91edfd"`);
        await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_800dbac1b41b16b232fbf42f100"`);
        await queryRunner.query(`ALTER TABLE "job_applications" DROP CONSTRAINT "FK_e80bb2ee23aa104efce695fb8ca"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_63f6bd3131b751f3ef4950fb544"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`DROP TABLE "tests"`);
        await queryRunner.query(`DROP TABLE "resumes"`);
        await queryRunner.query(`DROP TABLE "job_seekers"`);
        await queryRunner.query(`DROP TABLE "saved_jobs"`);
        await queryRunner.query(`DROP TABLE "interview_preferences"`);
        await queryRunner.query(`DROP TABLE "job_alerts"`);
        await queryRunner.query(`DROP TABLE "interview_invitations"`);
        await queryRunner.query(`DROP TABLE "skill_tags"`);
        await queryRunner.query(`DROP TABLE "work_experience"`);
        await queryRunner.query(`DROP TABLE "education_history"`);
        await queryRunner.query(`DROP TABLE "job_applications"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_type_enum"`);
    }

}
