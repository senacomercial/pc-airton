'use client';

import { C, serif, sans } from '@/styles/theme';

const COLS = '40px 200px 1fr 120px 100px 140px 180px';

const stats = [
  { label: 'Total', value: '24', sub: 'pendentes de revisão', color: '#fff', border: C.border },
  { label: 'Alta Urgência', value: '3', sub: 'requer ação imediata', color: C.red, border: 'rgba(204,0,0,0.2)' },
  { label: 'Média Urgência', value: '9', sub: 'responder em 24h', color: C.amber, border: 'rgba(243,156,18,0.2)' },
  { label: 'Baixa Urgência', value: '12', sub: 'responder em 7 dias', color: C.fg50, border: C.border },
];

const headCell = { fontSize: 10, fontWeight: 700, color: C.fg30, letterSpacing: '1.5px', textTransform: 'uppercase' as const };

function Btn({ children, variant }: { children: string; variant: 'danger' | 'warn' | 'neutral' }) {
  const styles = {
    danger: { background: C.redTint, border: '1px solid rgba(204,0,0,0.35)', color: C.red, fontWeight: 700 },
    warn: { background: C.amberTint, border: '1px solid rgba(243,156,18,0.3)', color: C.amber, fontWeight: 700 },
    neutral: { background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border10}`, color: C.fg40, fontWeight: 400 },
  }[variant];
  return (
    <button style={{ height: 30, padding: '0 12px', borderRadius: 4, fontFamily: sans, fontSize: 10.5, cursor: 'pointer', letterSpacing: '0.5px', ...styles }}>
      {children}
    </button>
  );
}

function Badge({ level }: { level: 'ALTA' | 'MÉDIA' | 'BAIXA' }) {
  const map = {
    ALTA: { color: C.red, background: 'rgba(204,0,0,0.12)', border: 'rgba(204,0,0,0.3)' },
    'MÉDIA': { color: C.amber, background: 'rgba(243,156,18,0.1)', border: 'rgba(243,156,18,0.3)' },
    BAIXA: { color: C.fg40, background: 'rgba(255,255,255,0.05)', border: C.border10 },
  }[level];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: map.color, background: map.background, border: `1px solid ${map.border}`, borderRadius: 9999, padding: '3px 10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
      {level}
    </span>
  );
}

const rows = [
  { letter: 'F', grad: 'linear-gradient(135deg,#2E1A1A,#7B1A1A)', name: 'Felipe M.', id: '#MOD-041', type: 'Assédio Sexual', score: 23, scoreColor: C.red, level: 'ALTA' as const, time: '2h atrás', leftBorder: C.red, actions: [['Ban', 'danger'], ['Suspender', 'warn'], ['Review', 'neutral']] },
  { letter: 'C', grad: 'linear-gradient(135deg,#1A1A0A,#3D3300)', name: 'Carlos K.', id: '#MOD-040', type: 'Mensagens Inapropriadas', score: 51, scoreColor: C.amber, level: 'MÉDIA' as const, time: '5h atrás', leftBorder: C.amber, actions: [['Advertir', 'warn'], ['Dismiss', 'neutral']] },
  { letter: 'A', grad: 'linear-gradient(135deg,#0D1A2E,#1A3A6B)', name: 'Ana T.', id: '#MOD-039', type: 'Perfil Suspeito', score: 68, scoreColor: C.fg50, level: 'BAIXA' as const, time: '1 dia atrás', leftBorder: 'rgba(255,255,255,0.15)', actions: [['Investigar', 'neutral'], ['Dismiss', 'neutral']] },
];

export default function ModerationPage() {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 200ms ease-out' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: C.graphite, border: `1px solid ${s.border}`, borderRadius: 8, padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.fg30, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: serif, fontSize: 36, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.fg28, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.carbon, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '12px 20px', borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.02)' }}>
          <div />
          <div style={headCell}>Reportado</div>
          <div style={headCell}>Tipo</div>
          <div style={headCell}>Trust Score</div>
          <div style={headCell}>Urgência</div>
          <div style={headCell}>Tempo</div>
          <div style={headCell}>Ações</div>
        </div>

        {rows.map((r, i) => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: COLS, padding: '16px 20px', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', borderLeft: `3px solid ${r.leftBorder}`, alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>{r.letter}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{r.name}</div>
              <div style={{ fontSize: 11, color: C.fg30 }}>{r.id}</div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{r.type}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: r.scoreColor }}>{r.score}</div>
            <div><Badge level={r.level} /></div>
            <div style={{ fontSize: 12, color: C.fg38 }}>{r.time}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {r.actions.map(([label, v]) => (
                <Btn key={label} variant={v as 'danger' | 'warn' | 'neutral'}>{label}</Btn>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
