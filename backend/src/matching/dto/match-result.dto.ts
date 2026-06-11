export class CandidateMatchDto {
  userId: string;
  email: string;
  firstName: string;
  userType: string;
  age: number;
  gender: string;
  city?: string;
  state?: string;
  bio?: string;
  profilePhotoUrl?: string;
  compatibilityScore: number;
  scoreBreakdown: {
    demographic: number;
    expectations: number;
    behavioral: number;
  };
  matchReasons: string[];
}

export class MatchListResponseDto {
  totalMatches: number;
  cached: boolean;
  matches: CandidateMatchDto[];
}
