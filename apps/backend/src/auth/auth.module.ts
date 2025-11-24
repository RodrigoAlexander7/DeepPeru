import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { MercadoPagoStrategy } from './strategies/mercadopago.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  providers: [AuthService, GoogleStrategy, MercadoPagoStrategy, JwtStrategy],
  imports: [UsersModule, PrismaModule],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
