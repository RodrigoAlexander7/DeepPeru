import { AuthService } from '@/auth/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(): Promise<string>;
    googleAuthCallback(req: any): Promise<{
        accessToken: string;
        name: string | null;
        id: string;
        image: string | null;
    }>;
}
