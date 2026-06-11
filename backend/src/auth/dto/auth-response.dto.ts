export class AuthResponseDto {
  userId: string;
  email: string;
  status: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
  nextStep: string;
}
