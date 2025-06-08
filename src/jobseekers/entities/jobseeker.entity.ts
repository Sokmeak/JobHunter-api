import { IsString, IsNotEmpty } from 'class-validator';
import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { InterviewInvitation } from '../interview-invitation/interview-invitation.entity';

@Entity('jobseekers')
export class JobSeeker extends BaseEntity {
  @IsString()
  location: string;
  @IsNotEmpty()
  hobby: string;
  @OneToMany(() => InterviewInvitation, (invitation) => invitation.jobSeeker, {
    cascade: true,
  })
  interviewInvitations: InterviewInvitation[];
}
