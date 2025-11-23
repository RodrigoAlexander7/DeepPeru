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
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request & { query: { state?: string } },
    accessToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; companyId: number }> {
    const state = req.query.state;

    if (!state || !state.startsWith('company_')) {
      throw new Error('Invalid state parameter');
    }

    const companyId = parseInt(state.replace('company_', ''), 10);

    if (isNaN(companyId)) {
      throw new Error('Invalid companyId in state');
    }

    return {
      accessToken,
      refreshToken,
      companyId,
    };
  }
}
