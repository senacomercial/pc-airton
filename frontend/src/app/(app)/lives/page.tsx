'use client';

import { C, serif, sans } from '@/styles/theme';

const filters = [
  { label: 'Próximas', active: true },
  { label: 'Gravadas', active: false },
  { label: 'Meus Certificados', active: false },
];

const lives = [
  { letter: 'D', grad: 'linear-gradient(135deg,#0A2E1A,#1B5E20)', live: true, title: 'Red Flags Financeiras', meta: 'Dra. Camila Santos · Hoje 20h00 · 247 inscritos', cta: 'Entrar na Live', ctaPrimary: true, border: 'rgba(232,93,4,0.25)' },
  { letter: 'R', grad: 'linear-gradient(135deg,#1A0A2E,#3D1B69)', live: false, title: 'Limites Saudáveis', meta: 'Rafael M. · Quinta 19h00 · 183 inscritos', cta: 'Registrar', ctaPrimary: false, border: C.border },
  { letter: 'A', grad: 'linear-gradient(135deg,#2E1A0A,#7B3B00)', live: false, title: 'Comunicação Não-Violenta', meta: 'Ana Paula · Sexta 18h00 · 129 inscritos', cta: 'Registrar', ctaPrimary: false, border: C.border },
];

export default function LivesPage() {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 200ms ease-out' }}>
      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {filters.map((f) => (
            <div
              key={f.label}
              style={{
                padding: '7px 18px', borderRadius: 9999, cursor: 'pointer',
                background: f.active ? 'rgba(197,160,89,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${f.active ? 'rgba(197,160,89,0.3)' : C.border08}`,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: f.active ? C.gold : C.fg38 }}>{f.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: C.orangeTint, border: '1px solid rgba(232,93,4,0.25)', borderRadius: 9999, padding: '6px 16px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange, animation: 't1 1s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.orange }}>1 AO VIVO agora</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
        {lives.map((l) => (
          <div key={l.title} style={{ background: C.graphite, border: `1px solid ${l.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 140, background: l.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: serif, fontSize: 56, color: C.fg40, fontStyle: 'italic' }}>{l.letter}</span>
              {l.live && (
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(232,93,4,0.9)', borderRadius: 9999, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 't1 1s infinite' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>AO VIVO</span>
                </div>
              )}
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{l.title}</div>
              <div style={{ fontSize: 12.5, color: C.fg40, marginBottom: 14 }}>{l.meta}</div>
              <button
                style={{
                  width: '100%', height: 38, borderRadius: 4, fontFamily: sans, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '1.5px', textTransform: 'uppercase',
                  ...(l.ctaPrimary
                    ? { background: C.orange, border: 'none', color: '#fff' }
                    : { background: 'transparent', border: `1.5px solid ${C.borderGold}`, color: C.gold }),
                }}
              >
                {l.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
