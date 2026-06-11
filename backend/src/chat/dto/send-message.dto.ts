import { IsString, IsUUID, IsOptional, IsIn, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  conversationId: string;

  @IsString()
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsIn(['text', 'image', 'audio', 'video'])
  contentType?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}

export class CreateConversationDto {
  @IsUUID()
  recipientId: string;
}
