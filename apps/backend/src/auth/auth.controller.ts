import {
  Controller,
  Res,
  Get,
  Request,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { GoogleAuthRequest } from './interfaces/google-user.interface';
import type { MercadoPagoAuthRequest } from './interfaces/mercadopago-auth.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login' })
  googleAuth() {
    return 'Google Auth';
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
  async googleAuthCallback(
    @Request() req: GoogleAuthRequest,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      const { accessToken } = await this.authService.callbackOauthGoogle(
        req.user,
      );
      res.redirect(
        `${frontendUrl}/api/auth/google/callback?token=${accessToken}`,
      );
    } catch (error: unknown) {
      console.error('Error during Google auth callback:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      res.redirect(`${frontendUrl}/auth/error?message=${message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('mercadopago/connect')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Initiate Mercado Pago OAuth flow for seller account connection',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Mercado Pago authorization',
  })
  @ApiQuery({
    name: 'companyId',
    required: true,
    type: Number,
    description: 'Company ID to connect',
  })
  mercadoPagoConnect(
    @Query('companyId') companyId: string,
    @Res() res: Response,
  ) {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }

    const clientId = this.configService.get<string>('MERCADO_PAGO_CLIENT_ID');
    const redirectUri = this.configService.get<string>(
      'MERCADO_PAGO_CALLBACK_URL',
    );

    if (!clientId || !redirectUri) {
      throw new BadRequestException('MercadoPago configuration is missing');
    }

    const state = `company_${companyId}`;

    const url =
      `https://auth.mercadopago.com.pe/authorization?` +
      `response_type=code&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}`;

    return res.redirect(url);
  }

  @UseGuards(AuthGuard('mercadopago'))
  @Get('mercadopago/callback')
  @ApiOperation({
    summary: 'Mercado Pago OAuth callback - connects seller account',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with connection status',
  })
  async mercadoPagoCallback(
    @Request() req: MercadoPagoAuthRequest,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      const { companyId } = req.user;

      if (!companyId) {
        throw new BadRequestException('companyId missing from state');
      }

      const result = await this.authService.callbackOauthMercadoPago(
        req.user,
        companyId,
      );

      res.redirect(
        `${frontendUrl}/become-operator?step=3&companyId=${companyId}&mp_status=success&mpUserId=${result.mercadoPagoUserId}`,
      );
    } catch (error: unknown) {
      console.error('Error during Mercado Pago auth callback:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      res.redirect(
        `${frontendUrl}/become-operator?step=3&mp_status=error&mp_error=${encodeURIComponent(message)}`,
      );
    }
  }
}
