import { PrismaService } from '@/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create({ name, email, image, }: {
        name: any;
        email: any;
        image: any;
    }): Promise<{
        name: string | null;
        email: string | null;
        image: string | null;
        id: string;
    }>;
    findByEmail(email: string): Promise<{
        name: string | null;
        email: string | null;
        image: string | null;
        id: string;
    } | null>;
}
