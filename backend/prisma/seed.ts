/**
 * Seed de dados de demonstração para o Sugar Dream.
 *
 * Cria usuários de todos os tipos com profiles ricos, assinaturas ativas,
 * questionários respondidos, reviews (trust score), uma conversa com mensagens
 * criptografadas e lives agendadas — tudo que o frontend precisa exibir.
 *
 * Rodar: npm run db:seed
 */
import { PrismaClient, UserType, GenderType, AccountStatus, SubscriptionStatus, LiveStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// --- Criptografia (espelha EncryptionService para mensagens consistentes) ---
const ALGO = 'aes-256-gcm';
const MASTER_KEY = crypto
  .createHash('sha256')
  .update(process.env.ENCRYPTION_MASTER_KEY || 'dev-master-key-change-in-production-please-32b')
  .digest();

function wrapKey(plaintextKey: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, MASTER_KEY, iv);
  const enc = Buffer.concat([cipher.update(plaintextKey), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join(':');
}

function encryptMessage(plaintext: string, dataKey: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, dataKey, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join(':');
}

// Dimension scores fictícios mas plausíveis
function dims(em: number, ra: number, ce: number, es: number, ss: number) {
  return {
    emotional_maturity: em,
    respect_autonomy: ra,
    clear_expectations: ce,
    emotional_safety: es,
    self_sufficiency: ss,
  };
}

interface SeedUser {
  email: string;
  firstName: string;
  userType: UserType;
  gender: GenderType;
  birthDate: Date;
  city: string;
  state: string;
  bio: string;
  interests: string[];
  incomeRange?: string;
  relationshipStatus: string;
  profilePhotoUrl: string;
  plan: string;
  questionnaire: ReturnType<typeof dims>;
  overallScore: number;
}

const USERS: SeedUser[] = [
  {
    email: 'joao.daddy@demo.com',
    firstName: 'João',
    userType: UserType.SUGAR_DADDY,
    gender: GenderType.M,
    birthDate: new Date('1978-04-12'),
    city: 'São Paulo',
    state: 'SP',
    bio: 'Empresário do setor de tecnologia. Aprecio boa conversa, viagens e jantares sofisticados. Discreto e generoso.',
    interests: ['viagens', 'vinhos', 'tecnologia', 'gastronomia'],
    incomeRange: '50k+',
    relationshipStatus: 'open_relationship',
    profilePhotoUrl: 'https://i.pravatar.cc/400?img=12',
    plan: 'daddy_mommy',
    questionnaire: dims(82, 88, 80, 85, 90),
    overallScore: 85,
  },
  {
    email: 'ricardo.daddy@demo.com',
    firstName: 'Ricardo',
    userType: UserType.SUGAR_DADDY,
    gender: GenderType.M,
    birthDate: new Date('1983-09-01'),
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: 'Médico, apaixonado por música e mar. Procuro companhia leve e sincera, sem cobranças.',
    interests: ['música', 'praia', 'cinema', 'corrida'],
    incomeRange: '15k-50k',
    relationshipStatus: 'single',
    profilePhotoUrl: 'https://i.pravatar.cc/400?img=33',
    plan: 'daddy_mommy',
    questionnaire: dims(75, 78, 72, 80, 76),
    overallScore: 76,
  },
  {
    email: 'marina.baby@demo.com',
    firstName: 'Marina',
    userType: UserType.SUGAR_BABY,
    gender: GenderType.F,
    birthDate: new Date('1999-02-20'),
    city: 'São Paulo',
    state: 'SP',
    bio: 'Estudante de arquitetura. Amo arte, café e boas histórias. Busco um relacionamento transparente e respeitoso.',
    interests: ['arte', 'arquitetura', 'café', 'viagens'],
    relationshipStatus: 'single',
    profilePhotoUrl: 'https://i.pravatar.cc/400?img=45',
    plan: 'baby',
    questionnaire: dims(80, 85, 82, 88, 84),
    overallScore: 84,
  },
  {
    email: 'giulia.baby@demo.com',
    firstName: 'Giulia',
    userType: UserType.SUGAR_BABY,
    gender: GenderType.F,
    birthDate: new Date('2000-07-15'),
    city: 'São Paulo',
    state: 'SP',
    bio: 'Modelo e estudante de marketing. Adoro academia, moda e viagens. Sei o que quero e valorizo honestidade.',
    interests: ['moda', 'fitness', 'viagens', 'fotografia'],
    relationshipStatus: 'single',
    profilePhotoUrl: 'https://i.pravatar.cc/400?img=47',
    plan: 'baby',
    questionnaire: dims(78, 80, 79, 82, 85),
    overallScore: 81,
  },
  {
    email: 'beatriz.baby@demo.com',
    firstName: 'Beatriz',
    userType: UserType.SUGAR_BABY,
    gender: GenderType.F,
    birthDate: new Date('1998-11-03'),
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: 'Bailarina e professora de dança. Espírito livre, gosto de natureza e boa música. Procuro conexões genuínas.',
    interests: ['dança', 'natureza', 'música', 'yoga'],
    relationshipStatus: 'single',
    profilePhotoUrl: 'https://i.pravatar.cc/400?img=44',
    plan: 'baby',
    questionnaire: dims(83, 84, 80, 86, 82),
    overallScore: 83,
  },
  {
    email: 'camila.mommy@demo.com',
    firstName: 'Camila',
    userType: UserType.SUGAR_MOMMY,
    gender: GenderType.F,
    birthDate: new Date('1985-06-25'),
    city: 'São Paulo',
    state: 'SP',
    bio: 'Executiva de finanças, independente e segura. Procuro um jovem interessante e bem-humorado para compartilhar bons momentos.',
    interests: ['negócios', 'arte', 'viagens', 'gastronomia'],
    incomeRange: '15k-50k',
    relationshipStatus: 'open_relationship',
    profilePhotoUrl: 'https://i.pravatar.cc/400?img=49',
    plan: 'daddy_mommy',
    questionnaire: dims(86, 88, 84, 87, 90),
    overallScore: 87,
  },
];

const LIVES = [
  {
    title: 'Relacionamentos Saudáveis: Limites e Comunicação',
    description: 'Especialista em psicologia relacional discute como estabelecer limites claros e comunicação transparente.',
    daysFromNow: 2,
    durationMin: 60,
    meetUrl: 'https://meet.google.com/abc-defg-hij',
  },
  {
    title: 'Independência Financeira para Sugar Babies',
    description: 'Planejamento financeiro, investimentos e construção de patrimônio com convidada especialista.',
    daysFromNow: 5,
    durationMin: 90,
    meetUrl: 'https://meet.google.com/klm-nopq-rst',
  },
  {
    title: 'Segurança e Discrição em Encontros',
    description: 'Boas práticas de segurança pessoal, verificação e discrição em relacionamentos sugar.',
    daysFromNow: 9,
    durationMin: 45,
    meetUrl: 'https://meet.google.com/uvw-xyz1-234',
  },
];

async function main() {
  console.log('🌱 Iniciando seed do Sugar Dream...\n');

  const passwordHash = await bcrypt.hash('Demo@1234', 12);
  const created: Record<string, string> = {};

  // --- Usuários + profiles + assinaturas + questionários ---
  for (const u of USERS) {
    // Limpa usuário pré-existente com mesmo email (idempotência)
    await prisma.user.deleteMany({ where: { email: u.email } });

    const user = await prisma.user.create({
      data: {
        email: u.email,
        phone: null,
        passwordHash,
        firstName: u.firstName,
        userType: u.userType,
        gender: u.gender,
        birthDate: u.birthDate,
        city: u.city,
        state: u.state,
        country: 'Brasil',
        status: AccountStatus.ACTIVE,
        phoneVerified: true,
        faceVerified: true,
        verifiedAt: new Date(),
        profile: {
          create: {
            bio: u.bio,
            interests: u.interests,
            relationshipStatus: u.relationshipStatus,
            incomeRange: u.incomeRange,
            profilePhotoUrl: u.profilePhotoUrl,
          },
        },
        subscription: {
          create: {
            planType: u.plan,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        questionnaire: {
          create: {
            answers: [],
            overallScore: u.overallScore,
            dimensionScores: u.questionnaire,
            riskFlags: [],
            version: 1,
            reassessAfter: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    created[u.email] = user.id;
    console.log(`  ✓ ${u.firstName} (${u.userType}) — trust ${u.overallScore}`);
  }

  // --- Conversa de exemplo: João (daddy) ↔ Marina (baby) com mensagens cifradas ---
  const joaoId = created['joao.daddy@demo.com'];
  const marinaId = created['marina.baby@demo.com'];
  const [u1, u2] = [joaoId, marinaId].sort();

  const plaintextKey = crypto.randomBytes(32);
  const encryptedDataKey = wrapKey(plaintextKey);

  const conversation = await prisma.conversation.create({
    data: {
      user1Id: u1,
      user2Id: u2,
      encryptedDataKey,
      users: { connect: [{ id: u1 }, { id: u2 }] },
    },
  });

  const demoMessages: { sender: string; text: string }[] = [
    { sender: joaoId, text: 'Oi Marina, tudo bem? Gostei muito do seu perfil, principalmente do interesse por arte.' },
    { sender: marinaId, text: 'Oi João! Tudo ótimo, obrigada 😊 Também achei seu perfil interessante. Você viaja bastante?' },
    { sender: joaoId, text: 'Sim, viajo muito a trabalho e a lazer. Que tal um café essa semana para nos conhecermos melhor?' },
    { sender: marinaId, text: 'Adoraria! Tenho disponibilidade na quinta à tarde. Conheço um café ótimo nos Jardins.' },
  ];

  let lastText = '';
  for (const m of demoMessages) {
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: m.sender,
        content: encryptMessage(m.text, plaintextKey),
        contentType: 'text',
        encrypted: true,
        status: 'read',
        readAt: new Date(),
      },
    });
    lastText = m.text;
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessage: lastText.slice(0, 80), lastMessageAt: new Date() },
  });
  console.log(`\n  ✓ Conversa João ↔ Marina com ${demoMessages.length} mensagens cifradas`);

  // --- Reviews: Marina avalia João (gera trust score visível) ---
  await prisma.review.create({
    data: {
      reviewerId: marinaId,
      reviewedUserId: joaoId,
      conversationId: conversation.id,
      rating: 5,
      dimensions: { respect: 5, communication: 5, safety: 4, honesty: 5, discretion: 5 },
      comment: 'Cavalheiro, respeitoso e muito transparente. Cumpriu tudo que combinamos.',
      anonymous: false,
    },
  });
  console.log('  ✓ Review de Marina para João (5★)');

  // --- Lives agendadas ---
  const hostId = created['camila.mommy@demo.com'];
  for (const l of LIVES) {
    await prisma.live.create({
      data: {
        title: l.title,
        description: l.description,
        startTime: new Date(Date.now() + l.daysFromNow * 24 * 60 * 60 * 1000),
        durationMin: l.durationMin,
        meetUrl: l.meetUrl,
        hostId,
        status: LiveStatus.SCHEDULED,
      },
    });
    console.log(`  ✓ Live: ${l.title}`);
  }

  console.log('\n✅ Seed concluído!');
  console.log('\n📋 Credenciais de demonstração (senha: Demo@1234):');
  USERS.forEach((u) => console.log(`   ${u.email}  (${u.userType})`));
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
