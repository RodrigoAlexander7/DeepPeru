import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUserJwtPayload } from './interfaces/auth-request.interface';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user payload
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('AUTH_SECRET');
    if (!secret) {
      throw new Error('AUTH_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: AuthenticatedUserJwtPayload): AuthenticatedUser {
    if (!payload.sub || !payload.email) {
      throw new Error('Invalid JWT payload: missing sub or email');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
