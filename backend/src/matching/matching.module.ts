import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ChatModule } from '@/chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
  providers: [MatchingService],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}
