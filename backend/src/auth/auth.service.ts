import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { User } from '../schemas/user.schema.js'; // Ensure this import is correct
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken package

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Method to verify the JWT token
  verifyToken(token: string) {
    try {
      console.log('🚀 ~ AuthService ~ verifyToken ~ token:', token);
      console.log(
        '🚀 ~ AuthService ~ verifyToken ~ process.env.JWT_SECRET_KEY:',
        process.env.JWT_SECRET_KEY,
      );
      const decodedToken = jwt.decode(token);
      console.log('Decoded Token:', decodedToken);
      console.log('first');

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Secret key to decode token
      console.log('🚀 ~ AuthService ~ verifyToken ~ decoded:', decoded);
      return decoded; // Return the decoded token (user data)
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token'); // If verification fails, throw an error
    }
  }

  // Signup method
  async signup(name: string, email: string, password: string) {
    const userExists = await this.usersService.findOneByEmail(email);
    if (userExists) throw new UnauthorizedException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'user'; // default role is 'user'
    const user = await this.usersService.createUser(
      name,
      email,
      hashedPassword,
      role,
    );

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '5m', // Set the expiration time if needed
    });

    return { token };
  }

  // Login method
  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '2d',
    });

    console.log(token);

    return { token };
  }

  // Guest login method
  async guestLogin(name: string) {
    const email = `${name}@guest.com`;
    const userExists = await this.usersService.findOneByEmail(email);
    console.log('🚀 ~ AuthService ~ guestLogin ~ userExists:', userExists);

    if (userExists) {
      const payload = {
        email: userExists.email,
        sub: userExists.id,
        role: userExists.role,
      };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '5d', // Set the expiration time for guest
      });
      console.log('🚀 ~ AuthService ~ guestLogin ~ token:', token);
      return { token };
    }

    const user = await this.usersService.createUser(name, email, '', 'guest');
    console.log('🚀 ~ AuthService ~ guestLogin ~ user:', user);
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '5d',
    });

    return { token };
  }
}
