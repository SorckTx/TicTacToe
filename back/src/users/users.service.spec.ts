import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  const mockUser = {
    _id: 'user_id',
    username: 'test_user',
    password: 'hashed_password',
  };

  const mockUserModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser), 
    }),
    create: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const result = await service.findOne('test_user');
      expect(result).toEqual(mockUser);
      expect(userModel.findOne).toHaveBeenCalledWith({ username: 'test_user' });
    });

    it('should return undefined if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.findOne('non_existent_user');
      expect(result).toBeNull();
    });
  });
});