import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AuthenticatedUserJwtPayload } from '../interfaces/auth-request.interface';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

// This register the jwt guard on passport
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('AUTH_SECRET');
    if (!secret) {
      throw new Error('AUTH_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Primero intenta obtener el token del header Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Si no está en el header, intenta obtenerlo de las cookies
        (request: Request) => {
          if (request?.cookies?.access_token) {
            return request.cookies.access_token;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AUTH_SECRET') || 'default-secret', // our secret key
    });
  }

  validate(payload: AuthenticatedUserJwtPayload): AuthenticatedUser {
    if (!payload.sub || !payload.email) {
      throw new Error('Invalid JWT payload: missing sub or email');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
