// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { CompaniesService } from './companies.service';
// import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
// import { CompanyResponseDto } from './dto/company-response.dto';
// import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

// import { Company } from './entities/company.entity';
// @UseInterceptors(ClassSerializerInterceptor)
// @Controller('companies')
// export class CompaniesController {
//   constructor(private readonly companiesService: CompaniesService) {}

//   @Post()
//   create(
//     @Body() createCompanyDto: CreateCompanyDto,
//   ): Promise<CompanyResponseDto> {
//     return this.companiesService.create(createCompanyDto);
//   }

//   @Get()
//   findAll(): Promise<CompanyResponseDto[]> {
//     return this.companiesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string): Promise<CompanyResponseDto> {
//     return this.companiesService.findOne(+id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateCompanyDto: UpdateCompanyDto,
//   ): Promise<CompanyResponseDto> {
//     return this.companiesService.update(+id, updateCompanyDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.companiesService.remove(+id);
//   }
//   @Get('/userId/:id')
//   getByUserId(@Param('id') id: string): Promise<CompanyResponseDto> {
//     return this.companiesService.findByUserId(+id);
//   }
// }
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
  Request,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { UpdateOfficeLocationDto } from './dto/update-office-location.dto';
import { CreateJobBenefitDto } from './dto/create-job-benefit.dto';
import { UpdateJobBenefitDto } from './dto/update-job-benefit.dto';
import { CreateOfficeImageDto } from './dto/create-office-image.dto';
import { UpdateOfficeImageDto } from './dto/update-office-image.dto';
import { CreateCompanyDocumentDto } from './dto/create-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-document.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Request() req: any,
  ) {
    return this.companiesService.createCompany(req.user.id, createCompanyDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateCompany(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req: any,
  ) {
    return this.companiesService.updateCompany(req.user.id, updateCompanyDto);
  }

  @Post('media/:type')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadCompanyMedia(
    @Param('type') type: 'logo' | 'image',
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getCompany(@Request() req: any) {
    return this.companiesService.getCompany(req.user.id);
  }
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getCompanyById(@Param('id') id: number) {
    return this.companiesService.getCompanyById(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteCompany(@Request() req: any) {
    return this.companiesService.deleteCompany(req.user.id);
  }

  @Post('members')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImg'))
  addMember(
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.companiesService.addMember(req.user.id, createMemberDto, file);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard)
  getMembers(@Request() req: any) {
    return this.companiesService.getMembers(req.user.id);
  }

  @Put('members/:memberId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImg'))
  updateMember(
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.companiesService.updateMember(
      req.user.id,
      +memberId,
      updateMemberDto,
      file,
    );
  }

  @Delete('members/:memberId')
  @UseGuards(JwtAuthGuard)
  deleteMember(@Param('memberId') memberId: string, @Request() req: any) {
    return this.companiesService.deleteMember(req.user.id, +memberId);
  }

  @Post('tech-stack')
  @UseGuards(JwtAuthGuard)
  addTechStack(
    @Body('technologyId') technologyId: number,
    @Request() req: any,
  ) {
    return this.companiesService.addTechStack(req.user.id, technologyId);
  }

  @Get('tech-stack')
  @UseGuards(JwtAuthGuard)
  getTechStack(@Request() req: any) {
    return this.companiesService.getTechStack(req.user.id);
  }

  @Delete('tech-stack/:technologyId')
  @UseGuards(JwtAuthGuard)
  deleteTechStack(
    @Param('technologyId') technologyId: string,
    @Request() req: any,
  ) {
    return this.companiesService.deleteTechStack(req.user.id, +technologyId);
  }

  @Post('office-locations')
  @UseGuards(JwtAuthGuard)
  addOfficeLocation(
    @Body() createOfficeLocationDto: CreateOfficeLocationDto,
    @Request() req: any,
  ) {
    return this.companiesService.addOfficeLocation(
      req.user.id,
      createOfficeLocationDto,
    );
  }

  @Get('office-locations')
  @UseGuards(JwtAuthGuard)
  getOfficeLocations(@Request() req: any) {
    return this.companiesService.getOfficeLocations(req.user.id);
  }

  @Put('office-locations/:locationId')
  @UseGuards(JwtAuthGuard)
  updateOfficeLocation(
    @Param('locationId') locationId: string,
    @Body() updateOfficeLocationDto: UpdateOfficeLocationDto,
    @Request() req: any,
  ) {
    return this.companiesService.updateOfficeLocation(
      req.user.id,
      +locationId,
      updateOfficeLocationDto,
    );
  }

  @Delete('office-locations/:locationId')
  @UseGuards(JwtAuthGuard)
  deleteOfficeLocation(
    @Param('locationId') locationId: string,
    @Request() req: any,
  ) {
    return this.companiesService.deleteOfficeLocation(req.user.id, +locationId);
  }

  @Post('office-locations/:locationId/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  addOfficeImage(
    @Param('locationId') locationId: string,
    @Body() createOfficeImageDto: CreateOfficeImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.companiesService.addOfficeImage(
      req.user.id,
      +locationId,
      createOfficeImageDto,
      file,
    );
  }

  @Get('office-locations/:locationId/images')
  @UseGuards(JwtAuthGuard)
  getOfficeImages(
    @Param('locationId') locationId: string,
    @Request() req: any,
  ) {
    return this.companiesService.getOfficeImages(req.user.id, +locationId);
  }

  @Put('office-locations/:locationId/images/:imageId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateOfficeImage(
    @Param('locationId') locationId: string,
    @Param('imageId') imageId: string,
    @Body() updateOfficeImageDto: UpdateOfficeImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
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
  @UseGuards(JwtAuthGuard)
  deleteOfficeImage(
    @Param('locationId') locationId: string,
    @Param('imageId') imageId: string,
    @Request() req: any,
  ) {
    return this.companiesService.deleteOfficeImage(
      req.user.id,
      +locationId,
      +imageId,
    );
  }

  @Post('documents')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  addCompanyDocument(
    @Body() createCompanyDocumentDto: CreateCompanyDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.companiesService.addCompanyDocument(
      req.user.id,
      createCompanyDocumentDto,
      file,
    );
  }

  @Get('documents')
  @UseGuards(JwtAuthGuard)
  getCompanyDocuments(@Request() req: any) {
    return this.companiesService.getCompanyDocuments(req.user.id);
  }

  @Put('documents/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateCompanyDocument(
    @Param('id') id: string,
    @Body() updateCompanyDocumentDto: UpdateCompanyDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.companiesService.updateCompanyDocument(
      req.user.id,
      +id,
      updateCompanyDocumentDto,
      file,
    );
  }

  @Delete('documents/:id')
  @UseGuards(JwtAuthGuard)
  deleteCompanyDocument(@Param('id') id: string, @Request() req: any) {
    return this.companiesService.deleteCompanyDocument(req.user.id, +id);
  }

  @Post('jobs')
  @UseGuards(JwtAuthGuard)
  createJob(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    return this.companiesService.createJob(req.user.id, createJobDto);
  }

  @Put('jobs/:jobId')
  @UseGuards(JwtAuthGuard)
  updateJob(
    @Param('jobId') jobId: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: any,
  ) {
    return this.companiesService.updateJob(req.user.id, +jobId, updateJobDto);
  }

  @Delete('jobs/:jobId')
  @UseGuards(JwtAuthGuard)
  deleteJob(@Param('jobId') jobId: string, @Request() req: any) {
    return this.companiesService.deleteJob(req.user.id, +jobId);
  }

  @Get('jobs')
  @UseGuards(JwtAuthGuard)
  getJobs(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req: any,
  ) {
    return this.companiesService.getJobs(req.user.id, +page || 1, +limit || 10);
  }

  @Get('jobs/:jobId/applications')
  @UseGuards(JwtAuthGuard)
  getJobApplications(
    @Param('jobId') jobId: string,
    @Query('status') status: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req: any,
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
  @UseGuards(JwtAuthGuard)
  updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
    @Request() req: any,
  ) {
    return this.companiesService.updateApplicationStatus(
      req.user.id,
      +applicationId,
      updateApplicationStatusDto,
    );
  }

  @Post('applications/:applicationId/interviews')
  @UseGuards(JwtAuthGuard)
  scheduleInterview(
    @Param('applicationId') applicationId: string,
    @Body() scheduleInterviewDto: ScheduleInterviewDto,
    @Request() req: any,
  ) {
    return this.companiesService.scheduleInterview(
      req.user.id,
      +applicationId,
      scheduleInterviewDto,
    );
  }

  @Get('interviews')
  @UseGuards(JwtAuthGuard)
  getInterviews(
    @Query('jobId') jobId: string,
    @Query('status') status: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req: any,
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
  @UseGuards(JwtAuthGuard)
  updateInterviewStatus(
    @Param('interviewId') interviewId: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.companiesService.updateInterviewStatus(
      req.user.id,
      +interviewId,
      status,
    );
  }

  @Post('notifications')
  @UseGuards(JwtAuthGuard)
  sendNotification(
    @Body() sendNotificationDto: SendNotificationDto,
    @Request() req: any,
  ) {
    return this.companiesService.sendNotification(
      req.user.id,
      sendNotificationDto,
    );
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  getAnalytics(@Query('jobId') jobId: string, @Request() req: any) {
    return this.companiesService.getAnalytics(
      req.user.id,
      jobId ? +jobId : undefined,
    );
  }
}
