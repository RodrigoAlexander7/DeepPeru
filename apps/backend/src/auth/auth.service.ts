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
    const { accessToken } = tokens;

    const userInfo = await this.fetchMercadoPagoUserInfo(accessToken);

    await this.prisma.tourismCompany.update({
      where: { id: companyId },
      data: {
        mercadoPagoAccountId: userInfo.id.toString(),
      },
    });

    return {
      success: true,
      mercadoPagoUserId: userInfo.id,
      companyId,
    };
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
    // Validación mínima (soft runtime check)
    if (typeof data !== 'object' || data === null || !('id' in data)) {
      throw new Error('Invalid Mercado Pago user info format');
    }
    return data as MercadoPagoUserInfo;
  }
}
