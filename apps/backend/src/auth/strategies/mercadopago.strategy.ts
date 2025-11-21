import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MercadoPagoStrategy extends PassportStrategy(
  Strategy,
  'mercadopago',
) {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('MERCADO_PAGO_CLIENT_ID');
    const clientSecret = configService.get<string>(
      'MERCADO_PAGO_CLIENT_SECRET',
    );
    const callbackURL = configService.get<string>('MERCADO_PAGO_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Mercado Pago OAuth credentials not configured');
    }

    super({
      authorizationURL: 'https://auth.mercadopago.com.pe/authorization',
      tokenURL: 'https://api.mercadopago.com/oauth/token',
      clientID,
      clientSecret,
      callbackURL,
      scope: ['read', 'write'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return Promise.resolve({
      accessToken,
      refreshToken,
    });
  }
}
