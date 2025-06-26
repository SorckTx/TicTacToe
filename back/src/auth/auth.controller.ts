import { Controller, Post, Body, Request, UseGuards, ConflictException, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    if (!username || !password) {
      throw new ConflictException('Username and password are required');
    }

    const newUser = await this.usersService.createUser(username, password);
    
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    await this.authService.logout(req.user.username);
    return { message: 'User logged out successfully' };
  }
}