import { Test, TestingModule } from '@nestjs/testing';
import { JobhunterSystemService } from './jobhunter-system.service';

describe('JobhunterSystemService', () => {
  let service: JobhunterSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobhunterSystemService],
    }).compile();

    service = module.get<JobhunterSystemService>(JobhunterSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
