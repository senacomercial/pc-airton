export class TrustScoreDto {
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
