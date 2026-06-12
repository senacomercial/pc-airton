'use client';

import Link from 'next/link';
import { C, serif, sans } from '@/styles/theme';

const Wordmark = ({ size = 20 }: { size?: number }) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <span style={{ fontFamily: serif, fontSize: size, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
      Sugar
    </span>
    <em style={{ fontFamily: serif, fontSize: size + 2, color: C.gold, fontStyle: 'italic', marginLeft: 3 }}>
      Dream
    </em>
  </div>
);

const navLink = { fontSize: 13.5, color: C.fg50, cursor: 'pointer', fontWeight: 500 } as const;

const features = [
  {
    icon: '🧠',
    title: 'Questionário Comportamental',
    body: '30 perguntas que calculam seu Trust Score e detectam red flags antes do match.',
  },
  {
    icon: '♦',
    title: 'Match por Compatibilidade',
    body: 'Algoritmo que considera valores, expectativas e perfil comportamental. Veja o % de compatibilidade.',
  },
  {
    icon: '💬',
    title: 'Chat com Smart Warnings',
    body: 'Mensagens criptografadas com detecção automática de red flags e moderação ativa 24h.',
  },
];

const types = [
  { icon: '💎', name: 'Sugar Daddy', body: 'Ofereço experiências, suporte financeiro e momentos especiais para conexões genuínas.', price: 'R$99,90/mês', popular: false },
  { icon: '🌸', name: 'Sugar Baby', body: 'Busco conexões genuínas e relacionamentos consensuais com benefícios mútuos.', price: 'R$19,90/mês', popular: true },
  { icon: '👑', name: 'Sugar Mommy', body: 'Ofereço experiências únicas, suporte e companhia para momentos inesquecíveis.', price: 'R$99,90/mês', popular: false },
];

const stats = [
  { v: '15k+', l: 'Usuários Verificados' },
  { v: '4.8★', l: 'Avaliação Média' },
  { v: '98%', l: 'Se Sentem Seguros' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', overflowX: 'hidden' }}>
      <div style={{ minHeight: '100vh', background: '#000', animation: 'fadeIn 300ms ease-out' }}>
        {/* Sticky nav */}
        <nav
          style={{
            position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)',
            background: 'rgba(0,0,0,0.82)', borderBottom: `1px solid ${C.border06}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 60px', height: 68,
          }}
        >
          <Wordmark />
          <div style={{ display: 'flex', gap: 36 }}>
            <span style={navLink}>Como funciona</span>
            <span style={navLink}>Segurança</span>
            <span style={navLink}>Lives</span>
            <span style={navLink}>Planos</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/matches" style={{ height: 40, padding: '0 22px', background: 'transparent', border: `1.5px solid rgba(197,160,89,0.45)`, borderRadius: 3, color: C.gold, fontFamily: sans, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: 1, display: 'inline-flex', alignItems: 'center' }}>
              Entrar
            </Link>
            <Link href="/matches" style={{ height: 40, padding: '0 22px', background: C.gold, borderRadius: 3, color: '#000', fontFamily: sans, fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 1, display: 'inline-flex', alignItems: 'center' }}>
              Criar Conta
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 60px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', width: 900, height: 700, background: 'radial-gradient(ellipse,rgba(197,160,89,0.09) 0%,transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.goldTintSoft, border: '1px solid rgba(197,160,89,0.18)', borderRadius: 9999, padding: '7px 20px', marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.fg55, letterSpacing: '2.5px', textTransform: 'uppercase' }}>Verificado · Seguro · Consensual</span>
          </div>
          <div style={{ fontFamily: serif, fontSize: 76, fontWeight: 700, color: '#fff', lineHeight: 1.0, letterSpacing: '-2.5px', marginBottom: 28, maxWidth: 860, position: 'relative', zIndex: 1 }}>
            Relacionamentos com<br />
            <em style={{ color: C.gold, fontStyle: 'italic' }}>Transparência</em><br />
            e Segurança
          </div>
          <div style={{ fontSize: 17, color: C.fg42, lineHeight: 1.75, marginBottom: 52, maxWidth: 540, fontWeight: 400, position: 'relative', zIndex: 1 }}>
            A plataforma de relacionamentos consensuais mais segura do Brasil. Verificação comportamental, reviews reais e moderação ativa 24h.
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 72, position: 'relative', zIndex: 1 }}>
            <Link href="/matches" style={{ height: 56, padding: '0 44px', background: C.gold, borderRadius: 3, color: '#000', fontFamily: sans, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' }}>
              Criar Conta — Grátis
            </Link>
            <Link href="/matches" style={{ height: 56, padding: '0 44px', background: 'transparent', border: `1.5px solid ${C.borderGold}`, borderRadius: 3, color: C.gold, fontFamily: sans, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' }}>
              Ver Planos
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 80, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            {stats.map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: C.gold, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: C.fg30, marginTop: 6, letterSpacing: 1, textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: C.carbon, padding: '96px 60px', borderTop: `1px solid ${C.border06}` }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Como funciona</div>
              <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: '#fff' }}>Seguro do começo ao fim</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
              {features.map((f) => (
                <div key={f.title} style={{ background: C.graphite, border: `1px solid ${C.border}`, borderRadius: 8, padding: '36px 28px' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 8, background: C.goldTint, border: '1px solid rgba(197,160,89,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 24 }}>{f.icon}</div>
                  <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: C.fg42, lineHeight: 1.75 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type selector */}
        <div style={{ padding: '96px 60px', background: '#000' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>Para você</div>
              <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: '#fff' }}>Escolha seu perfil</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 52 }}>
              {types.map((t) => (
                <Link
                  key={t.name}
                  href="/matches"
                  style={{
                    background: C.graphite,
                    border: t.popular ? `1.5px solid ${C.borderGold}` : `1px solid ${C.border08}`,
                    borderRadius: 8, padding: '44px 32px', cursor: 'pointer', textAlign: 'center', position: 'relative', display: 'block',
                  }}
                >
                  {t.popular && (
                    <div style={{ position: 'absolute', top: -1, right: 28, background: C.gold, padding: '5px 16px', borderRadius: '0 0 8px 8px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#000', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Mais Popular</span>
                    </div>
                  )}
                  <div style={{ fontSize: 52, marginBottom: 20 }}>{t.icon}</div>
                  <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{t.name}</div>
                  <div style={{ fontSize: 14, color: C.fg38, lineHeight: 1.75, marginBottom: 24 }}>{t.body}</div>
                  <div style={{ fontSize: 13, color: 'rgba(197,160,89,0.6)', fontWeight: 600 }}>{t.price}</div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/matches" style={{ height: 58, padding: '0 64px', background: C.gold, borderRadius: 3, color: '#000', fontFamily: sans, fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' }}>
                Começar Agora — É Grátis
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: C.carbon, borderTop: `1px solid ${C.border06}`, padding: '36px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark size={18} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© 2025 Sugar Dream. Todos os direitos reservados.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ fontSize: 12, color: C.fg28, cursor: 'pointer' }}>Termos</span>
            <span style={{ fontSize: 12, color: C.fg28, cursor: 'pointer' }}>Privacidade</span>
            <span style={{ fontSize: 12, color: C.fg28, cursor: 'pointer' }}>Suporte</span>
          </div>
        </div>
      </div>
    </div>
  );
}
