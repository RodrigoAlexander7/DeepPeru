import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '@/auth/auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//    constructor(
//       private readonly authService: AuthService
//    )
// }