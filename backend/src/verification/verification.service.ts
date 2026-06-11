import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { VerifyPhoneDto, SendPhoneCodeDto } from './dto/verify-phone.dto';
import { VerifyLivenessDto } from './dto/verify-liveness.dto';
import { VerificationType, VerificationStatus, AccountStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async sendPhoneCode(userId: string, dto: SendPhoneCodeDto): Promise<{ success: boolean }> {
    // Validar que o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Gerar código de 6 dígitos
    const code = this.generatePhoneCode();

    // Armazenar código no Redis (com expiração de 10 minutos)
    // Por enquanto, vamos apenas logar (implementar Redis depois)
    console.log(`📱 Código SMS para ${dto.phone}: ${code}`);

    // TODO: Integrar com Twilio para enviar SMS de verdade
    // await twilioClient.messages.create({
    //   body: `Seu código de verificação Sugar Dream: ${code}`,
    //   from: this.configService.get('TWILIO_PHONE_NUMBER'),
    //   to: dto.phone,
    // });

    return { success: true };
  }

  async verifyPhoneCode(userId: string, dto: VerifyPhoneDto): Promise<{ verified: boolean }> {
    // Validar que o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // TODO: Validar código contra Redis
    // Por enquanto, aceitar qualquer código de 6 dígitos
    if (!/^\d{6}$/.test(dto.code)) {
      throw new BadRequestException('Código inválido');
    }

    // Registrar verificação no banco
    await this.prisma.verification.create({
      data: {
        userId,
        type: VerificationType.PHONE,
        status: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });

    // Atualizar flag no usuário
    await this.prisma.user.update({
      where: { id: userId },
      data: { phoneVerified: true },
    });

    return { verified: true };
  }

  async verifyLiveness(
    userId: string,
    dto: VerifyLivenessDto,
  ): Promise<{
    verified: boolean;
    livenessScore: number;
    faceMatchScore: number;
    ageCheck: string;
    verifiedAt: Date;
  }> {
    // Validar que o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // TODO: Integrar com AWS Rekognition ou similar
    // await rekognitionClient.detectFaceAttributes(videoUrl);

    // Por enquanto, retornar mock
    const livenessScore = 0.95;
    const faceMatchScore = 0.96;
    const ageCheckPassed = true;
    const verified = livenessScore >= 0.90 && faceMatchScore >= 0.95 && ageCheckPassed;

    // Registrar verificação no banco
    await this.prisma.verification.create({
      data: {
        userId,
        type: VerificationType.FACE,
        status: verified ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
        metadata: {
          livenessScore,
          faceMatchScore,
          ageCheckPassed,
        },
        verifiedAt: verified ? new Date() : null,
      },
    });

    // Se verificação passou, atualizar user e travar userType
    if (verified) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          faceVerified: true,
          verifiedAt: new Date(),
        },
      });
    }

    return {
      verified,
      livenessScore,
      faceMatchScore,
      ageCheck: ageCheckPassed ? 'passed' : 'failed',
      verifiedAt: new Date(),
    };
  }

  private generatePhoneCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
