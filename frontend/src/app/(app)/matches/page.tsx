'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { C, serif, sans, gradientFor } from '@/styles/theme';
import { fetchMatches, MatchCandidate } from '@/lib/api';

// Dados de demonstração — espelham o protótipo e servem de fallback caso a API
// não esteja disponível (ex.: backend ainda não iniciado).
const DEMO: (MatchCandidate & { rating: number; verified: boolean; online: boolean })[] = [
  { userId: '1', firstName: 'Fernanda', age: 24, city: 'São Paulo', compatibilityScore: 94, rating: 4.9, verified: true, online: true },
  { userId: '2', firstName: 'Sofia', age: 27, city: 'Rio de Janeiro', compatibilityScore: 89, rating: 4.7, verified: false, online: false },
  { userId: '3', firstName: 'Ana', age: 22, city: 'Belo Horizonte', compatibilityScore: 91, rating: 4.8, verified: true, online: true },
  { userId: '4', firstName: 'Luiza', age: 25, city: 'São Paulo', compatibilityScore: 87, rating: 4.6, verified: false, online: false },
  { userId: '5', firstName: 'Bianca', age: 23, city: 'Curitiba', compatibilityScore: 85, rating: 4.5, verified: true, online: true },
  { userId: '6', firstName: 'Carolina', age: 28, city: 'Salvador', compatibilityScore: 82, rating: 4.4, verified: false, online: false },
  { userId: '7', firstName: 'Marina', age: 26, city: 'Brasília', compatibilityScore: 80, rating: 4.3, verified: false, online: true },
  { userId: '8', firstName: 'Juliana', age: 29, city: 'Porto Alegre', compatibilityScore: 78, rating: 4.2, verified: true, online: false },
];

const TABS = [
  { label: 'Para Você', key: 'para-voce' },
  { label: 'Próximos', key: 'proximos' },
  { label: 'Novos', key: 'novos' },
  { label: 'Destaque', key: 'destaque' },
];

type Card = MatchCandidate & { rating?: number; verified?: boolean; online?: boolean };

export default function MatchesPage() {
  const router = useRouter();
  const [tab, setTab] = useState('para-voce');
  const [cards, setCards] = useState<Card[]>(DEMO);

  useEffect(() => {
    // Tenta a API real; mantém o fallback de demonstração em caso de erro.
    fetchMatches()
      .then((r) => { if (r?.matches?.length) setCards(r.matches); })
      .catch(() => { /* mantém DEMO */ });
  }, []);

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 200ms ease-out' }}>
      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ flex: 1, maxWidth: 400, height: 44, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border08}`, borderRadius: 22, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10 }}>
          <span style={{ color: C.fg22, fontSize: 15 }}>🔍</span>
          <span style={{ fontSize: 13.5, color: C.fg18 }}>Buscar perfis, cidades, interesses...</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '7px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 600, fontFamily: sans,
                  cursor: 'pointer', transition: 'all 180ms', whiteSpace: 'nowrap',
                  border: `1px solid ${active ? 'rgba(197,160,89,0.3)' : C.border08}`,
                  background: active ? C.goldTint : 'transparent',
                  color: active ? C.gold : C.fg38, letterSpacing: '0.5px',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.2)', borderRadius: 9999, padding: '6px 16px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>247 online agora</span>
        </div>
      </div>

      {/* Match grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {cards.map((m) => (
          <div
            key={m.userId}
            onClick={() => router.push('/profile')}
            style={{ background: C.graphite, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 200ms' }}
          >
            <div style={{ height: 180, background: gradientFor(m.firstName), display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: serif, fontSize: 64, color: C.fg40, fontStyle: 'italic' }}>{m.firstName[0]}</span>
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(197,160,89,0.92)', borderRadius: 9999, padding: '3px 10px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#000' }}>{Math.round(m.compatibilityScore)}%</span>
              </div>
              {m.online && (
                <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
                  <span style={{ fontSize: 11, color: C.fg72 }}>Online</span>
                </div>
              )}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{m.firstName}</div>
              <div style={{ fontSize: 12, color: C.fg32, marginBottom: 8 }}>{m.age} anos · {m.city}</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {m.rating != null && (
                  <span style={{ fontSize: 10, color: C.gold, background: C.goldTint, borderRadius: 9999, padding: '2px 9px', fontWeight: 500 }}>★ {m.rating.toFixed(1)}</span>
                )}
                {m.verified && (
                  <span style={{ fontSize: 10, color: C.green, background: C.greenTint, borderRadius: 9999, padding: '2px 9px', fontWeight: 500 }}>✓ Verificada</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
