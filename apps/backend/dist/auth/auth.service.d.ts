import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    callbackOauthGoogle({ name, email, image, accessToken, refreshToken, }: {
        name: any;
        email: any;
        image: any;
        accessToken: any;
        refreshToken: any;
    }): Promise<{
        accessToken: string;
        name: string | null;
        id: string;
        image: string | null;
    }>;
}
