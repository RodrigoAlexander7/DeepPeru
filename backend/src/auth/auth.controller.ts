import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

import { AuthGuard } from '@nestjs/passport';

@Controller('auth')  // all the routes under 'auth'
export class AuthController {
   constructor(private readonly authService: AuthService) { }

   // Call auth/google and then redirect to the google strategy (defined on google.Strategy)
   // then the user is redirected to google login -> then is login we call the callback (defined on google.Strategy)
   @UseGuards(AuthGuard('google'))
   @Get('google')
   async googleAuth() {
      return 'Google Auth'
   }

   // Passport change the auth code with a token 
   // So we call auth/google/callback and then call -> callbackOauthGoogle
   @UseGuards(AuthGuard('google'))
   @Get('google/callback')
   async googleAuthCallback(@Request() req) {
      return this.authService.callbackOauthGoogle(req.user)
   }
}
