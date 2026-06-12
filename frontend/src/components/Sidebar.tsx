'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { C, serif, sans } from '@/styles/theme';

const NAV = [
  { icon: '♦', label: 'Matches', href: '/matches' },
  { icon: '✉', label: 'Conversas', href: '/chat', badge: '3' },
  { icon: '◉', label: 'Meu Perfil', href: '/profile' },
  { icon: '▷', label: 'Lives', href: '/lives' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const item = (icon: string, label: string, href: string, danger?: boolean, badge?: string) => {
    const active = pathname === href || (href !== '/matches' && pathname.startsWith(href));
    return (
      <Link
        key={href}
        href={href}
        style={{
          display: 'flex', alignItems: 'center', gap: 11, padding: '11px 24px', cursor: 'pointer',
          background: active ? C.goldTintSoft : 'transparent',
          borderLeft: `3px solid ${active ? C.gold : 'transparent'}`,
          color: danger
            ? (active ? C.red : 'rgba(204,0,0,0.55)')
            : (active ? C.gold : C.fg42),
          transition: 'all 180ms',
        }}
      >
        <span style={{ fontSize: 15, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, letterSpacing: '0.2px', fontFamily: sans }}>{label}</span>
        {badge && (
          <div style={{ marginLeft: 'auto', background: C.orange, borderRadius: 9999, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{badge}</span>
          </div>
        )}
      </Link>
    );
  };

  return (
    <div style={{ width: 230, minHeight: '100vh', background: C.carbon, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '22px 24px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Sugar</span>
          <em style={{ fontFamily: serif, fontSize: 22, color: C.gold, fontStyle: 'italic', marginLeft: 3 }}>Dream</em>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ paddingTop: 10, flex: 1 }}>
        {NAV.map((n) => item(n.icon, n.label, n.href, false, n.badge))}
        <div style={{ height: 1, background: C.border06, margin: '10px 24px' }} />
        {item('⚠', 'Moderação', '/moderation', true)}
      </nav>

      {/* User card */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1A1A2E,#C5A059)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: serif, fontSize: 15, fontWeight: 700, color: '#fff' }}>J</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', fontFamily: serif }}>João</div>
          <div style={{ fontSize: 11, color: C.gold, fontFamily: sans, marginTop: 1 }}>★ Trust Score: 87</div>
        </div>
      </div>
    </div>
  );
}
