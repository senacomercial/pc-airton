/**
 * Smart warnings — detecta tentativas de troca de dados financeiros no chat.
 * Avisa (não bloqueia). Conteúdo não é armazenado para esse fim.
 */

export interface SmartWarningResult {
  hasRisk: boolean;
  message?: string;
  shouldBlock: boolean;
}

const WARNING_MESSAGE =
  '⚠️ Não compartilhe dados bancários pelo chat. Golpistas usam esse canal — combine pagamentos por meios seguros.';

/** Valida número de cartão pelo algoritmo de Luhn. */
function isValidLuhn(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function checkForFinancialData(message: string): SmartWarningResult {
  // CPF: 000.000.000-00 ou 11 dígitos seguidos
  const cpfPattern = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;

  // Cartão: sequências de 13-19 dígitos com separadores opcionais → validar Luhn
  const cardCandidate = message.match(/\b(?:\d[ -]?){13,19}\b/);

  // Palavras-chave bancárias / PIX
  const bankingKeywords =
    /\b(banco|ag[eê]ncia|conta corrente|pix|transfer[eê]ncia|dep[oó]sito|chave pix)\b/i;

  if (cpfPattern.test(message)) {
    return { hasRisk: true, message: WARNING_MESSAGE, shouldBlock: false };
  }

  if (cardCandidate && isValidLuhn(cardCandidate[0])) {
    return { hasRisk: true, message: WARNING_MESSAGE, shouldBlock: false };
  }

  if (bankingKeywords.test(message)) {
    return { hasRisk: true, message: WARNING_MESSAGE, shouldBlock: false };
  }

  return { hasRisk: false, shouldBlock: false };
}
