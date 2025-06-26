import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from '../../services/home.service';

describe('HomeService', () => {
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService],
    }).compile();

    service = module.get<HomeService>(HomeService);
  });

  describe('run', () => {
    it('should return welcome message', () => {
      const result = service.run();
      expect(result).toEqual({ 
        status: 'Welcome to Shakers Skeleton NestJS 🚀' 
      });
    });
  });
}); 