import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MembersRepository } from './members.repository';
import { CommonModule } from 'src/common/common.module';
@Module({
  imports: [CommonModule],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository],
  exports: [MembersService],
})
export class MembersModule {}
