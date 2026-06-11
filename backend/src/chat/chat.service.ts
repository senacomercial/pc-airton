import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EncryptionService } from './encryption.service';
import { checkForFinancialData, SmartWarningResult } from './smart-warnings';
import { SendMessageDto, CreateConversationDto } from './dto/send-message.dto';

export interface DeliveredMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string; // já descriptografado para entrega
  contentType: string;
  mediaUrl: string | null;
  status: string;
  createdAt: Date;
  warning?: string;
}

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
  ) {}

  /** Ordena dois UUIDs para garantir unicidade de conversa (user1 < user2). */
  private orderedPair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  async createConversation(userId: string, dto: CreateConversationDto) {
    if (userId === dto.recipientId) {
      throw new BadRequestException('Não é possível conversar consigo mesmo');
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: dto.recipientId },
    });
    if (!recipient) {
      throw new NotFoundException('Destinatário não encontrado');
    }

    const [user1Id, user2Id] = this.orderedPair(userId, dto.recipientId);

    const existing = await this.prisma.conversation.findUnique({
      where: { user1Id_user2Id: { user1Id, user2Id } },
    });
    if (existing) {
      return existing;
    }

    // Gera a data key da conversa (envelope encryption)
    const { encryptedKey } = this.encryption.generateDataKey();

    return this.prisma.conversation.create({
      data: {
        user1Id,
        user2Id,
        encryptedDataKey: encryptedKey,
        users: { connect: [{ id: user1Id }, { id: user2Id }] },
      },
    });
  }

  async listConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: { lastMessageAt: 'desc' },
    });
    return conversations;
  }

  async sendMessage(
    userId: string,
    dto: SendMessageDto,
  ): Promise<DeliveredMessage> {
    const conversation = await this.assertParticipant(dto.conversationId, userId);

    // Bloqueio se a conversa estiver bloqueada por algum lado
    if (conversation.user1Blocked || conversation.user2Blocked) {
      throw new ForbiddenException('Esta conversa está bloqueada');
    }

    // Smart warning (avisa, não bloqueia)
    const warning: SmartWarningResult =
      dto.contentType === 'text' || !dto.contentType
        ? checkForFinancialData(dto.content)
        : { hasRisk: false, shouldBlock: false };

    // Criptografar conteúdo com a data key da conversa
    const dataKey = this.encryption.decryptDataKey(conversation.encryptedDataKey!);
    const encryptedContent = this.encryption.encrypt(dto.content, dataKey);

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: userId,
        content: encryptedContent,
        contentType: dto.contentType || 'text',
        mediaUrl: dto.mediaUrl,
        encrypted: true,
        status: 'sent',
      },
    });

    // Atualizar última mensagem da conversa (preview truncado, em claro mínimo)
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        lastMessage: dto.content.slice(0, 100),
        lastMessageAt: message.createdAt,
      },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: dto.content, // entrega em claro
      contentType: message.contentType,
      mediaUrl: message.mediaUrl,
      status: message.status,
      createdAt: message.createdAt,
      warning: warning.hasRisk ? warning.message : undefined,
    };
  }

  async getMessages(
    userId: string,
    conversationId: string,
    limit = 50,
    before?: Date,
  ): Promise<DeliveredMessage[]> {
    const conversation = await this.assertParticipant(conversationId, userId);
    const dataKey = this.encryption.decryptDataKey(conversation.encryptedDataKey!);

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
        ...(before ? { createdAt: { lt: before } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages
      .reverse()
      .map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.encrypted
          ? this.encryption.decrypt(m.content, dataKey)
          : m.content,
        contentType: m.contentType,
        mediaUrl: m.mediaUrl,
        status: m.status,
        createdAt: m.createdAt,
      }));
  }

  async markAsRead(userId: string, conversationId: string) {
    await this.assertParticipant(conversationId, userId);
    // Marca como lidas as mensagens que NÃO foram enviadas por este usuário
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        status: { not: 'read' },
      },
      data: { status: 'read', readAt: new Date() },
    });
    return { success: true };
  }

  /** Garante que o usuário participa da conversa; retorna a conversa. */
  private async assertParticipant(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('Você não participa desta conversa');
    }
    return conversation;
  }
}
