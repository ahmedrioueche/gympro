import { ErrorCode } from '@ahmedrioueche/gympro-client';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const JWT_SECRET = this.configService.get<string>('JWT_SECRET');

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    // First try to get token from cookies (httpOnly cookies)
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header for backward compatibility
    if (!token) {
      const authHeader = req.headers['authorization'];
      if (authHeader) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException({
        message: 'No token provided',
        errorCode: ErrorCode.NO_TOKEN_PROVIDED,
      });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      req.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        errorCode: ErrorCode.INVALID_TOKEN,
      });
    }
  }
}
