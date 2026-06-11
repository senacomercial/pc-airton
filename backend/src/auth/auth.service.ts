import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto, JwtPayloadDto } from './dto';
import { UserTypeEnum, GenderEnum } from './dto/register.dto';
import { AccountStatus, UserType, GenderType } from '@prisma/client';

// Mapeamento dos valores da API (lowercase) → enums do Prisma
const USER_TYPE_MAP: Record<UserTypeEnum, UserType> = {
  [UserTypeEnum.SUGAR_DADDY]: UserType.SUGAR_DADDY,
  [UserTypeEnum.SUGAR_BABY]: UserType.SUGAR_BABY,
  [UserTypeEnum.SUGAR_MOMMY]: UserType.SUGAR_MOMMY,
};

const GENDER_MAP: Record<GenderEnum, GenderType> = {
  [GenderEnum.M]: GenderType.M,
  [GenderEnum.F]: GenderType.F,
  [GenderEnum.NB]: GenderType.NB,
  [GenderEnum.OTHER]: GenderType.OTHER,
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Validar idade
    const age = this.calculateAge(dto.birthDate);
    if (age < 18) {
      throw new BadRequestException(
        'Você deve ter pelo menos 18 anos para se registrar',
      );
    }

    // Verificar se e-mail já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('E-mail já registrado');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Criar usuário com status AWAITING_PAYMENT
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        firstName: dto.firstName,
        userType: USER_TYPE_MAP[dto.userType],
        gender: GENDER_MAP[dto.gender],
        birthDate: dto.birthDate,
        status: AccountStatus.AWAITING_PAYMENT,
      },
    });

    // Gerar tokens
    const { token, refreshToken, expiresIn } = await this.generateTokens(user.id, user.email, user.userType);

    // Retornar resposta
    return {
      userId: user.id,
      email: user.email,
      status: user.status,
      token,
      refreshToken,
      expiresIn,
      nextStep: 'checkout',
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Reativa usuários cuja suspensão temporária já expirou
    if (
      user.status === AccountStatus.SUSPENDED &&
      user.suspendedUntil &&
      user.suspendedUntil <= new Date()
    ) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { status: AccountStatus.ACTIVE, suspendedUntil: null },
      });
      user.status = AccountStatus.ACTIVE;
      user.suspendedUntil = null;
    }

    // Usuários com status AWAITING_PAYMENT não podem fazer login
    // Eles voltam para fazer o pagamento
    if (user.status === AccountStatus.AWAITING_PAYMENT) {
      throw new BadRequestException(
        'Finalize o pagamento para acessar a plataforma',
      );
    }

    if (
      user.status === AccountStatus.SUSPENDED ||
      user.status === AccountStatus.BANNED ||
      user.status === AccountStatus.DELETED
    ) {
      // Mensagem específica para suspensão temporária ainda vigente
      if (user.status === AccountStatus.SUSPENDED && user.suspendedUntil) {
        throw new UnauthorizedException(
          `Sua conta está suspensa até ${user.suspendedUntil.toLocaleDateString('pt-BR')}.`,
        );
      }
      throw new UnauthorizedException(
        'Sua conta não está disponível. Contate o suporte.',
      );
    }

    const { token, refreshToken, expiresIn } = await this.generateTokens(user.id, user.email, user.userType);

    return {
      userId: user.id,
      email: user.email,
      status: user.status,
      token,
      refreshToken,
      expiresIn,
      nextStep: user.status === AccountStatus.PENDING_PROFILE ? 'complete_profile' : 'dashboard',
    };
  }

  async validateToken(token: string): Promise<JwtPayloadDto> {
    try {
      const payload = await this.jwt.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async refreshTokens(refreshToken: string): Promise<{ token: string; refreshToken: string; expiresIn: number }> {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      return this.generateTokens(user.id, user.email, user.userType);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
    userType: string,
  ): Promise<{ token: string; refreshToken: string; expiresIn: number }> {
    const payload: JwtPayloadDto = {
      sub: userId,
      email,
      userType,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    } as any);

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    } as any);

    const decoded: any = this.jwt.decode(token);

    return {
      token,
      refreshToken,
      expiresIn: decoded.exp - decoded.iat,
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
