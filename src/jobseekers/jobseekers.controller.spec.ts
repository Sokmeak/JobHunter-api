import { Test, TestingModule } from '@nestjs/testing';
import { JobseekersController } from './jobseekers.controller';
import { JobseekersService } from './jobseekers.service';

describe('JobseekersController', () => {
  let controller: JobseekersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobseekersController],
      providers: [JobseekersService],
    }).compile();

    controller = module.get<JobseekersController>(JobseekersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
