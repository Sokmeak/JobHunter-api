import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749451782548 implements MigrationInterface {
    name = 'Migration1749451782548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tests" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "testname" character varying NOT NULL, "status" boolean NOT NULL, CONSTRAINT "PK_4301ca51edf839623386860aed2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jobseekers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_88635e6654187ac93bbd332336a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "industry" character varying NOT NULL, "reviews" text, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "company_id" character varying NOT NULL, "location" character varying NOT NULL, "salary_min" integer, "salary_max" integer, "job_type" character varying NOT NULL, "industry" character varying NOT NULL, "description" text NOT NULL, "required_skills" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interview_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "job_seeker_id" character varying NOT NULL, "job_id" character varying NOT NULL, "company_id" character varying NOT NULL, "invitation_status" character varying NOT NULL DEFAULT 'pending', "interview_date" TIMESTAMP, "interview_mode" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "jobSeekerId" integer, "jobId" integer, "companyId" integer, CONSTRAINT "PK_44d679ee3e93326ba2703cdd752" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "roleId" integer NOT NULL, "companyId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_41c6e4d3e02c152f845cd1dfc03" UNIQUE ("roleId", "email"), CONSTRAINT "REL_6f9395c9037632a31107c8a9e5" UNIQUE ("companyId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."roles_type_enum" AS ENUM('ADMIN', 'JOB SEEKER', 'EMPLOYER')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "type" "public"."roles_type_enum" NOT NULL, "description" character varying, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resumes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c8677802096d6baece48429d2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "reviews"`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "reviews" text`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "website_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "founded_date" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "employee_count" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "office_location" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "twitter_url" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "facebook_url" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "linked_url" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "hr_contact_name" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "hr_contact_email" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "headquarters_location" character varying`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "industry" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" ADD CONSTRAINT "FK_52273fe499326bfea83649a1c60" FOREIGN KEY ("jobSeekerId") REFERENCES "jobseekers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" ADD CONSTRAINT "FK_c725dd707e82d9bb7525685e77d" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" ADD CONSTRAINT "FK_b3bb73738eb2148c9542c6deeff" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" DROP CONSTRAINT "FK_b3bb73738eb2148c9542c6deeff"`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" DROP CONSTRAINT "FK_c725dd707e82d9bb7525685e77d"`);
        await queryRunner.query(`ALTER TABLE "interview_invitations" DROP CONSTRAINT "FK_52273fe499326bfea83649a1c60"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801"`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "industry" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "headquarters_location"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "hr_contact_email"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "hr_contact_name"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "linked_url"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "facebook_url"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "twitter_url"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "office_location"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "employee_count"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "founded_date"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "website_url"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "reviews"`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "reviews" text`);
        await queryRunner.query(`DROP TABLE "resumes"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "interview_invitations"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "jobseekers"`);
        await queryRunner.query(`DROP TABLE "tests"`);
    }

}
