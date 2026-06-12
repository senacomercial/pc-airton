import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sugar Dream — Relacionamentos com Transparência e Segurança',
  description:
    'A plataforma de relacionamentos consensuais mais segura do Brasil. Verificação comportamental, reviews reais e moderação ativa 24h.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
