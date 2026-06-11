import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * EncryptionService — Criptografia de coluna via envelope encryption.
 *
 * Em produção, a "master key" vive no AWS KMS e a data key por conversa
 * é cifrada por ela (envelope encryption). Aqui usamos AES-256-GCM com uma
 * master key derivada de variável de ambiente como PLACEHOLDER do KMS.
 *
 * IMPORTANTE: isto NÃO é E2E. O servidor pode descriptografar para moderar
 * conteúdo (anti-abuso), conforme decidido no PRD. Substituir a master key
 * local por AWS KMS antes de produção.
 */
@Injectable()
export class EncryptionService {
  private readonly masterKey: Buffer;
  private readonly algorithm = 'aes-256-gcm';

  constructor(private configService: ConfigService) {
    const secret =
      this.configService.get<string>('ENCRYPTION_MASTER_KEY') ||
      'dev-master-key-change-in-production-please-32b';
    // Deriva uma chave de 32 bytes a partir do segredo
    this.masterKey = crypto.createHash('sha256').update(secret).digest();
  }

  /**
   * Gera uma data key (32 bytes) para uma conversa, retornando a versão
   * em claro (para uso imediato) e a versão cifrada (para persistir).
   * Em produção, o "wrap" seria feito pelo KMS.
   */
  generateDataKey(): { plaintextKey: Buffer; encryptedKey: string } {
    const plaintextKey = crypto.randomBytes(32);
    const encryptedKey = this.wrapKey(plaintextKey);
    return { plaintextKey, encryptedKey };
  }

  /** Descriptografa (unwrap) uma data key persistida. */
  decryptDataKey(encryptedKey: string): Buffer {
    return this.unwrapKey(encryptedKey);
  }

  /**
   * Criptografa um conteúdo (mensagem) com a data key da conversa.
   * Retorna string no formato: iv:authTag:ciphertext (base64).
   */
  encrypt(plaintext: string, dataKey: Buffer): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, dataKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  /** Descriptografa um conteúdo cifrado com a data key da conversa. */
  decrypt(ciphertext: string, dataKey: Buffer): string {
    const [ivB64, authTagB64, dataB64] = ciphertext.split(':');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    const decipher = crypto.createDecipheriv(this.algorithm, dataKey, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  // --- Envelope: wrap/unwrap da data key com a master key (placeholder KMS) ---

  private wrapKey(plaintextKey: Buffer): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintextKey),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  private unwrapKey(encryptedKey: string): Buffer {
    const [ivB64, authTagB64, dataB64] = encryptedKey.split(':');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');

    const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }
}
