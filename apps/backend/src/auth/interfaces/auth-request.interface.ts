import { Request } from 'express';

export interface AuthenticatedUserJwtPayload {
  sub: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUserJwtPayload;
}
