'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { C, serif, sans } from '@/styles/theme';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('joao.daddy@demo.com');
  const [password, setPassword] = useState('Demo@1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/matches');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginBottom: 40 }}>
            <span style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Sugar</span>
            <em style={{ fontFamily: serif, fontSize: 30, color: C.gold, fontStyle: 'italic', marginLeft: 3 }}>Dream</em>
          </div>
          <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Entrar</h1>
          <p style={{ fontSize: 14, color: C.fg50, margin: 0 }}>Acesse sua conta para ver matches</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.fg72, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: 44,
                background: C.graphite,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: '0 14px',
                color: '#fff',
                fontFamily: sans,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.fg72, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                height: 44,
                background: C.graphite,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: '0 14px',
                color: '#fff',
                fontFamily: sans,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
              placeholder="••••••••"
            />
          </div>

          {error && <div style={{ fontSize: 13, color: C.red, background: 'rgba(204,0,0,0.08)', border: `1px solid ${C.red}33`, padding: '10px 12px', borderRadius: 4 }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 48,
              background: loading ? C.fg50 : C.gold,
              border: 'none',
              borderRadius: 4,
              color: '#000',
              fontFamily: sans,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Demo notice */}
        <div style={{ marginTop: 32, padding: 12, background: C.goldTint, border: `1px solid ${C.borderGold}`, borderRadius: 6, fontSize: 12, color: C.fg72, lineHeight: 1.6, textAlign: 'center' }}>
          Demo: use <code style={{ background: C.graphite, padding: '2px 6px', borderRadius: 3, fontSize: 11, fontFamily: 'monospace', color: C.gold }}>joao.daddy@demo.com</code> / <code style={{ background: C.graphite, padding: '2px 6px', borderRadius: 3, fontSize: 11, fontFamily: 'monospace', color: C.gold }}>Demo@1234</code>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: C.gold, fontWeight: 600, textDecoration: 'none' }}>
            ← Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
