export class JwtPayloadDto {
  sub: string; // user ID
  email: string;
  userType: string;
  iat?: number;
  exp?: number;
}
