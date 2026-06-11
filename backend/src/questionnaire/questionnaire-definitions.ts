import { UserType } from '@prisma/client';

export interface Question {
  id: string;
  text: string;
  dimension: string;
  reversed?: boolean; // if true, score is inverted (5→1, 4→2, etc)
}

export interface QuestionnaireDefinition {
  userType: UserType;
  questions: Question[];
}

// Questões para SUGAR_DADDY (relacionadas à dinâmica de sustento financeiro)
const SUGAR_DADDY_QUESTIONS: Question[] = [
  // emotional_maturity (6 questions)
  {
    id: 'sd_em_1',
    text: 'Consigo reconhecer e expressar minhas emoções de forma madura',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sd_em_2',
    text: 'Entendo que meus sentimentos não justificam comportamentos abusivos',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sd_em_3',
    text: 'Sou capaz de lidar com rejeição sem sentir-me humilhado',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sd_em_4',
    text: 'Reflito sobre minhas ações e suas consequências nos outros',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sd_em_5',
    text: 'Tenho controle sobre meu comportamento mesmo quando frustrado',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sd_em_6',
    text: 'Consigo discutir desacordos sem perder a calma ou ser agressivo',
    dimension: 'emotional_maturity',
  },

  // respect_autonomy (6 questions)
  {
    id: 'sd_ra_1',
    text: 'Respeito as decisões e escolhas de minha parceira mesmo que discorde',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sd_ra_2',
    text: 'Não espero que minha parceira mude seus hábitos ou interesses por mim',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sd_ra_3',
    text: 'Apoio minha parceira em manter suas amizades e vida social',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sd_ra_4',
    text: 'Entendo que sustento financeiro não me dá direito de controlar minha parceira',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sd_ra_5',
    text: 'Minha parceira tem direito a privacidade e não sou controlador',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sd_ra_6',
    text: 'Encorajo minha parceira a ter seu próprio dinheiro e independência',
    dimension: 'respect_autonomy',
  },

  // clear_expectations (6 questions)
  {
    id: 'sd_ce_1',
    text: 'Deixo claro desde o início o que espero de um relacionamento',
    dimension: 'clear_expectations',
  },
  {
    id: 'sd_ce_2',
    text: 'Sou honesto sobre minhas limitações e o que posso/não posso oferecer',
    dimension: 'clear_expectations',
  },
  {
    id: 'sd_ce_3',
    text: 'Acordo com minha parceira sobre financeiro sem imposições',
    dimension: 'clear_expectations',
  },
  {
    id: 'sd_ce_4',
    text: 'Comunico meus limites claramente sem ser agressivo',
    dimension: 'clear_expectations',
  },
  {
    id: 'sd_ce_5',
    text: 'Ouço o que minha parceira espera e levo em consideração',
    dimension: 'clear_expectations',
  },
  {
    id: 'sd_ce_6',
    text: 'Discuto expectativas sexuais/românticas abertamente e consensualmente',
    dimension: 'clear_expectations',
  },

  // emotional_safety (6 questions)
  {
    id: 'sd_es_1',
    text: 'Nunca ameacei parceiras com retaliação financeira ou abandono',
    dimension: 'emotional_safety',
    reversed: false,
  },
  {
    id: 'sd_es_2',
    text: 'Minha parceira sente-se segura comigo emocionalmente',
    dimension: 'emotional_safety',
  },
  {
    id: 'sd_es_3',
    text: 'Não uso dinâmica financeira para chantagear ou manipular',
    dimension: 'emotional_safety',
  },
  {
    id: 'sd_es_4',
    text: 'Respeito limites físicos e consentimento sem pressão',
    dimension: 'emotional_safety',
  },
  {
    id: 'sd_es_5',
    text: 'Minha parceira pode contar comigo sem medo de represálias',
    dimension: 'emotional_safety',
  },
  {
    id: 'sd_es_6',
    text: 'Nunca humilhei ou envergonhei minha parceira em público/privado',
    dimension: 'emotional_safety',
  },

  // self_sufficiency (6 questions)
  {
    id: 'sd_ss_1',
    text: 'Tenho vida e interesses próprios além de relacionamentos',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sd_ss_2',
    text: 'Sou financeiramente estável e responsável com minhas finanças',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sd_ss_3',
    text: 'Não dependo emocionalmente de minha parceira para validação',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sd_ss_4',
    text: 'Tenho amigos e círculo social além de relacionamentos',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sd_ss_5',
    text: 'Sou responsável por minha saúde mental e busco ajuda se necessário',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sd_ss_6',
    text: 'Entendo que minha parceira não é responsável por me fazer feliz',
    dimension: 'self_sufficiency',
  },
];

