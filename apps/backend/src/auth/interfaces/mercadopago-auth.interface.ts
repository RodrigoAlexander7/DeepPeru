import { Request } from 'express';

export interface MercadoPagoTokens {
  accessToken: string;
  refreshToken: string;
  companyId: number;
}

export interface MercadoPagoAuthRequest extends Request {
  user: MercadoPagoTokens;
}

export interface MercadoPagoUserInfo {
  id: number;
  nickname: string;
  email: string;
  first_name: string;
  last_name: string;
}
