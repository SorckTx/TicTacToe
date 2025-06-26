import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from '../../controllers/home.controller';
import { HomeService } from '../../services/home.service';

describe('HomeController', () => {
  let controller: HomeController;
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [HomeService],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    service = module.get<HomeService>(HomeService);
  });

  describe('run', () => {
    it('should return result from service', () => {
      const result = controller.run();
      expect(result).toEqual({ 
        status: 'Welcome to Shakers Skeleton NestJS 🚀' 
      });
    });

    it('should call service.run', () => {
      jest.spyOn(service, 'run');
      controller.run();
      expect(service.run).toHaveBeenCalled();
    });
  });
}); 