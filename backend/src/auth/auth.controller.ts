import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

import { AuthGuard } from '@nestjs/passport';

@Controller('auth')  // all the routes under 'auth'
export class AuthController {
   constructor(private readonly authService: AuthService) { }

   @UseGuards(AuthGuard('google'))
   @Get('google')
   async googleAuth() {
      return 'Google Auth'
   }


   @UseGuards(AuthGuard('google'))
   @Get('google/callback')
   async googleAuthCallback(@Request() req) {
      return this.authService.callbackOauthGoogle(req.user)
   }





}
