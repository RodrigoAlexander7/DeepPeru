import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { GoogleUser } from './interfaces/google-user.interface';
import { AuthenticatedUserJwtPayload } from './interfaces/auth-request.interface';
import {
  MercadoPagoTokens,
  MercadoPagoUserInfo,
} from './interfaces/mercadopago-auth.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    readonly configService: ConfigService,
  ) {}

  async callbackOauthGoogle(googleUser: GoogleUser) {
    const { name, email, image } = googleUser;
    console.log('EMAIL RECIBIDO:', email);
    if (!email) throw new UnauthorizedException('Email not found from Google');

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        name,
        email,
        image,
      });
    }

    const payload: AuthenticatedUserJwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const jwt = this.jwtService.sign(payload);
    console.log('JWT GENERATED:', jwt);
    return { accessToken: jwt };
  }

  async callbackOauthMercadoPago(tokens: MercadoPagoTokens, companyId: number) {
    const { accessToken, refreshToken } = tokens;

    const userInfo = await this.fetchMercadoPagoUserInfo(accessToken);
    const credentials = await this.fetchMercadoPagoCredentials(accessToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    await this.prisma.tourismCompany.update({
      where: { id: companyId },
      data: {
        mercadoPagoAccountId: userInfo.id.toString(),
        mercadoPagoAccessToken: accessToken,
        mercadoPagoRefreshToken: refreshToken,
        mercadoPagoTokenExpiresAt: expiresAt,
        mercadoPagoPublicKey: credentials.public_key,
      },
    });

    return {
      success: true,
      mercadoPagoUserId: userInfo.id,
      companyId,
    };
  }

  async refreshMercadoPagoToken(companyId: number): Promise<string> {
    const company = await this.prisma.tourismCompany.findUnique({
      where: { id: companyId },
      select: {
        mercadoPagoRefreshToken: true,
        mercadoPagoAccessToken: true,
        mercadoPagoTokenExpiresAt: true,
      },
    });

    if (!company?.mercadoPagoRefreshToken) {
      throw new UnauthorizedException(
        'Company has no MercadoPago refresh token',
      );
    }

    if (
      company.mercadoPagoTokenExpiresAt &&
      company.mercadoPagoTokenExpiresAt > new Date()
    ) {
      return company.mercadoPagoAccessToken || '';
    }

    const clientId = this.configService.get<string>('MERCADO_PAGO_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'MERCADO_PAGO_CLIENT_SECRET',
    );

    if (!clientId || !clientSecret) {
      throw new Error('MercadoPago credentials not configured');
    }

    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: company.mercadoPagoRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to refresh MercadoPago token');
    }

    const data = (await response.json()) as {
      access_token: string;
      refresh_token: string;
    };

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    await this.prisma.tourismCompany.update({
      where: { id: companyId },
      data: {
        mercadoPagoAccessToken: data.access_token,
        mercadoPagoRefreshToken: data.refresh_token,
        mercadoPagoTokenExpiresAt: expiresAt,
      },
    });

    return data.access_token;
  }

  private async fetchMercadoPagoUserInfo(
    accessToken: string,
  ): Promise<MercadoPagoUserInfo> {
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok)
      throw new UnauthorizedException('Failed to fetch Mercado Pago user info');

    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || !('id' in data)) {
      throw new Error('Invalid Mercado Pago user info format');
    }
    return data as MercadoPagoUserInfo;
  }

  private async fetchMercadoPagoCredentials(
    accessToken: string,
  ): Promise<{ public_key: string }> {
    const response = await fetch(
      'https://api.mercadopago.com/users/me/mercadopago_account/credentials',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new UnauthorizedException(
        'Failed to fetch Mercado Pago credentials',
      );
    }

    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || !('public_key' in data)) {
      throw new Error('Invalid Mercado Pago credentials format');
    }
    return data as { public_key: string };
  }
}
