import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // Documentação OpenAPI/Swagger — consumida pelo frontend
  const config = new DocumentBuilder()
    .setTitle('Sugar Dream API')
    .setDescription(
      'API da plataforma Sugar Dream — autenticação, matching, chat criptografado, ' +
        'questionário comportamental, moderação, reputação e lives. ' +
        'A maioria das rotas exige JWT (Bearer token); o chat e o matching exigem assinatura ativa.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido em POST /api/v1/auth/login',
      },
      'JWT',
    )
    .addTag('auth', 'Registro, login e tokens')
    .addTag('users', 'Perfil do usuário')
    .addTag('subscriptions', 'Assinatura e pagamentos')
    .addTag('verification', 'Verificação de telefone e face')
    .addTag('chat', 'Conversas e mensagens (paywall)')
    .addTag('questionnaire', 'Questionário comportamental')
    .addTag('matches', 'Algoritmo de compatibilidade (paywall)')
    .addTag('reports', 'Denúncias e moderação')
    .addTag('reviews', 'Avaliações e reputação')
    .addTag('lives', 'Transmissões ao vivo / webinars')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = parseInt(process.env.API_PORT || '3000');
  await app.listen(port);

  console.log(`🚀 Sugar Dream API rodando em http://localhost:${port}`);
  console.log(`📚 Documentação Swagger em http://localhost:${port}/api/docs`);
}

bootstrap();
