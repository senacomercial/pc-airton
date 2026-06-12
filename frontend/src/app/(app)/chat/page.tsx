'use client';

import { C, serif } from '@/styles/theme';

function Avatar({ letter, size, gradient }: { letter: string; size: number; gradient: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: serif, fontSize: size * 0.42, color: C.fg72, fontStyle: 'italic' }}>{letter}</span>
    </div>
  );
}

function OnlineDot() {
  return <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, background: C.green, borderRadius: '50%', border: `1.5px solid ${C.panelBg}` }} />;
}

const FGRAD = 'linear-gradient(135deg,#1A1A2E,#2D1B69)';

export default function ChatPage() {
  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden', animation: 'fadeIn 200ms ease-out' }}>
      {/* Conversations list */}
      <div style={{ width: 300, borderRight: `1px solid ${C.border06}`, display: 'flex', flexDirection: 'column', background: C.panelBg, flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 12px', borderBottom: `1px solid ${C.border06}` }}>
          <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Conversas</div>
          <div style={{ height: 36, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 18, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 7 }}>
            <span style={{ color: C.fg20, fontSize: 12 }}>🔍</span>
            <span style={{ fontSize: 12, color: C.fg18 }}>Buscar...</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Active */}
          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', background: C.goldTintSoft, borderLeft: `2px solid ${C.gold}` }}>
            <div style={{ position: 'relative', flexShrink: 0 }}><Avatar letter="F" size={44} gradient={FGRAD} /><OnlineDot /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', fontFamily: serif }}>Fernanda</span>
                <span style={{ fontSize: 10.5, color: C.fg28 }}>14:32</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, color: C.fg38, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>Adorei a sugestão 😊</span>
                <div style={{ background: C.orange, borderRadius: 9999, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>3</span>
                </div>
              </div>
            </div>
          </div>
          {/* Sofia */}
          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ flexShrink: 0 }}><Avatar letter="S" size={44} gradient="linear-gradient(135deg,#0D2B1A,#1B5E20)" /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.fg82, fontFamily: serif }}>Sofia</span>
                <span style={{ fontSize: 10.5, color: C.fg28 }}>Ontem</span>
              </div>
              <span style={{ fontSize: 11.5, color: C.fg28 }}>Você: Combinado 👍</span>
            </div>
          </div>
          {/* Ana */}
          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}><Avatar letter="A" size={44} gradient="linear-gradient(135deg,#2E0D0D,#7B1A1A)" /><OnlineDot /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.fg82, fontFamily: serif }}>Ana</span>
                <span style={{ fontSize: 10.5, color: C.fg28 }}>Terça</span>
              </div>
              <span style={{ fontSize: 11.5, color: C.fg28 }}>Adorei conversar...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '0 24px', height: 64, borderBottom: `1px solid ${C.border06}`, display: 'flex', alignItems: 'center', gap: 14, background: C.panelBg, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}><Avatar letter="F" size={40} gradient={FGRAD} /><OnlineDot /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: '#fff' }}>Fernanda</div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 500 }}>Online agora · Trust Score 87</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border08}`, borderRadius: 6, padding: '7px 14px' }}>
            <span style={{ fontSize: 12, color: C.fg50 }}>Ver Perfil</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <span style={{ fontSize: 11, color: C.fg20, background: 'rgba(255,255,255,0.04)', padding: '4px 14px', borderRadius: 9999 }}>Hoje · 14:20</span>
          </div>

          {/* Them */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: '60%', marginBottom: 8 }}>
            <Avatar letter="F" size={32} gradient={FGRAD} />
            <div style={{ background: C.graphite2, border: `1px solid ${C.border}`, borderRadius: '14px 14px 14px 3px', padding: '12px 16px' }}>
              <div style={{ fontSize: 14, color: C.fg82, lineHeight: 1.5 }}>Olá! Vi seu perfil e fiquei muito interessada 😊</div>
              <div style={{ fontSize: 10, color: C.fg20, marginTop: 5 }}>14:20</div>
            </div>
          </div>

          {/* Me */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <div style={{ background: C.goldTint13, border: '1px solid rgba(197,160,89,0.22)', borderRadius: '14px 14px 3px 14px', padding: '12px 16px', maxWidth: '55%' }}>
              <div style={{ fontSize: 14, color: C.fg88, lineHeight: 1.5 }}>Olá Fernanda! Seu perfil é incrível. Gostaria de te conhecer ✨</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 5, textAlign: 'right' }}>14:22 ✓✓</div>
            </div>
          </div>

          {/* Them + Smart Warning */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, maxWidth: '60%', marginBottom: 8 }}>
            <Avatar letter="F" size={32} gradient={FGRAD} />
            <div>
              <div style={{ background: C.graphite2, border: `1px solid ${C.border}`, borderRadius: '14px 14px 14px 3px', padding: '12px 16px', marginBottom: 6 }}>
                <div style={{ fontSize: 14, color: C.fg82, lineHeight: 1.5 }}>Posso te transferir R$500 antes de nos encontrarmos?</div>
                <div style={{ fontSize: 10, color: C.fg20, marginTop: 5 }}>14:28</div>
              </div>
              <div style={{ background: C.amberTint, border: '1px solid rgba(243,156,18,0.3)', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 8, maxWidth: 480 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                <span style={{ fontSize: 12, color: 'rgba(243,156,18,0.9)', lineHeight: 1.6 }}>
                  Aviso financeiro detectado nesta mensagem. Tenha cuidado com transferências antes de se conhecer pessoalmente.
                </span>
              </div>
            </div>
          </div>

          {/* Me */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <div style={{ background: C.goldTint13, border: '1px solid rgba(197,160,89,0.22)', borderRadius: '14px 14px 3px 14px', padding: '12px 16px', maxWidth: '55%' }}>
              <div style={{ fontSize: 14, color: C.fg88, lineHeight: 1.5 }}>Prefiro que nos conheçamos antes 🙏</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 5, textAlign: 'right' }}>14:30 ✓✓</div>
            </div>
          </div>

          {/* Typing */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <Avatar letter="F" size={32} gradient={FGRAD} />
            <div style={{ background: C.graphite2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: 't1 1.2s ease-in-out infinite' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: 't2 1.2s ease-in-out infinite' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, animation: 't3 1.2s ease-in-out infinite' }} />
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div style={{ padding: '14px 24px 18px', borderTop: `1px solid ${C.border06}`, background: C.panelBg, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.fg40, fontSize: 18, flexShrink: 0 }}>+</div>
          <div style={{ flex: 1, height: 44, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border08}`, borderRadius: 22, display: 'flex', alignItems: 'center', padding: '0 18px' }}>
            <span style={{ fontSize: 13.5, color: C.fg18 }}>Mensagem para Fernanda...</span>
          </div>
          <button style={{ width: 44, height: 44, borderRadius: '50%', background: C.gold, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M16 9L2 2l3.5 7L2 16 16 9z" fill="#000" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
