import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = (await this.usersService.findOne(username)) as UserDocument;
    if (!user) {
      return null;
    }
  
    const isMatch = await bcrypt.compare(pass, user.password);
  
    if (isMatch) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
  
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
  
    await this.usersService.saveToken(user.username, token);
  
    return {
      access_token: token,
    };
  }
  async logout(username: string) {
    await this.usersService.invalidateToken(username);
  }
}