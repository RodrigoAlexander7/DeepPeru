import { Request } from 'express';

export interface GoogleUser {
  name: string;
  email: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest extends Request {
  user: GoogleUser;
}
