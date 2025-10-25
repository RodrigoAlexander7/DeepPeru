import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '@/auth/auth.service';
import { Profile } from "passport-google-oauth20";
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<{
        name: string;
        email: string | undefined;
        image: string | undefined;
        accessToken: string;
        refreshToken: string;
    }>;
}
export {};
