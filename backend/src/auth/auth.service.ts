import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Signup logic
  async signup(name: string, email: string, password: string) {
    const userExists = await this.usersService.findOneByEmail(email);
    if (userExists) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user';
    const user = await this.usersService.createUser(
      name,
      email,
      hashedPassword,
      role,
    );

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Login logic
  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    console.log('🚀 ~ AuthService ~ login ~ user:', user);

    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Guest login
  async guestLogin(name: string) {
    // Generate a temporary email for the guest
    const email = `${name}@guest.com`;
    const userExists = await this.usersService.findOneByEmail(email);

    // If the guest user already exists, just return the existing user (optional)
    if (userExists) {
      const payload = { name: userExists.name, sub: userExists.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    // Create a guest user
    const user = await this.usersService.createUser(
      name,
      email,
      '', // Empty password for guest
      'guest', // Assign role as guest
    );

    const payload = { name: user.name, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
