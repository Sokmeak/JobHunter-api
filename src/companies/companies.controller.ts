import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { UpdateOfficeLocationDto } from './dto/update-office-location.dto';
import { CreateOfficeImageDto } from './dto/create-office-image.dto';
import { UpdateOfficeImageDto } from './dto/update-office-image.dto';
import { CreateCompanyDocumentDto } from './dto/create-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-document.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthenticationGuard } from 'src/auth/guards/authentication/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getCompany(@Request() req) {
    log('Request: ' + req.user.id);
    return this.companiesService.getCompany(req.user.id);
  }

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  createCompany(@Body() createCompanyDto: CreateCompanyDto, @Req() req: any) {
    return this.companiesService.createCompany(req.user.id, createCompanyDto);
  }

  @Put()
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateCompany(@Body() updateCompanyDto: UpdateCompanyDto, @Req() req: any) {
    return this.companiesService.updateCompany(req.user.id, updateCompanyDto);
  }

  @Post('media/:type')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadCompanyMedia(
    @Param('type') type: 'logo' | 'image',
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.uploadCompanyMedia(req.user.id, file, type);
  }

  @Get()
  getCompanies(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('industry') industry: string,
  ) {
    return this.companiesService.getCompanies(
      +page || 1,
      +limit || 10,
      industry,
    );
  }

  @Post('notifications')
  @UseGuards(AuthenticationGuard, RolesGuard)
  sendNotification(
    @Body() sendNotificationDto: SendNotificationDto,
    @Req() req: any,
  ) {
    return this.companiesService.sendNotification(
      req.user.id,
      sendNotificationDto,
    );
  }

  // all jobs for all companies

  @Get('all-jobs')
  getAllJobs(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('industry') industry: string,
  ) {
    return this.companiesService.getAllJobs(page, limit, industry);
  }

  // all jobs belong to a company

  @Post('jobs')
  @UseGuards(AuthenticationGuard, RolesGuard)
  createJob(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    return this.companiesService.createJob(req.user.id, createJobDto);
  }

  @Get('jobs')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getJobs(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log(req);
    const userId = Number(req.user.id);
    if (isNaN(userId) || !Number.isInteger(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    log('Request Header:', req.user);
    return this.companiesService.getJobs(userId, page, limit);
  }

  @Delete()
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteCompany(@Req() req: any) {
    return this.companiesService.deleteCompany(req.user.id);
  }

  @Post('members')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('profileImg'))
  addMember(
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.addMember(req.user.id, createMemberDto, file);
  }

  @Get('members')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getMembers(@Request() req) {
    console.log(req.user.id);

    return this.companiesService.getMembers(req.user.id);
  }

  @Put('members/:memberId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('profileImg'))
  updateMember(
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.updateMember(
      req.user.id,
      +memberId,
      updateMemberDto,
      file,
    );
  }

  @Delete('members/:memberId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteMember(@Param('memberId') memberId: string, @Req() req: any) {
    return this.companiesService.deleteMember(req.user.id, +memberId);
  }

  @Post('tech-stack')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addTechStack(@Body('technologyId') technologyId: number, @Req() req: any) {
    return this.companiesService.addTechStack(req.user.id, technologyId);
  }

  @Get('tech-stack')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getTechStack(@Req() req: any) {
    return this.companiesService.getTechStack(req.user.id);
  }

  @Delete('tech-stack/:technologyId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteTechStack(
    @Param('technologyId') technologyId: string,
    @Req() req: any,
  ) {
    return this.companiesService.deleteTechStack(req.user.id, +technologyId);
  }

  @Post('office-locations')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addOfficeLocation(
    @Body() createOfficeLocationDto: CreateOfficeLocationDto,
    @Req() req: any,
  ) {
    return this.companiesService.addOfficeLocation(
      req.user.id,
      createOfficeLocationDto,
    );
  }

  @Get('office-locations')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getOfficeLocations(@Req() req: any) {
    return this.companiesService.getOfficeLocations(req.user.id);
  }

  @Put('office-locations/:locationId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateOfficeLocation(
    @Param('locationId') locationId: string,
    @Body() updateOfficeLocationDto: UpdateOfficeLocationDto,
    @Req() req: any,
  ) {
    return this.companiesService.updateOfficeLocation(
      req.user.id,
      +locationId,
      updateOfficeLocationDto,
    );
  }

  @Delete('office-locations/:locationId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteOfficeLocation(
    @Param('locationId') locationId: string,
    @Req() req: any,
  ) {
    return this.companiesService.deleteOfficeLocation(req.user.id, +locationId);
  }

  @Post('office-locations/:locationId/images')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  addOfficeImage(
    @Param('locationId') locationId: string,
    @Body() createOfficeImageDto: CreateOfficeImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.addOfficeImage(
      req.user.id,
      +locationId,
      createOfficeImageDto,
      file,
    );
  }

  @Get('office-locations/:locationId/images')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getOfficeImages(@Param('locationId') locationId: string, @Req() req: any) {
    return this.companiesService.getOfficeImages(req.user.id, +locationId);
  }

  @Put('office-locations/:locationId/images/:imageId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateOfficeImage(
    @Param('locationId') locationId: string,
    @Param('imageId') imageId: string,
    @Body() updateOfficeImageDto: UpdateOfficeImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.updateOfficeImage(
      req.user.id,
      +locationId,
      +imageId,
      updateOfficeImageDto,
      file,
    );
  }

  @Delete('office-locations/:locationId/images/:imageId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteOfficeImage(
    @Param('locationId') locationId: string,
    @Param('imageId') imageId: string,
    @Req() req: any,
  ) {
    return this.companiesService.deleteOfficeImage(
      req.user.id,
      +locationId,
      +imageId,
    );
  }

  @Post('documents')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  addCompanyDocument(
    @Body() createCompanyDocumentDto: CreateCompanyDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.addCompanyDocument(
      req.user.id,
      createCompanyDocumentDto,
      file,
    );
  }

  @Get('documents')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getCompanyDocuments(@Req() req: any) {
    return this.companiesService.getCompanyDocuments(req.user.id);
  }

  @Put('documents/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateCompanyDocument(
    @Param('id') id: string,
    @Body() updateCompanyDocumentDto: UpdateCompanyDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.companiesService.updateCompanyDocument(
      req.user.id,
      +id,
      updateCompanyDocumentDto,
      file,
    );
  }

  @Delete('documents/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteCompanyDocument(@Param('id') id: string, @Req() req: any) {
    return this.companiesService.deleteCompanyDocument(req.user.id, +id);
  }

  @Put('jobs/:jobId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateJob(
    @Param('jobId') jobId: string,
    @Body() updateJobDto: UpdateJobDto,
    @Req() req: any,
  ) {
    return this.companiesService.updateJob(req.user.id, +jobId, updateJobDto);
  }

  @Delete('jobs/:jobId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteJob(@Param('jobId') jobId: string, @Req() req: any) {
    return this.companiesService.deleteJob(req.user.id, +jobId);
  }

  @Get('jobs/:jobId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getJob(@Req() req: any, @Param('jobId') jobId: string) {
    return this.companiesService.getJob(req.user.id, +jobId);
  }

  @Get('jobs/:jobId/applications')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getJobApplications(
    @Param('jobId') jobId: string,
    @Query('status') status: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: any,
  ) {
    return this.companiesService.getJobApplications(
      req.user.id,
      +jobId,
      status,
      +page || 1,
      +limit || 10,
    );
  }

  @Put('applications/:applicationId/status')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
    @Req() req: any,
  ) {
    return this.companiesService.updateApplicationStatus(
      req.user.id,
      +applicationId,
      updateApplicationStatusDto,
    );
  }

  @Post('applications/:applicationId/interviews')
  @UseGuards(AuthenticationGuard, RolesGuard)
  scheduleInterview(
    @Param('applicationId') applicationId: string,
    @Body() scheduleInterviewDto: ScheduleInterviewDto,
    @Req() req: any,
  ) {
    return this.companiesService.scheduleInterview(
      req.user.id,
      +applicationId,
      scheduleInterviewDto,
    );
  }

  @Get('interviews')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getInterviews(
    @Query('jobId') jobId: string,
    @Query('status') status: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: any,
  ) {
    return this.companiesService.getInterviews(
      req.user.id,
      jobId ? +jobId : undefined,
      status,
      +page || 1,
      +limit || 10,
    );
  }

  @Put('interviews/:interviewId/status')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateInterviewStatus(
    @Param('interviewId') interviewId: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.companiesService.updateInterviewStatus(
      req.user.id,
      +interviewId,
      status,
    );
  }

  @Get('analytics')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getAnalytics(@Query('jobId') jobId: string, @Req() req: any) {
    return this.companiesService.getAnalytics(
      req.user.id,
      jobId ? +jobId : undefined,
    );
  }

  @Get('/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getCompanyById(@Param('id') id: number) {
    return this.companiesService.getCompany(id.toString());
  }
}
