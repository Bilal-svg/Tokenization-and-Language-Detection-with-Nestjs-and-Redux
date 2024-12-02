import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log(
      '🚀 ~ AuthGuard ~ canActivate ~ request.headers:',
      request.headers,
    );
    console.log('🚀 ~ AuthGuard ~ canActivate ~ authHeader:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log('🚀 ~ AuthGuard ~ canActivate ~ token:', token);

    try {
      const user = this.authService.verifyToken(token); // Ensure token verification
      request.user = user; // Attach the decoded user to the request object
      context.switchToHttp().getResponse().locals.user = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
