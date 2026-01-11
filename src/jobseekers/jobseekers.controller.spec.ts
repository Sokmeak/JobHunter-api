import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekersController } from './jobseekers.controller';
import { JobSeekersService } from './jobseekers.service';

describe('JobseekersController', () => {
  let controller: JobSeekersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobSeekersController],
      providers: [JobSeekersService],
    }).compile();

    controller = module.get<JobSeekersController>(JobSeekersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
