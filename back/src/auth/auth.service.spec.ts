import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../schemas/users.schema';

describe('AuthService', () => { 
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: Partial<UserDocument> = { 
    _id: 'user_id',
    username: 'test_user',
    password: bcrypt.hashSync('test_pass', 10),
    toObject: function () { return { _id: this._id, username: this.username }; },
  };

  const mockUsersService = { 
    findOne: jest.fn().mockResolvedValue(mockUser),
    saveToken: jest.fn().mockResolvedValue(undefined),  
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {  
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => { 
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => { 
    it('should return user data if credentials are valid', async () => { 
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      const result = await authService.validateUser('test_user', 'test_pass');
      expect(result).toEqual({ _id: 'user_id', username: 'test_user' });
    });

    it('should return null if user is not found', async () => { 
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(null);
      const result = await authService.validateUser('invalid_user', 'test_pass');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => { 
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      const result = await authService.validateUser('test_user', 'wrong_pass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token on successful login', async () => { 
      const user = { _id: 'user_id', username: 'test_user' };
      const result = await authService.login(user);

      expect(result).toEqual({ access_token: 'mock_token' }); 
      expect(jwtService.sign).toHaveBeenCalledWith(  
        { username: 'test_user', sub: 'user_id' },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );
      expect(usersService.saveToken).toHaveBeenCalledWith('test_user', 'mock_token'); 
    });
  });
});