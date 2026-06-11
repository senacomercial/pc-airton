import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CandidateMatchDto, MatchListResponseDto } from './dto/match-result.dto';
import { UserType } from '@prisma/client';

interface CandidateScore {
  userId: string;
  email: string;
  firstName: string;
  userType: UserType;
  age: number;
  gender: string;
  city?: string;
  state?: string;
  bio?: string;
  profilePhotoUrl?: string;
  demographicScore: number;
  expectationScore: number;
  behavioralScore: number;
  overallScore: number;
  matchReasons: string[];
}

@Injectable()
export class MatchingService {
  private matchCache = new Map<string, { data: MatchListResponseDto; timestamp: number }>();
  private CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  constructor(private prisma: PrismaService) {}

  async getMatches(userId: string, limit: number = 50): Promise<MatchListResponseDto> {
    // Check cache first
    const cached = this.matchCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return { ...cached.data, cached: true };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        questionnaire: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Pre-filter candidates
    const candidates = await this.getPotentialCandidates(user);

    // Score each candidate
    const scoredCandidates = candidates.map((candidate) =>
      this.scoreCandidate(user, candidate),
    );

    // Sort by overall score and take top matches
    const topMatches = scoredCandidates
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit)
      .map((scored) => this.formatMatch(scored));

    const result: MatchListResponseDto = {
      totalMatches: topMatches.length,
      cached: false,
      matches: topMatches,
    };

    // Cache the result
    this.matchCache.set(userId, { data: result, timestamp: Date.now() });

