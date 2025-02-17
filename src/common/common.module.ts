import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { PrismaService } from './prismaClient';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from './configs/env';
import { JwtStrategy } from './strategyies/jwt.strategy';
import { JwtRefreshStrategy } from './strategyies/jwt.refresh';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService, PrismaService, JwtStrategy],
  exports: [PrismaService, JwtModule],
})
export class CommonModule {}
