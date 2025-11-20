import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { GoogleUser } from './interfaces/google-user.interface';
import { AuthenticatedUserJwtPayload } from './interfaces/auth-request.interface';

@Injectable()
export class AuthService {
  // dependences injection
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  //we dont use access token nor refresh tken, we create our own jwt
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
    return { accessToken: jwt }; // return an JWT object
  }
}
