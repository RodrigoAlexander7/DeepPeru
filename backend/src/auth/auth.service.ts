import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';



@Injectable()
export class AuthService {
   // dependences injection
   constructor(
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService
   ) { }

   async callbackOauthGoogle({ name, email, image, accessToken, refreshToken, }) {
      if (!email) throw new UnauthorizedException('Email not found from Google');

      let user = await this.usersService.findByEmail(email);

      if (!user) {
         user = await this.usersService.create({
            name,
            email,
            image,
         });
      }
   }
}
