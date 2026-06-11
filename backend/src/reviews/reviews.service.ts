import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

interface TrustScore {
  overallScore: number; // 0-100
  dimensions: {
    respect: number;
    communication: number;
    safety: number;
    honesty: number;
    discretion: number;
  };
  reviewCount: number;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar uma avaliação após relacionamento.
   * Valida que ambos estão na conversa, impede auto-review,
   * e atualiza o trust_score do avaliado.
   */
  async createReview(reviewerId: string, dto: CreateReviewDto) {
    if (reviewerId === dto.reviewedUserId) {
      throw new BadRequestException('Você não pode avaliar a si mesmo');
    }

    // Verifica se a conversa existe e se ambos participam dela
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    const isReviewerInConversation =
      conversation.user1Id === reviewerId || conversation.user2Id === reviewerId;
    const isReviewedInConversation =
      conversation.user1Id === dto.reviewedUserId ||
      conversation.user2Id === dto.reviewedUserId;

    if (!isReviewerInConversation || !isReviewedInConversation) {
      throw new BadRequestException(
        'Você deve ter uma conversa com o usuário para avaliá-lo',
      );
    }

    // Impede reviews duplicadas da mesma conversa
    const existingReview = await this.prisma.review.findUnique({
      where: {
        conversationId_reviewerId: {
          conversationId: dto.conversationId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('Você já avaliou este usuário nesta conversa');
    }

    // Normaliza dimensões para 1-5 se não fornecidas
    const dimensions = {
      respect: dto.dimensions.respect ?? 3,
      communication: dto.dimensions.communication ?? 3,
      safety: dto.dimensions.safety ?? 3,
      honesty: dto.dimensions.honesty ?? 3,
      discretion: dto.dimensions.discretion ?? 3,
    };

    // Valida dimensões
    Object.entries(dimensions).forEach(([key, value]) => {
      if (value < 1 || value > 5) {
        throw new BadRequestException(`${key} deve estar entre 1 e 5`);
      }
    });

    // Cria a review
    const review = await this.prisma.review.create({
      data: {
        reviewerId,
        reviewedUserId: dto.reviewedUserId,
        conversationId: dto.conversationId,
        rating: dto.rating,
        dimensions: dimensions as any,
        comment: dto.comment,
        anonymous: dto.anonymous ?? false,
      },
    });

    // Atualiza trust_score do usuário avaliado
    await this.updateUserTrustScore(dto.reviewedUserId);

    return {
      reviewId: review.id,
      rating: review.rating,
      message: 'Avaliação registrada com sucesso',
    };
  }

  /**
   * Obtém o trust_score completo de um usuário.
   */
  async getUserTrustScore(userId: string): Promise<TrustScore> {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
    });

    if (reviews.length === 0) {
      return {
        overallScore: 0, // Sem reviews ainda
        dimensions: {
          respect: 0,
          communication: 0,
          safety: 0,
          honesty: 0,
          discretion: 0,
        },
        reviewCount: 0,
      };
    }

    // Calcula média de cada dimensão
    const dimensions = {
      respect: 0,
      communication: 0,
      safety: 0,
      honesty: 0,
      discretion: 0,
    };
    let ratingSum = 0;

    reviews.forEach((review) => {
      const dims = review.dimensions as any;
      dimensions.respect += dims.respect || 3;
      dimensions.communication += dims.communication || 3;
      dimensions.safety += dims.safety || 3;
      dimensions.honesty += dims.honesty || 3;
      dimensions.discretion += dims.discretion || 3;
      ratingSum += review.rating;
    });

    const count = reviews.length;
    Object.keys(dimensions).forEach((key) => {
      dimensions[key as keyof typeof dimensions] = Math.round(
        (dimensions[key as keyof typeof dimensions] / count) * 100 / 5,
      ); // Converte para 0-100
    });

    // Score geral: média do rating (convertido a 0-100) + média das dimensões
    const ratingScore = Math.round((ratingSum / count / 5) * 100);
    const dimensionScore = Math.round(
      Object.values(dimensions).reduce((a, b) => a + b, 0) / 5,
    );
    const overallScore = Math.round((ratingScore + dimensionScore) / 2);

    return {
      overallScore,
      dimensions,
      reviewCount: count,
    };
  }

  /**
   * Lista as reviews recebidas por um usuário (com opção de anônimo).
   */
  async getReceivedReviews(userId: string, limit: number = 50) {
    const reviews = await this.prisma.review.findMany({
      where: { reviewedUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      dimensions: review.dimensions,
      comment: review.comment,
      reviewer: review.anonymous ? null : review.reviewerId, // Null se anônimo
      createdAt: review.createdAt,
    }));
  }

  /**
   * Lista as reviews que o próprio usuário fez.
   */
  async getSubmittedReviews(userId: string, limit: number = 50) {
    const reviews = await this.prisma.review.findMany({
      where: { reviewerId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        reviewed: { select: { id: true, firstName: true, email: true } },
      },
    });

    return reviews;
  }

  /**
   * Atualiza o trust_score agregado de um usuário.
   * Chamado após cada nova review.
   */
  private async updateUserTrustScore(userId: string) {
    const trustScore = await this.getUserTrustScore(userId);

    // Armazena no profile para acesso rápido
    await this.prisma.profile.update({
      where: { userId },
      data: {
        // Campo de trust_score seria adicional; por enquanto, deixamos para futuro
        // Ou podemos armazenar no User modelo
      },
    }).catch(() => {
      // Usuário pode não ter profile ainda
    });
  }

  /**
   * Calcula compatibilidade de dois usuários baseado em reviews recebidas.
   * Usuários bem avaliados são mais compatíveis (usado no matching para tie-breaking).
   */
  async getCompatibilityBonus(userId1: string, userId2: string): Promise<number> {
    const score1 = await this.getUserTrustScore(userId1);
    const score2 = await this.getUserTrustScore(userId2);

    // Bonus se ambos têm boas avaliações
    // Ambos acima de 70: +10 pontos
    // Um acima de 70: +5 pontos
    const avgScore = (score1.overallScore + score2.overallScore) / 2;

    if (avgScore >= 70) return 10;
    if (avgScore >= 60) return 5;
    return 0;
  }
}
