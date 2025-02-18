import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MembersModule } from 'src/members/members.module';
import { JwtStrategy } from './strategyies/jwt.strategy';
import { JwtRefreshStrategy } from './strategyies/jwt.refresh.strategy';
import { JwtOptionalStrategy } from './strategyies/jwt.optional.strategy';
import { env } from 'src/common/configs/env';

@Module({
  imports: [
    MembersModule,
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtOptionalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
