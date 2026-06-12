'use client';

import { useRouter } from 'next/navigation';
import { C, serif, sans } from '@/styles/theme';

const dimensions = [
  { label: 'Respeito', value: 94 },
  { label: 'Comunicação', value: 91 },
  { label: 'Honestidade', value: 89 },
  { label: 'Discrição', value: 96 },
];

const reviews = [
  { author: 'Usuário Anônimo · 2 semanas atrás', text: 'Excelente comunicação, muito respeitosa e transparente desde o início.' },
  { author: 'R.M. · 1 mês atrás', text: 'Ótima companhia, inteligente e divertida. Recomendo muito.' },
];

const overline = { fontSize: 10, fontWeight: 700, color: C.fg22, letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: 10 };

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 200ms ease-out', maxWidth: 1100 }}>
      <button onClick={() => router.push('/matches')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: C.fg40, fontSize: 13, cursor: 'pointer', fontFamily: sans, fontWeight: 500, marginBottom: 28, padding: 0 }}>
        ← Voltar aos Matches
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 36 }}>
        {/* Left: photo + actions */}
        <div>
          <div style={{ height: 440, background: 'linear-gradient(135deg,#1A1A2E 0%,#2D1B69 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16 }}>
            <span style={{ fontFamily: serif, fontSize: 120, color: C.fg30, fontStyle: 'italic' }}>F</span>
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9999, padding: '6px 14px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
              <span style={{ fontSize: 12, color: C.fg82, fontWeight: 500 }}>Online agora</span>
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(197,160,89,0.92)', borderRadius: 9999, padding: '5px 14px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>94% compat.</span>
            </div>
          </div>
          <button onClick={() => router.push('/chat')} style={{ width: '100%', height: 52, background: C.gold, border: 'none', borderRadius: 4, color: '#000', fontFamily: sans, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            Iniciar Chat
          </button>
          <button style={{ width: '100%', height: 44, background: 'transparent', border: '1px solid rgba(204,0,0,0.35)', borderRadius: 4, color: 'rgba(204,0,0,0.7)', fontFamily: sans, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
            Denunciar Perfil
          </button>
        </div>

        {/* Right: info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1.0, marginBottom: 6 }}>Fernanda</div>
              <div style={{ fontSize: 14, color: C.fg38 }}>24 anos · São Paulo, SP · Sugar Baby</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: C.goldTint, border: '1px solid rgba(197,160,89,0.25)', borderRadius: 8, padding: '12px 20px', textAlign: 'center' }}>
              <span style={{ fontFamily: serif, fontSize: 32, fontWeight: 700, color: C.gold, lineHeight: 1 }}>87</span>
              <span style={{ fontSize: 9, color: C.fg30, letterSpacing: '1.5px', marginTop: 4, textTransform: 'uppercase' }}>Trust Score</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.green, background: C.greenTint, border: '1px solid rgba(39,174,96,0.2)', borderRadius: 9999, padding: '4px 12px' }}>✓ Perfil Verificado</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.gold, background: C.goldTint, border: '1px solid rgba(197,160,89,0.2)', borderRadius: 9999, padding: '4px 12px' }}>★ 4.9 · 23 reviews</span>
            <span style={{ fontSize: 11, color: C.fg45, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border08}`, borderRadius: 9999, padding: '4px 12px' }}>Top 5% Sugar Baby</span>
            <span style={{ fontSize: 11, color: C.fg45, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border08}`, borderRadius: 9999, padding: '4px 12px' }}>Membro desde 2024</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={overline}>Sobre mim</div>
            <div style={{ fontSize: 14.5, color: C.fg58, lineHeight: 1.8 }}>
              Estudante de medicina, apaixonada por viagens e gastronomia. Busco conexões genuínas e transparentes. Valorizo respeito mútuo, comunicação aberta e honestidade acima de tudo.
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ ...overline, marginBottom: 14 }}>Dimensões de Confiança</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {dimensions.map((d) => (
                <div key={d.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, color: C.fg50 }}>{d.label}</span>
                    <span style={{ fontSize: 12.5, color: C.gold, fontWeight: 700 }}>{d.value}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                    <div style={{ width: `${d.value}%`, height: '100%', background: C.gold, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ ...overline, marginBottom: 14 }}>Reviews Recentes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reviews.map((r) => (
                <div key={r.author} style={{ background: C.graphite, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: C.fg32 }}>{r.author}</span>
                    <span style={{ color: C.gold, fontSize: 13 }}>★★★★★</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: C.fg55, lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{r.text}&rdquo;</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
