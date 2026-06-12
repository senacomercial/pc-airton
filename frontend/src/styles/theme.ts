/**
 * Tokens de design do Sugar Dream — extraídos do brandbook Sena DS
 * (colors_and_type.css) e dos estilos inline do protótipo "Sugar Dream Web".
 * Mantidos como constantes para fidelidade pixel-perfect entre as telas.
 */
export const C = {
  // Estrutura
  black: '#000000',
  carbon: '#0A0A0A',
  graphite: '#111111',
  graphite2: '#1A1A1A',
  contentBg: '#050505',
  panelBg: '#080808',

  // Destaque
  gold: '#C5A059',
  goldLight: '#D9B977',
  orange: '#E85D04',
  red: '#CC0000',
  amber: '#F39C12',
  green: '#27AE60',

  white: '#ffffff',

  // Foreground com alpha (usados literalmente no protótipo)
  fg88: 'rgba(255,255,255,0.88)',
  fg82: 'rgba(255,255,255,0.82)',
  fg72: 'rgba(255,255,255,0.72)',
  fg58: 'rgba(255,255,255,0.58)',
  fg55: 'rgba(255,255,255,0.55)',
  fg50: 'rgba(255,255,255,0.5)',
  fg45: 'rgba(255,255,255,0.45)',
  fg42: 'rgba(255,255,255,0.42)',
  fg40: 'rgba(255,255,255,0.4)',
  fg38: 'rgba(255,255,255,0.38)',
  fg32: 'rgba(255,255,255,0.32)',
  fg30: 'rgba(255,255,255,0.3)',
  fg28: 'rgba(255,255,255,0.28)',
  fg22: 'rgba(255,255,255,0.22)',
  fg20: 'rgba(255,255,255,0.2)',
  fg18: 'rgba(255,255,255,0.18)',

  // Bordas
  border: 'rgba(255,255,255,0.07)',
  border06: 'rgba(255,255,255,0.06)',
  border08: 'rgba(255,255,255,0.08)',
  border10: 'rgba(255,255,255,0.1)',
  borderGold: 'rgba(197,160,89,0.4)',

  // Tints
  goldTint: 'rgba(197,160,89,0.1)',
  goldTintSoft: 'rgba(197,160,89,0.07)',
  goldTint13: 'rgba(197,160,89,0.13)',
  greenTint: 'rgba(39,174,96,0.1)',
  orangeTint: 'rgba(232,93,4,0.1)',
  redTint: 'rgba(204,0,0,0.12)',
  amberTint: 'rgba(243,156,18,0.08)',
} as const;

export const serif = "'Playfair Display', Georgia, serif";
export const sans = "'Montserrat', 'Helvetica Neue', system-ui, sans-serif";

// Gradientes de avatar usados nos cards (placeholder de foto)
export const avatarGradients: Record<string, string> = {
  F: 'linear-gradient(135deg,#1A1A2E 0%,#2D1B69 100%)',
  S: 'linear-gradient(135deg,#0D2B1A 0%,#1B5E20 100%)',
  A: 'linear-gradient(135deg,#2E0D0D 0%,#7B1A1A 100%)',
  L: 'linear-gradient(135deg,#1A0F2E 0%,#4A2B6B 100%)',
  B: 'linear-gradient(135deg,#0A2E2A 0%,#00695C 100%)',
  C: 'linear-gradient(135deg,#2E1A0D 0%,#7B4000 100%)',
  M: 'linear-gradient(135deg,#0A1A2E 0%,#003B7B 100%)',
  J: 'linear-gradient(135deg,#1A2E0A 0%,#3D6B00 100%)',
};

export function gradientFor(name: string): string {
  const k = (name?.[0] || 'F').toUpperCase();
  return avatarGradients[k] || avatarGradients.F;
}
