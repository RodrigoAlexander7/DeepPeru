import { Request } from 'express';
import { AuthenticatedUser } from './authenticated-user.interface';

export interface AuthenticatedUserJwtPayload {
  sub: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}
