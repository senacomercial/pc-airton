import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { LiveStatus } from '@prisma/client';

@Injectable()
export class LivesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova live (apenas admins/hosts).
   */
  async createLive(hostId: string, dto: CreateLiveDto) {
    const startTime = new Date(dto.startTime);
    if (startTime <= new Date()) {
      throw new BadRequestException('Data de início deve ser no futuro');
    }

    const live = await this.prisma.live.create({
      data: {
        title: dto.title,
        description: dto.description,
        startTime,
        durationMin: dto.durationMin,
        meetUrl: dto.meetUrl,
        hostId,
        status: LiveStatus.SCHEDULED,
      },
    });

    return {
      liveId: live.id,
      title: live.title,
      startTime: live.startTime,
      status: live.status,
    };
  }

  /**
   * Lista lives próximas (SCHEDULED) e em andamento (LIVE).
   */
  async getUpcomingLives(limit: number = 50) {
    const now = new Date();

    const lives = await this.prisma.live.findMany({
      where: {
        status: { in: [LiveStatus.SCHEDULED, LiveStatus.LIVE] },
        startTime: { gte: new Date(now.getTime() - 60 * 60 * 1000) }, // Últimas 1h
      },
      orderBy: { startTime: 'asc' },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        durationMin: true,
        status: true,
        _count: { select: { registrations: true } },
      },
    });

    return lives.map((live) => ({
      ...live,
      participantCount: live._count.registrations,
    }));
  }

  /**
   * Detalhe de uma live com link do Meet se está ao vivo ou foi realizada.
   */
  async getLiveDetail(liveId: string) {
    const live = await this.prisma.live.findUnique({
      where: { id: liveId },
      include: {
        registrations: {
          select: {
            userId: true,
            registeredAt: true,
            attended: true,
          },
        },
      },
    });

    if (!live) {
      throw new NotFoundException('Live não encontrada');
    }

    return {
      id: live.id,
      title: live.title,
      description: live.description,
      startTime: live.startTime,
      durationMin: live.durationMin,
      status: live.status,
      meetUrl: live.meetUrl, // Sempre expõe o link
      participantCount: live.registrations.length,
      participants: live.registrations.map((r) => ({
        userId: r.userId,
        registeredAt: r.registeredAt,
        attended: r.attended,
      })),
    };
  }

  /**
   * Usuário se registra em uma live.
   */
  async registerForLive(userId: string, liveId: string) {
    const live = await this.prisma.live.findUnique({
      where: { id: liveId },
    });

    if (!live) {
      throw new NotFoundException('Live não encontrada');
    }

    if (live.status === LiveStatus.COMPLETED) {
      throw new BadRequestException('Esta live já foi concluída');
    }

    const existing = await this.prisma.liveRegistration.findUnique({
      where: { liveId_userId: { liveId, userId } },
    });

    if (existing) {
      return {
        message: 'Você já está registrado nesta live',
        registered: true,
      };
    }

    await this.prisma.liveRegistration.create({
      data: { liveId, userId },
    });

    return {
      message: 'Registrado com sucesso. Você receberá notificação quando começar.',
      registered: true,
    };
  }

  /**
   * Marca presença: usuário assistiu a live.
   */
  async markAttended(userId: string, liveId: string) {
    const registration = await this.prisma.liveRegistration.findUnique({
      where: { liveId_userId: { liveId, userId } },
    });

    if (!registration) {
      throw new BadRequestException(
        'Você não está registrado nesta live',
      );
    }

    const updated = await this.prisma.liveRegistration.update({
      where: { liveId_userId: { liveId, userId } },
      data: { attended: true },
    });

    return {
      message: 'Presença marcada',
      attended: updated.attended,
    };
  }

  /**
   * Lista minhas registros em lives.
   */
  async getMyLiveRegistrations(userId: string) {
    const registrations = await this.prisma.liveRegistration.findMany({
      where: { userId },
      include: {
        live: {
          select: {
            id: true,
            title: true,
            startTime: true,
            status: true,
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });

    return registrations.map((reg) => ({
      liveId: reg.live.id,
      title: reg.live.title,
      startTime: reg.live.startTime,
      status: reg.live.status,
      registeredAt: reg.registeredAt,
      attended: reg.attended,
    }));
  }

  /**
   * Atualiza o status de uma live (LIVE, COMPLETED).
   * Apenas host/admin pode fazer isso.
   */
  async updateLiveStatus(hostId: string, liveId: string, newStatus: LiveStatus) {
    const live = await this.prisma.live.findUnique({
      where: { id: liveId },
    });

    if (!live) {
      throw new NotFoundException('Live não encontrada');
    }

    if (live.hostId !== hostId) {
      throw new BadRequestException('Você não é o host desta live');
    }

    // Validar transição de status
    const validTransitions: Record<LiveStatus, LiveStatus[]> = {
      [LiveStatus.SCHEDULED]: [LiveStatus.LIVE, LiveStatus.COMPLETED],
      [LiveStatus.LIVE]: [LiveStatus.COMPLETED],
      [LiveStatus.COMPLETED]: [],
    };

    if (!validTransitions[live.status].includes(newStatus)) {
      throw new BadRequestException(
        `Não é possível mudar de ${live.status} para ${newStatus}`,
      );
    }

    const updated = await this.prisma.live.update({
      where: { id: liveId },
      data: { status: newStatus },
    });

    return {
      liveId: updated.id,
      status: updated.status,
      message: `Live mudou para status ${newStatus}`,
    };
  }
}
