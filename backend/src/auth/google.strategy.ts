import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '@/auth/auth.service';
import { Profile } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
   constructor(
      private readonly authService: AuthService,   // inject the service (AuthService) as dependencie
   ) {
      super({
         clientID: process.env.AUTH_GOOGLE_ID,
         clientSecret: process.env.AUTH_GOOGLE_SECRET,
         callbackURL: process.env.GOOGLE_CALLBACK_URL,
         scope: ["email", "profile"]   // the user's data that we want from Google
      })
   }
   async validate(accessToken: string, refreshToken: string, profile: Profile) {
      // Profile object contains so much (and unnecesary) information so just incluthe that we want
      const { id, displayName, emails, photos } = profile;

      return this.authService.callbackOauthGoogle({
         name: displayName,
         email: emails?.[0]?.value,
         image: photos?.[0]?.value,
         accessToken,
         refreshToken
      })

   }
}