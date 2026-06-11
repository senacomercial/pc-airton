import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';

/**
 * ChatGateway — comunicação realtime do chat (núcleo do produto).
 *
 * Autenticação por JWT no handshake (?token=...). Só usuários com assinatura
 * ACTIVE conectam (paywall). Mensagens são persistidas/criptografadas via
 * ChatService e entregues à sala da conversa.
 */
@WebSocketGateway({
  namespace: '/ws/chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  // userId -> Set<socketId>
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwt: JwtService,
    private chatService: ChatService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.query.token as string) ||
        client.handshake.auth?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.sub;

      // Paywall: exige assinatura ativa
      const subscription = await this.prisma.subscription.findUnique({
        where: { userId },
      });
      if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
        client.emit('error', { message: 'Assinatura ativa necessária' });
        client.disconnect();
        return;
      }

      client.data.userId = userId;
      this.addUserSocket(userId, client.id);

      // Entra nas salas de todas as suas conversas
      const conversations = await this.chatService.listConversations(userId);
      conversations.forEach((c) => client.join(`conversation:${c.id}`));

      this.logger.log(`Cliente conectado: ${userId} (${client.id})`);
    } catch (err) {
      this.logger.warn(`Falha de autenticação no WS: ${(err as any)?.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.removeUserSocket(userId, client.id);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const userId = client.data?.userId;
    if (!userId) return;

    const message = await this.chatService.sendMessage(userId, dto);

    // Entrega para a sala da conversa (ambos os participantes)
    this.server
      .to(`conversation:${dto.conversationId}`)
      .emit('message', message);

    // Aviso de risco financeiro vai apenas para o remetente
    if (message.warning) {
      client.emit('warning', { message: message.warning });
    }

    return message;
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    return { joined: data.conversationId };
  }

  @SubscribeMessage('read')
  async handleRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data?.userId;
    if (!userId) return;
    await this.chatService.markAsRead(userId, data.conversationId);
    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('read', { conversationId: data.conversationId, by: userId });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data?.userId;
    client
      .to(`conversation:${data.conversationId}`)
      .emit('typing', { conversationId: data.conversationId, userId });
  }

  private addUserSocket(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  private removeUserSocket(userId: string, socketId: string) {
    const set = this.userSockets.get(userId);
    if (set) {
      set.delete(socketId);
      if (set.size === 0) this.userSockets.delete(userId);
    }
  }
}
