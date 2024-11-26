import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(
    name: string,
    email: string,
    hashedPassword: string,
    role: string,
  ) {
    // Correct usage of .create() with async/await
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return user;
  }

  async createGuest(name: string) {
    const guest = new this.userModel({
      name,
      email: `${name}@guest.com`, // Temporary email format
      password: '', // Empty password for guests
      role: 'guest', // Set default role to 'guest'
    });
    return guest.save();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
