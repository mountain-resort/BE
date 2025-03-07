import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { AdminsRepository } from './admins.repository';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [CommonModule, AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService, AdminsRepository],
})
export class AdminsModule {}
