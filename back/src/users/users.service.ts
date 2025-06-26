import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}




  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new this.userModel({
      username,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async saveToken(username: string, token: string): Promise<void> {
    const user = await this.userModel.findOne({ username });
    if (!user.accessToken) {
      await this.userModel.updateOne({ username }, { accessToken: token });
    }
  }
  async invalidateToken(username: string) {
    await this.userModel.updateOne({ username }, { token: null });
  }
}
