import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateReportDto, ReportTypeEnum } from './dto/create-report.dto';
import { ResolveReportDto, ModeratorActionEnum } from './dto/resolve-report.dto';
import {
  ReportType,
  ReportStatus,
  ModeratorAction,
  AccountStatus,
} from '@prisma/client';

// Mapeamento valores da API (lowercase) → enums do Prisma
const REPORT_TYPE_MAP: Record<ReportTypeEnum, ReportType> = {
  [ReportTypeEnum.ABUSIVE_BEHAVIOR]: ReportType.ABUSIVE_BEHAVIOR,
  [ReportTypeEnum.SCAM]: ReportType.SCAM,
  [ReportTypeEnum.INAPPROPRIATE_CONTENT]: ReportType.INAPPROPRIATE_CONTENT,
  [ReportTypeEnum.SEXUAL_HARASSMENT]: ReportType.SEXUAL_HARASSMENT,
  [ReportTypeEnum.EXPLOITATION]: ReportType.EXPLOITATION,
  [ReportTypeEnum.OTHER]: ReportType.OTHER,
};

const ACTION_MAP: Record<ModeratorActionEnum, ModeratorAction> = {
  [ModeratorActionEnum.DISMISS]: ModeratorAction.DISMISS,
  [ModeratorActionEnum.WARNING]: ModeratorAction.WARNING,
  [ModeratorActionEnum.SUSPEND_24H]: ModeratorAction.SUSPEND_24H,
  [ModeratorActionEnum.SUSPEND_7D]: ModeratorAction.SUSPEND_7D,
  [ModeratorActionEnum.SUSPEND_30D]: ModeratorAction.SUSPEND_30D,
  [ModeratorActionEnum.BAN_PERMANENT]: ModeratorAction.BAN_PERMANENT,
};

