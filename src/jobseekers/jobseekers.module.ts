import { Module } from '@nestjs/common';
import { JobseekersService } from './jobseekers.service';
import { JobseekersController } from './jobseekers.controller';

@Module({
  controllers: [JobseekersController],
  providers: [JobseekersService],
})
export class JobseekersModule {}
