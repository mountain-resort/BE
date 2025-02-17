import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { FaqModule } from './faq/faq.module';
import { MembersModule } from './members/members.module';
import { JwtStrategy } from './common/strategyies/jwt.strategy';
@Module({
  imports: [CommonModule, FaqModule, MembersModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