    return result;
  }

  private async getPotentialCandidates(user: any) {
    // Determine opposite type(s) for matching
    const oppositeTypes = this.getOppositeTypes(user.userType);

    // Get candidates: opposite type, same approximate age range, with subscription
    const minAge = Math.max(18, (user.birthDate ? this.calculateAge(user.birthDate) : 30) - 15);
    const maxAge = (user.birthDate ? this.calculateAge(user.birthDate) : 30) + 15;

    const candidates = await this.prisma.user.findMany({
      where: {
        userType: { in: oppositeTypes },
        birthDate: {
          gte: new Date(new Date().getFullYear() - maxAge, 0, 1),
          lte: new Date(new Date().getFullYear() - minAge, 11, 31),
        },
        status: { in: ['ACTIVE', 'PENDING_PROFILE', 'AWAITING_PAYMENT'] }, // Accept users with subscription in any of these states
        id: { not: user.id },
        subscription: { status: 'ACTIVE' }, // Must have active subscription
      },
      include: {
        profile: true,
        questionnaire: true,
      },
      take: 200, // Get more than needed for scoring
    });

    return candidates;
  }

  private scoreCandidate(user: any, candidate: any): CandidateScore {
    const demographicScore = this.scoreDemographic(user, candidate);
    const expectationScore = this.scoreExpectations(user, candidate);
    const behavioralScore = this.scoreBehavioral(user, candidate);

    // Weighted average: 20% demographic, 40% expectation, 40% behavioral
    const overallScore = Math.round(
      demographicScore * 0.2 + expectationScore * 0.4 + behavioralScore * 0.4,
    );

    const matchReasons = this.generateMatchReasons(user, candidate, demographicScore, expectationScore, behavioralScore);

    return {
      userId: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      userType: candidate.userType,
      age: this.calculateAge(candidate.birthDate),
      gender: candidate.gender || 'unknown',
      city: candidate.city,
      state: candidate.state,
      bio: candidate.profile?.bio,
      profilePhotoUrl: candidate.profile?.profilePhotoUrl,
      demographicScore,
      expectationScore,
      behavioralScore,
      overallScore,
      matchReasons,
    };
  }

  private scoreDemographic(user: any, candidate: any): number {
    let score = 0;
    let factors = 0;

    // Age compatibility (±10 years is best)
    const userAge = this.calculateAge(user.birthDate);
    const candidateAge = this.calculateAge(candidate.birthDate);
    const ageDiff = Math.abs(userAge - candidateAge);
    if (ageDiff <= 5) {
      score += 100;
    } else if (ageDiff <= 10) {
      score += 80;
    } else if (ageDiff <= 15) {
      score += 50;
    } else {
      score += 20;
    }
    factors++;

    // Location compatibility
    if (user.city && candidate.city) {
      if (user.city.toLowerCase() === candidate.city.toLowerCase()) {
        score += 100; // Same city is ideal
      } else if (user.state && candidate.state && user.state === candidate.state) {
        score += 60; // Same state but different city
      } else {
        score += 20; // Different state
      }
    } else {
      score += 50; // No location data
    }
    factors++;

    // Gender/type attraction (simplified)
    if (user.gender && candidate.gender) {
      // For MVP, assume basic heteronormative attraction
      // In future, can be customized per user
      score += 80;
    } else {
      score += 60;
    }
    factors++;

    // Profile completeness (user's perspective: more complete = better match)
    if (candidate.profile?.profilePhotoUrl) {
      score += 30;
    }
    if (candidate.profile?.bio && candidate.profile.bio.length > 50) {
      score += 20;
    }
    factors += 0.5;

    return Math.round(score / factors);
  }

  private scoreExpectations(user: any, candidate: any): number {
    let score = 50; // Default neutral
    let adjustments = 0;

    // Income range compatibility
    if (user.userType === UserType.SUGAR_BABY || user.userType === UserType.SUGAR_MOMMY) {
      const userIncomeRange = user.profile?.incomeRange;
      if (userIncomeRange) {
        // Sugar daddy/mommy must meet income expectations
        const candidateIncome = candidate.profile?.incomeRange;
        if (candidateIncome === userIncomeRange) {
          score += 50;
        } else if (candidateIncome === '50k+' && userIncomeRange !== '50k+') {
          // Higher income is always acceptable
          score += 40;
        }
      }
    }
    adjustments++;

    // Relationship status compatibility
    if (user.profile?.relationshipStatus && candidate.profile?.relationshipStatus) {
      // Both should allow non-exclusive relationships for sugar dating
      const userStatus = user.profile.relationshipStatus.toLowerCase();
      const candidateStatus = candidate.profile.relationshipStatus.toLowerCase();
      if (
        (userStatus.includes('open') || userStatus.includes('single')) &&
        (candidateStatus.includes('open') || candidateStatus.includes('single'))
      ) {
        score += 30;
      } else if (userStatus === candidateStatus) {
        score += 20;
      } else {
        score -= 20;
      }
    }
    adjustments++;

    // Interests overlap
    if (user.profile?.interests && candidate.profile?.interests) {
      const userInterests = new Set(user.profile.interests.map((i: string) => i.toLowerCase()));
      const candidateInterests = new Set(candidate.profile.interests.map((i: string) => i.toLowerCase()));
      const overlap = [...userInterests].filter((i) => candidateInterests.has(i)).length;
      const maxInterests = Math.max(userInterests.size, candidateInterests.size);
      if (maxInterests > 0) {
        score += (overlap / maxInterests) * 40;
      }
    }
    adjustments++;

    return Math.round(score / adjustments);
  }

  private scoreBehavioral(user: any, candidate: any): number {
    // If either user lacks questionnaire data, return neutral score
    if (!user.questionnaire?.dimensionScores || !candidate.questionnaire?.dimensionScores) {
      return 50;
    }

    const userScores = user.questionnaire.dimensionScores as any;
    const candidateScores = candidate.questionnaire.dimensionScores as any;

    let totalScore = 0;
    let dimensions = 0;

    // Compare each dimension (closer scores = more compatible)
    const dims = [
      'emotional_maturity',
      'respect_autonomy',
      'clear_expectations',
      'emotional_safety',
      'self_sufficiency',
    ];

    dims.forEach((dim) => {
      const userDim = userScores[dim] || 50;
      const candidateDim = candidateScores[dim] || 50;
      const diff = Math.abs(userDim - candidateDim);

      // Convert difference to compatibility score (0-100)
      // Diff of 0 = 100, diff of 50 = 50, diff of 100 = 0
      const compatScore = Math.max(0, 100 - diff);
      totalScore += compatScore;
      dimensions++;
    });

    // Check for critical red flags
    if (user.questionnaire.riskFlags?.includes('red_flag_safety_concern')) {
      totalScore *= 0.5; // Halve behavioral score if they have safety red flags
    }
    if (candidate.questionnaire.riskFlags?.includes('red_flag_safety_concern')) {
      totalScore *= 0.5; // Same for candidate
    }

    return Math.round(totalScore / dimensions);
  }

  private generateMatchReasons(user: any, candidate: any, demoScore: number, expectScore: number, behavScore: number): string[] {
    const reasons: string[] = [];

    if (demoScore >= 80) {
      const userAge = this.calculateAge(user.birthDate);
      const candidateAge = this.calculateAge(candidate.birthDate);
      reasons.push(`Compatível em idade (${candidateAge} anos)`);
    }

    if (user.city && candidate.city && user.city.toLowerCase() === candidate.city.toLowerCase()) {
      reasons.push(`Mesma cidade (${candidate.city})`);
    }

    if (expectScore >= 70) {
      if (candidate.profile?.incomeRange) {
        reasons.push(`Renda compatível (${candidate.profile.incomeRange})`);
      }
    }

    if (behavScore >= 75) {
      reasons.push('Perfil comportamental muito compatível');
    } else if (behavScore >= 60) {
      reasons.push('Perfil comportamental compatível');
    }

    // Add interest overlap if present
    if (user.profile?.interests && candidate.profile?.interests) {
      const userInterests = new Set(user.profile.interests.map((i: string) => i.toLowerCase()));
      const candidateInterests = new Set(candidate.profile.interests.map((i: string) => i.toLowerCase()));
      const overlap = [...userInterests].filter((i) => candidateInterests.has(i)).length;
      if (overlap > 0) {
        reasons.push(`${overlap} interesses em comum`);
      }
    }

    return reasons.length > 0 ? reasons : ['Boa compatibilidade geral'];
  }

  private formatMatch(scored: CandidateScore): CandidateMatchDto {
    return {
      userId: scored.userId,
      email: scored.email,
      firstName: scored.firstName,
      userType: scored.userType,
      age: scored.age,
      gender: scored.gender,
      city: scored.city,
      state: scored.state,
      bio: scored.bio,
      profilePhotoUrl: scored.profilePhotoUrl,
      compatibilityScore: scored.overallScore,
      scoreBreakdown: {
        demographic: scored.demographicScore,
        expectations: scored.expectationScore,
        behavioral: scored.behavioralScore,
      },
      matchReasons: scored.matchReasons,
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private getOppositeTypes(userType: UserType): UserType[] {
    // Sugar daddy matches with sugar babies and mommies
    if (userType === UserType.SUGAR_DADDY) {
      return [UserType.SUGAR_BABY];
    }
    // Sugar baby matches with daddies and mommies
    if (userType === UserType.SUGAR_BABY) {
      return [UserType.SUGAR_DADDY, UserType.SUGAR_MOMMY];
    }
    // Sugar mommy matches with sugar babies
    if (userType === UserType.SUGAR_MOMMY) {
      return [UserType.SUGAR_BABY];
    }
    return [];
  }

  clearCache(userId: string): void {
    this.matchCache.delete(userId);
  }
}
