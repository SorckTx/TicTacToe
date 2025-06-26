import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue({ id: 'user_id', username: 'test_user' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService }, 
        { provide: UsersService, useValue: mockUsersService }, 
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => { 
    expect(authController).toBeDefined();
  });

  it('should return access token on login', async () => {
    const result = await authController.login({ username: 'test_user', password: 'test_pass' });
    expect(result).toEqual({ access_token: 'mock_token' });
    expect(authService.login).toHaveBeenCalled();
  });

  it('should register a user through UsersService', async () => { 
    const result = await authController.register({ username: 'test_user', password: 'test_pass' });
    expect(result).toEqual({
      message: 'User created successfully',
      user: { id: 'user_id', username: 'test_user' },
    });
    expect(usersService.createUser).toHaveBeenCalledWith('test_user', 'test_pass'); 
  });
});