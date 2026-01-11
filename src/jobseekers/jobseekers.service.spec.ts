import { Test, TestingModule } from '@nestjs/testing';
import { JobSeekersService } from './jobseekers.service';

describe('JobseekersService', () => {
  let service: JobSeekersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobSeekersService],
    }).compile();

    service = module.get<JobSeekersService>(JobSeekersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
