import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSubscriptionDto, PlanTypeEnum } from './dto/create-subscription.dto';
import { ConfigService } from '@nestjs/config';
import { SubscriptionStatus, UserType } from '@prisma/client';

interface MercadoPagoPreapproval {
  id: string;
  init_point: string;
  status: string;
}

const PLAN_CONFIG: Record<PlanTypeEnum, { amount: number; description: string }> = {
  [PlanTypeEnum.BABY]: {
    amount: 19.90,
    description: 'Sugar Dream — Assinatura Mensal (Baby)',
  },
  [PlanTypeEnum.DADDY_MOMMY]: {
    amount: 99.90,
    description: 'Sugar Dream — Assinatura Mensal (Daddy/Mommy)',
  },
};

@Injectable()
export class PaymentsService {
  private mpAccessToken: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.mpAccessToken = this.configService.get('MERCADOPAGO_ACCESS_TOKEN') || '';
  }

  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    // Recuperar usuário
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Validar que o tipo de plano corresponde ao userType
    const isValidPlan = this.validatePlanForUserType(user.userType, dto.planType);
    if (!isValidPlan) {
      throw new BadRequestException(
        'Plano não compatível com o tipo de usuário',
      );
    }

    // Verificar se usuário já tem subscription
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription && existingSubscription.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Usuário já possui uma assinatura ativa');
    }

    // Aqui iria a integração real com Mercado Pago
    // Por agora, vamos gerar um mock
    const mockCheckoutUrl = this.generateMockCheckoutUrl(userId, dto.planType);

    // Criar ou atualizar subscription no banco
    const subscription = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        planType: dto.planType,
        status: SubscriptionStatus.ACTIVE,
      },
      update: {
        planType: dto.planType,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    return {
      checkoutUrl: mockCheckoutUrl,
      subscriptionId: subscription.id,
      planType: dto.planType,
      planPrice: PLAN_CONFIG[dto.planType].amount,
      currency: 'BRL',
      status: 'pending_payment',
    };
  }

  async processWebhook(payload: any) {
    // TODO: Implementar webhook do Mercado Pago
    // Por agora, apenas log
    console.log('Webhook recebido:', payload);

    return {
      status: 'received',
    };
  }

  private validatePlanForUserType(userType: UserType, planType: PlanTypeEnum): boolean {
    if (userType === UserType.SUGAR_BABY) {
      return planType === PlanTypeEnum.BABY;
    } else if (userType === UserType.SUGAR_DADDY || userType === UserType.SUGAR_MOMMY) {
      return planType === PlanTypeEnum.DADDY_MOMMY;
    }
    return false;
  }

  private generateMockCheckoutUrl(userId: string, planType: PlanTypeEnum): string {
    // Mock URL — em produção seria do Mercado Pago
    return `https://www.mercadopago.com/br/checkout/v1/${userId}?plan=${planType}`;
  }
}
