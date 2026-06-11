import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

/**
 * SubscriptionGuard — bloqueia acesso ao chat/matching sem assinatura ativa.
 * O chat é o núcleo do produto e fica atrás do paywall.
 */
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new ForbiddenException('Não autenticado');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.sub },
    });

    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new ForbiddenException(
        'Assinatura ativa necessária para acessar o chat. Renove sua assinatura.',
      );
    }

    return true;
  }
}
