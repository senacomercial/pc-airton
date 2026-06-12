'use client';

import { usePathname } from 'next/navigation';
import { C, serif } from '@/styles/theme';

const TITLES: Record<string, string> = {
  '/matches': 'Seus Matches',
  '/profile': 'Perfil Detalhado',
  '/chat': 'Mensagens',
  '/moderation': 'Moderação',
  '/lives': 'Lives & Educação',
};

export default function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? '';

  return (
    <div style={{ height: 60, background: C.carbon, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 700, color: '#fff' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: 19 }}>🔔</span>
          <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: C.orange, borderRadius: '50%', border: `1.5px solid ${C.carbon}` }} />
        </div>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1A1A2E,#C5A059)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span style={{ fontFamily: serif, fontSize: 14, fontWeight: 700, color: '#fff' }}>J</span>
        </div>
      </div>
    </div>
  );
}
