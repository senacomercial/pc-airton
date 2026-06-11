import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserRole } from '@prisma/client';

/**
 * ModeratorGuard — restringe rotas administrativas a moderadores e admins.
 * Usado na fila de moderação e na resolução de denúncias.
 */
@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new ForbiddenException('Não autenticado');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { role: true },
    });

    if (
      !dbUser ||
      (dbUser.role !== UserRole.MODERATOR && dbUser.role !== UserRole.ADMIN)
    ) {
      throw new ForbiddenException(
        'Acesso restrito a moderadores',
      );
    }

    return true;
  }
}
