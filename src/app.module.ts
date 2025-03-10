import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { FaqModule } from './faq/faq.module';
import { MembersModule } from './members/members.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ConfigModule } from '@nestjs/config';
import { ActivitiesModule } from './activities/activities.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DiningModule } from './dining/dining.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    FaqModule,
    MembersModule,
    AuthModule,
    AdminsModule,
    ActivitiesModule,
    ReviewsModule,
    DiningModule,
    AnnouncementsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