// Questões para SUGAR_BABY (relacionadas à segurança e agência pessoal)
const SUGAR_BABY_QUESTIONS: Question[] = [
  // emotional_maturity (6 questions)
  {
    id: 'sb_em_1',
    text: 'Consigo reconhecer minhas emoções e agir de forma responsável',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sb_em_2',
    text: 'Entendo que minha idade/situação não me exime de responsabilidade',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sb_em_3',
    text: 'Posso discutir desacordos sem explosões emocionais ou chantagem',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sb_em_4',
    text: 'Aprendo com meus erros e não repito padrões prejudiciais',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sb_em_5',
    text: 'Consigo reconhecer quando estou sendo manipulada',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sb_em_6',
    text: 'Não uso ameaças ou chantagem emocional para conseguir o que quero',
    dimension: 'emotional_maturity',
  },

  // respect_autonomy (6 questions)
  {
    id: 'sb_ra_1',
    text: 'Respeito as decisões de meu parceiro mesmo que discorde',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sb_ra_2',
    text: 'Entendo que sustento financeiro não anula a autonomia dele',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sb_ra_3',
    text: 'Respeito sua vida pessoal e círculo social',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sb_ra_4',
    text: 'Não espero que meu parceiro seja responsável por minhas escolhas de vida',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sb_ra_5',
    text: 'Posso ser amiga/companhia sem esperança de compromisso eterno',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sb_ra_6',
    text: 'Não exijo que meu parceiro mude seu estilo de vida por mim',
    dimension: 'respect_autonomy',
  },

  // clear_expectations (6 questions)
  {
    id: 'sb_ce_1',
    text: 'Sou honesta sobre meus limites desde o início',
    dimension: 'clear_expectations',
  },
  {
    id: 'sb_ce_2',
    text: 'Comunico o que espero financeiro/emocional claramente',
    dimension: 'clear_expectations',
  },
  {
    id: 'sb_ce_3',
    text: 'Ouço e levo em consideração as expectativas do meu parceiro',
    dimension: 'clear_expectations',
  },
  {
    id: 'sb_ce_4',
    text: 'Sou clara sobre o tipo de relacionamento que quero',
    dimension: 'clear_expectations',
  },
  {
    id: 'sb_ce_5',
    text: 'Não finjo sentimentos ou prometo coisas que não posso cumprir',
    dimension: 'clear_expectations',
  },
  {
    id: 'sb_ce_6',
    text: 'Comunico mudanças de sentimentos/situação de forma honesta',
    dimension: 'clear_expectations',
  },

  // emotional_safety (6 questions)
  {
    id: 'sb_es_1',
    text: 'Sinto-me segura com meu parceiro emocionalmente',
    dimension: 'emotional_safety',
  },
  {
    id: 'sb_es_2',
    text: 'Meu parceiro respeita meu consentimento completamente',
    dimension: 'emotional_safety',
  },
  {
    id: 'sb_es_3',
    text: 'Ele nunca me chantageou financeiramente por favores pessoais',
    dimension: 'emotional_safety',
  },
  {
    id: 'sb_es_4',
    text: 'Nunca senti-me pressurizada ou forçada neste relacionamento',
    dimension: 'emotional_safety',
  },
  {
    id: 'sb_es_5',
    text: 'Posso contar verdades difíceis sem medo de represálias',
    dimension: 'emotional_safety',
  },
  {
    id: 'sb_es_6',
    text: 'Sou tratada com respeito e nunca humilhada',
    dimension: 'emotional_safety',
  },

  // self_sufficiency (6 questions)
  {
    id: 'sb_ss_1',
    text: 'Tenho planos para meu futuro independente deste relacionamento',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sb_ss_2',
    text: 'Estou economizando/investindo em minha segurança financeira futura',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sb_ss_3',
    text: 'Tenho vida e amigos fora deste relacionamento',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sb_ss_4',
    text: 'Não dependo emocionalmente deste relacionamento para me sentir bem',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sb_ss_5',
    text: 'Trabalho/estudo/desenvolvimento pessoal é prioridade para mim',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sb_ss_6',
    text: 'Sou responsável por minhas escolhas e consequências',
    dimension: 'self_sufficiency',
  },
];

