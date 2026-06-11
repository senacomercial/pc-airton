import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SubmitQuestionnaireDto, QuestionAnswerDto } from './dto/submit-questionnaire.dto';
import {
  getQuestionsForUserType,
  getQuestionById,
  RISK_FLAGS,
} from './questionnaire-definitions';
import { UserType } from '@prisma/client';

export interface DimensionScores {
  emotional_maturity: number;
  respect_autonomy: number;
  clear_expectations: number;
  emotional_safety: number;
  self_sufficiency: number;
}

export interface ScoringResult {
  overallScore: number;
  dimensionScores: DimensionScores;
  riskFlags: string[];
}

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  async submitAnswers(userId: string, dto: SubmitQuestionnaireDto): Promise<ScoringResult> {
    // Get user to access userType
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Get valid questions for this user type
    const validQuestions = getQuestionsForUserType(user.userType);

    if (validQuestions.length === 0) {
      throw new BadRequestException('Tipo de usuário inválido para questionário');
    }

    // Validate that we have all 30 answers
    if (dto.answers.length !== 30) {
      throw new BadRequestException(`Questionário deve ter exatamente 30 respostas, recebido ${dto.answers.length}`);
    }

    // Map answers by questionId for quick lookup
    const answerMap = new Map<string, number>();
    dto.answers.forEach((answer) => {
      answerMap.set(answer.questionId, answer.answer);
    });

    // Validate all answers are for valid questions
    for (const [questionId, answer] of answerMap) {
      const question = getQuestionById(user.userType, questionId);
      if (!question) {
        throw new BadRequestException(`Pergunta inválida: ${questionId}`);
      }
      if (answer < 1 || answer > 5) {
        throw new BadRequestException(`Resposta deve estar entre 1 e 5: ${answer}`);
      }
    }

    // Calculate dimension scores
    const dimensionScores = this.calculateDimensionScores(validQuestions, answerMap);
    const overallScore = this.calculateOverallScore(dimensionScores);
    const riskFlags = this.detectRiskFlags(validQuestions, dimensionScores, answerMap);

    // Store questionnaire answers
    const questionnaire = await this.prisma.behaviorQuestionnaire.create({
      data: {
        userId,
        answers: dto.answers as any, // store as-is
        overallScore,
        dimensionScores: dimensionScores as any,
        riskFlags,
        version: 1,
        reassessAfter: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    });

    return {
      overallScore: questionnaire.overallScore!,
      dimensionScores: questionnaire.dimensionScores as unknown as DimensionScores,
      riskFlags: questionnaire.riskFlags,
    };
  }

  async getQuestionnaire(userId: string) {
    const questionnaire = await this.prisma.behaviorQuestionnaire.findUnique({
      where: { userId },
    });

    if (!questionnaire) {
      return null;
    }

    return {
      userId: questionnaire.userId,
      version: questionnaire.version,
      overallScore: questionnaire.overallScore,
      dimensionScores: questionnaire.dimensionScores,
      riskFlags: questionnaire.riskFlags,
      createdAt: questionnaire.createdAt,
      reassessAfter: questionnaire.reassessAfter,
    };
  }

  private calculateDimensionScores(
    questions: any[],
    answerMap: Map<string, number>,
  ): DimensionScores {
    const dimensions: DimensionScores = {
      emotional_maturity: 0,
      respect_autonomy: 0,
      clear_expectations: 0,
      emotional_safety: 0,
      self_sufficiency: 0,
    };

    const dimensionCounts = {
      emotional_maturity: 0,
      respect_autonomy: 0,
      clear_expectations: 0,
      emotional_safety: 0,
      self_sufficiency: 0,
    };

    questions.forEach((question) => {
      const rawAnswer = answerMap.get(question.id) || 3; // default to neutral if missing
      const answer = question.reversed ? (6 - rawAnswer) : rawAnswer; // reverse if needed

      const dimension = question.dimension as keyof DimensionScores;
      dimensions[dimension] += answer;
      dimensionCounts[dimension]++;
    });

    // Convert sums to averages (0-100 scale)
    Object.keys(dimensions).forEach((key) => {
      const dim = key as keyof DimensionScores;
      if (dimensionCounts[dim] > 0) {
        dimensions[dim] = Math.round((dimensions[dim] / dimensionCounts[dim] / 5) * 100);
      }
    });

    return dimensions;
  }

  private calculateOverallScore(dimensionScores: DimensionScores): number {
    const scores = Object.values(dimensionScores);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(average);
  }

  private detectRiskFlags(
    questions: any[],
    dimensionScores: DimensionScores,
    answerMap: Map<string, number>,
  ): string[] {
    const flags: string[] = [];

    // Flag low dimensions (below 40)
    if (dimensionScores.emotional_maturity < 40) {
      flags.push(RISK_FLAGS.LOW_EMOTIONAL_MATURITY);
    }
    if (dimensionScores.respect_autonomy < 40) {
      flags.push(RISK_FLAGS.DISRESPECT_AUTONOMY);
    }
    if (dimensionScores.clear_expectations < 40) {
      flags.push(RISK_FLAGS.UNCLEAR_EXPECTATIONS);
    }
    if (dimensionScores.emotional_safety < 40) {
      flags.push(RISK_FLAGS.POOR_EMOTIONAL_SAFETY);
    }
    if (dimensionScores.self_sufficiency < 40) {
      flags.push(RISK_FLAGS.LOW_SELF_SUFFICIENCY);
    }

    // Detect specific red flags from individual answers
    // Red flag control: low autonomy + consistency in control-related questions
    const autonomyQuestions = questions.filter((q) => q.dimension === 'respect_autonomy');
    const autonomyAnswers = autonomyQuestions.map((q) => answerMap.get(q.id) || 3);
    const avgAutonomyAnswer = autonomyAnswers.reduce((a, b) => a + b, 0) / autonomyAnswers.length;
    if (avgAutonomyAnswer < 2.5) {
      flags.push(RISK_FLAGS.RED_FLAG_CONTROL);
    }

    // Red flag manipulation: low emotional maturity + safety concerns
    const safetyQuestions = questions.filter((q) => q.dimension === 'emotional_safety');
    const safetyAnswers = safetyQuestions.map((q) => answerMap.get(q.id) || 3);
    const avgSafetyAnswer = safetyAnswers.reduce((a, b) => a + b, 0) / safetyAnswers.length;
    if (avgSafetyAnswer < 2.5) {
      flags.push(RISK_FLAGS.RED_FLAG_SAFETY_CONCERN);
    }

    // Red flag manipulation: inconsistency between emotional maturity and behavior
    if (dimensionScores.emotional_maturity < 50 && dimensionScores.respect_autonomy < 50) {
      flags.push(RISK_FLAGS.RED_FLAG_MANIPULATION);
    }

    return [...new Set(flags)]; // Remove duplicates
  }
}