// Tipos de denúncia que sempre recebem urgência alta (segurança/exploração)
const HIGH_URGENCY_TYPES = new Set<ReportTypeEnum>([
  ReportTypeEnum.SEXUAL_HARASSMENT,
  ReportTypeEnum.EXPLOITATION,
]);

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async createReport(reporterId: string, dto: CreateReportDto) {
    if (reporterId === dto.reportedUserId) {
      throw new BadRequestException('Você não pode denunciar a si mesmo');
    }

    // Verifica se o usuário denunciado existe
    const reported = await this.prisma.user.findUnique({
      where: { id: dto.reportedUserId },
      include: { questionnaire: true },
    });

    if (!reported) {
      throw new NotFoundException('Usuário denunciado não encontrado');
    }

    // Calcula urgência: tipo da denúncia + risk flags do questionário do denunciado
    const urgency = this.calculateUrgency(dto.type, reported.questionnaire?.riskFlags || []);

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: dto.reportedUserId,
        type: REPORT_TYPE_MAP[dto.type],
        description: dto.description,
        evidence: dto.evidence ? (dto.evidence as any) : undefined,
        status: ReportStatus.PENDING,
        urgency,
      },
    });

    return {
      reportId: report.id,
      status: report.status,
      urgency: report.urgency,
      message: 'Denúncia registrada. Nossa equipe de moderação irá analisar.',
    };
  }

  /**
   * Urgência considera o tipo de denúncia e as red flags comportamentais do
   * usuário denunciado. Denúncias de assédio/exploração são sempre alta;
   * red flags de segurança elevam a urgência.
   */
  private calculateUrgency(type: ReportTypeEnum, riskFlags: string[]): string {
    if (HIGH_URGENCY_TYPES.has(type)) {
      return 'high';
    }

    const hasSafetyFlag = riskFlags.some(
      (flag) =>
        flag === 'red_flag_safety_concern' ||
        flag === 'poor_emotional_safety' ||
        flag === 'red_flag_control',
    );

    if (hasSafetyFlag) {
      return 'high';
    }

    if (type === ReportTypeEnum.ABUSIVE_BEHAVIOR || type === ReportTypeEnum.SCAM) {
      return 'medium';
    }

    // Denúncia comum sem red flags
    return riskFlags.length > 0 ? 'medium' : 'low';
  }

  /**
   * Lista as denúncias submetidas pelo próprio usuário.
   */
  async getMyReports(reporterId: string) {
    const reports = await this.prisma.report.findMany({
      where: { reporterId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        status: true,
        urgency: true,
        createdAt: true,
        resolvedAt: true,
        actionTaken: true,
      },
    });

    return reports;
  }

  /**
   * Fila de moderação — ordenada por urgência e depois por data.
   * Apenas moderadores acessam (via ModeratorGuard).
   */
  async getModerationQueue(status?: ReportStatus) {
    const reports = await this.prisma.report.findMany({
      where: status ? { status } : { status: { in: [ReportStatus.PENDING, ReportStatus.INVESTIGATING] } },
      include: {
        reporter: { select: { id: true, firstName: true, email: true } },
        reported: {
          select: {
            id: true,
            firstName: true,
            email: true,
            status: true,
            questionnaire: { select: { riskFlags: true, overallScore: true } },
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    // Ordena por urgência (high > medium > low), mantendo FIFO dentro do mesmo nível
    const urgencyWeight: Record<string, number> = { high: 0, medium: 1, low: 2 };
    reports.sort(
      (a, b) => (urgencyWeight[a.urgency] ?? 3) - (urgencyWeight[b.urgency] ?? 3),
    );

    return {
      total: reports.length,
      reports,
    };
  }

  /**
   * Detalhe de uma denúncia para análise do moderador.
   */
  async getReportDetail(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: { select: { id: true, firstName: true, email: true } },
        reported: {
          select: {
            id: true,
            firstName: true,
            email: true,
            status: true,
            createdAt: true,
            questionnaire: {
              select: { riskFlags: true, overallScore: true, dimensionScores: true },
            },
          },
        },
        moderator: { select: { id: true, firstName: true } },
      },
    });

    if (!report) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    // Conta quantas denúncias o usuário denunciado já recebeu (histórico)
    const totalReportsAgainst = await this.prisma.report.count({
      where: { reportedUserId: report.reportedUserId },
    });

    return {
      ...report,
      reportedUserHistory: {
        totalReportsAgainst,
      },
    };
  }

  /**
   * Resolve uma denúncia aplicando a ação do moderador.
   * Suspensões atualizam status e suspendedUntil do usuário denunciado.
   */
  async resolveReport(moderatorId: string, reportId: string, dto: ResolveReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    if (report.status === ReportStatus.RESOLVED || report.status === ReportStatus.DISMISSED) {
      throw new BadRequestException('Denúncia já foi resolvida');
    }

    const action = ACTION_MAP[dto.action];
    const isDismissal = dto.action === ModeratorActionEnum.DISMISS;

    // Aplica a ação ao usuário denunciado (exceto DISMISS)
    if (!isDismissal) {
      await this.applyActionToUser(report.reportedUserId, dto.action);
    }

    // Atualiza a denúncia
    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: isDismissal ? ReportStatus.DISMISSED : ReportStatus.RESOLVED,
        actionTaken: action,
        moderatorNotes: dto.moderatorNotes,
        moderatorId,
        resolvedAt: new Date(),
      },
    });

    return {
      reportId: updated.id,
      status: updated.status,
      actionTaken: updated.actionTaken,
      message: isDismissal
        ? 'Denúncia arquivada sem ação'
        : `Ação "${dto.action}" aplicada ao usuário`,
    };
  }

  /**
   * Aplica a consequência ao usuário denunciado conforme a ação do moderador.
   */
  private async applyActionToUser(userId: string, action: ModeratorActionEnum) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    switch (action) {
      case ModeratorActionEnum.WARNING:
        // Advertência: nenhuma mudança de status, apenas notificação
        await this.createNotification(
          userId,
          'Advertência da moderação',
          'Você recebeu uma advertência. Reincidências podem levar à suspensão.',
        );
        break;

      case ModeratorActionEnum.SUSPEND_24H:
        await this.suspendUser(userId, new Date(now + day));
        break;

      case ModeratorActionEnum.SUSPEND_7D:
        await this.suspendUser(userId, new Date(now + 7 * day));
        break;

      case ModeratorActionEnum.SUSPEND_30D:
        await this.suspendUser(userId, new Date(now + 30 * day));
        break;

      case ModeratorActionEnum.BAN_PERMANENT:
        await this.prisma.user.update({
          where: { id: userId },
          data: { status: AccountStatus.BANNED, suspendedUntil: null },
        });
        await this.createNotification(
          userId,
          'Conta banida',
          'Sua conta foi banida permanentemente por violação dos termos de uso.',
        );
        break;
    }
  }

  private async suspendUser(userId: string, until: Date) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: AccountStatus.SUSPENDED, suspendedUntil: until },
    });
    await this.createNotification(
      userId,
      'Conta suspensa',
      `Sua conta foi suspensa até ${until.toLocaleDateString('pt-BR')} por violação dos termos.`,
    );
  }

  private async createNotification(userId: string, title: string, body: string) {
    await this.prisma.notification.create({
      data: {
        userId,
        type: 'moderation',
        title,
        body,
      },
    });
  }
}
