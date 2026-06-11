import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { VerificationModule } from './verification/verification.module';
import { ChatModule } from './chat/chat.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { MatchingModule } from './matching/matching.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PaymentsModule,
    VerificationModule,
    ChatModule,
    QuestionnaireModule,
    MatchingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
