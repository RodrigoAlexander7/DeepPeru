import {
  Controller,
  Res,
  Get,
  Request,
  UseGuards,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { GoogleAuthRequest } from './interfaces/google-user.interface';
import type { MercadoPagoAuthRequest } from './interfaces/mercadopago-auth.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
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

  @UseGuards(JwtAuthGuard, AuthGuard('mercadopago'))
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
  mercadoPagoConnect(@Query('companyId') companyId: string) {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    return 'Mercado Pago Connect';
  }

  @UseGuards(JwtAuthGuard, AuthGuard('mercadopago'))
  @Get('mercadopago/callback')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mercado Pago OAuth callback - connects seller account',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with connection status',
  })
  @ApiQuery({
    name: 'companyId',
    required: true,
    type: Number,
    description: 'Company ID to connect',
  })
  async mercadoPagoCallback(
    @Request() req: MercadoPagoAuthRequest,
    @Query('companyId', ParseIntPipe) companyId: number,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      if (!companyId) {
        throw new BadRequestException('companyId is required');
      }

      const result = await this.authService.callbackOauthMercadoPago(
        req.user,
        companyId,
      );

      res.redirect(
        `${frontendUrl}/company/${companyId}/settings?mpConnected=true&mpUserId=${result.mercadoPagoUserId}`,
      );
    } catch (error: unknown) {
      console.error('Error during Mercado Pago auth callback:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      res.redirect(
        `${frontendUrl}/company/${companyId}/settings?mpError=${encodeURIComponent(message)}`,
      );
    }
  }
}