// Questões para SUGAR_MOMMY (relacionadas à dinâmica inversa)
const SUGAR_MOMMY_QUESTIONS: Question[] = [
  // emotional_maturity (6 questions)
  {
    id: 'sm_em_1',
    text: 'Consigo expressar minhas emoções sem ser agressiva ou manipuladora',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sm_em_2',
    text: 'Entendo que meu poder financeiro não me exime de responsabilidade emocional',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sm_em_3',
    text: 'Sou capaz de lidar com insegurança ou ciúme de forma madura',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sm_em_4',
    text: 'Reflito sobre minhas ações e seu impacto emocional no outro',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sm_em_5',
    text: 'Posso discutir conflitos sem derrotar verbalmente meu parceiro',
    dimension: 'emotional_maturity',
  },
  {
    id: 'sm_em_6',
    text: 'Reconheço meus limites emocionais e busco ajuda se necessário',
    dimension: 'emotional_maturity',
  },

  // respect_autonomy (6 questions)
  {
    id: 'sm_ra_1',
    text: 'Respeito a autonomia e decisões do meu parceiro',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sm_ra_2',
    text: 'Não uso dinheiro como forma de controle ou manipulação',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sm_ra_3',
    text: 'Apoio o parceiro em ter sua própria vida e ambições',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sm_ra_4',
    text: 'Entendo que sustento financeiro não implica posse',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sm_ra_5',
    text: 'Respeito a privacidade e não sou invasiva',
    dimension: 'respect_autonomy',
  },
  {
    id: 'sm_ra_6',
    text: 'Encorajo independência ao invés de dependência',
    dimension: 'respect_autonomy',
  },

  // clear_expectations (6 questions)
  {
    id: 'sm_ce_1',
    text: 'Comunico minhas expectativas de forma clara e respeitosa',
    dimension: 'clear_expectations',
  },
  {
    id: 'sm_ce_2',
    text: 'Sou honesta sobre limitações de meu investimento financeiro/emocional',
    dimension: 'clear_expectations',
  },
  {
    id: 'sm_ce_3',
    text: 'Ouço as expectativas do meu parceiro seriamente',
    dimension: 'clear_expectations',
  },
  {
    id: 'sm_ce_4',
    text: 'Deixo claro que não prometo exclusividade a menos que acordado',
    dimension: 'clear_expectations',
  },
  {
    id: 'sm_ce_5',
    text: 'Comunico mudanças de sentimentos ou planos de forma honesta',
    dimension: 'clear_expectations',
  },
  {
    id: 'sm_ce_6',
    text: 'Não faço promessas financeiras que não posso cumprir',
    dimension: 'clear_expectations',
  },

  // emotional_safety (6 questions)
  {
    id: 'sm_es_1',
    text: 'Meu parceiro se sente emocionalmente seguro comigo',
    dimension: 'emotional_safety',
  },
  {
    id: 'sm_es_2',
    text: 'Nunca chantagiei ou ameacei financeiramente',
    dimension: 'emotional_safety',
  },
  {
    id: 'sm_es_3',
    text: 'Respeito o consentimento e limites físicos completamente',
    dimension: 'emotional_safety',
  },
  {
    id: 'sm_es_4',
    text: 'Não sou agressiva verbalmente ou psicologicamente',
    dimension: 'emotional_safety',
  },
  {
    id: 'sm_es_5',
    text: 'Meu parceiro pode ser honesto sem medo de represálias financeiras',
    dimension: 'emotional_safety',
  },
  {
    id: 'sm_es_6',
    text: 'Meu parceiro não é humilhado ou desrespeitado por mim',
    dimension: 'emotional_safety',
  },

  // self_sufficiency (6 questions)
  {
    id: 'sm_ss_1',
    text: 'Tenho vida e interesses próprios além de relacionamentos',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sm_ss_2',
    text: 'Minha autoestima não depende completamente do meu parceiro',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sm_ss_3',
    text: 'Sou financeiramente autossuficiente e não preciso de validação pelo dinheiro',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sm_ss_4',
    text: 'Tenho amigos e círculo social além do meu parceiro',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sm_ss_5',
    text: 'Tenho carreira/objetivos profissionais importantes para mim',
    dimension: 'self_sufficiency',
  },
  {
    id: 'sm_ss_6',
    text: 'Sou responsável por minha saúde mental e bem-estar',
    dimension: 'self_sufficiency',
  },
];

// Define which questions belong to which dimension
export const ALL_QUESTIONS: Record<UserType, Question[]> = {
  [UserType.SUGAR_DADDY]: SUGAR_DADDY_QUESTIONS,
  [UserType.SUGAR_BABY]: SUGAR_BABY_QUESTIONS,
  [UserType.SUGAR_MOMMY]: SUGAR_MOMMY_QUESTIONS,
};

// Risk flags: detected based on dimension scores and specific answer patterns
export const RISK_FLAGS = {
  LOW_EMOTIONAL_MATURITY: 'low_emotional_maturity',
  DISRESPECT_AUTONOMY: 'disrespect_autonomy',
  UNCLEAR_EXPECTATIONS: 'unclear_expectations',
  POOR_EMOTIONAL_SAFETY: 'poor_emotional_safety',
  LOW_SELF_SUFFICIENCY: 'low_self_sufficiency',
  RED_FLAG_CONTROL: 'red_flag_control', // detected from specific questions
  RED_FLAG_MANIPULATION: 'red_flag_manipulation',
  RED_FLAG_SAFETY_CONCERN: 'red_flag_safety_concern',
};

export function getQuestionsForUserType(userType: UserType): Question[] {
  return ALL_QUESTIONS[userType] || [];
}

export function getQuestionById(userType: UserType, questionId: string): Question | undefined {
  const questions = getQuestionsForUserType(userType);
  return questions.find((q) => q.id === questionId);
}
