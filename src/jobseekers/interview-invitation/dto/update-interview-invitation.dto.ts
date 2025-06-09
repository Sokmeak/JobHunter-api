import { IsString, IsIn } from 'class-validator';

export class UpdateInterviewInvitationDto {
  @IsString()
  @IsIn(['accepted', 'rejected'])
  invitation_status: string;
}
