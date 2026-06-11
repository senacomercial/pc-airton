import { IsString, IsUrl } from 'class-validator';

export class VerifyLivenessDto {
  @IsUrl()
  videoUrl: string; // URL pré-assinada do S3 com o vídeo de liveness
}

export class LivenessResponseDto {
  verified: boolean;
  livenessScore: number;
  faceMatchScore: number;
  ageCheck: 'passed' | 'failed' | 'uncertain';
  verifiedAt: Date;
}
