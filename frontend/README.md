# Sugar Dream — Frontend Web

Frontend Next.js (App Router + TypeScript) que recria fielmente o design
**"Sugar Dream Web"** do Claude Design (estilo Sena DS dark luxury: preto
asfalto, dourado pódio `#C5A059`, laranja ignição `#E85D04`, Playfair Display +
Montserrat).

## Telas implementadas

| Rota | Tela |
|------|------|
| `/` | **Landing** — nav, hero, "Como funciona", seletor de perfil (Daddy/Baby/Mommy), footer |
| `/matches` | **Dashboard / Matches** — grid 4 colunas com % de compatibilidade, filtros, status online |
| `/profile` | **Perfil detalhado** — foto, trust score, dimensões de confiança, reviews |
| `/chat` | **Chat** — lista de conversas + thread com **Smart Warning** financeiro |
| `/moderation` | **Moderação** — stats por urgência + fila de denúncias com ações |
| `/lives` | **Lives** — grid de webinars com badge "AO VIVO" |

O shell autenticado (sidebar + topbar) fica em `src/app/(app)/layout.tsx`.

## Design tokens

Centralizados em `src/styles/theme.ts` (cores, fontes, gradientes de avatar),
derivados de `colors_and_type.css` do brandbook e dos estilos do protótipo.

## Integração com a API

`src/lib/api.ts` consome o backend NestJS. Em dev, as chamadas passam pelo
rewrite `/backend/*` → `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3000`),
evitando CORS. A tela de Matches já busca `GET /api/v1/matches` e usa dados de
demonstração como fallback quando o backend não está no ar.

## Rodar

```bash
npm install
npm run dev      # http://localhost:4000
```

Para conectar ao backend, suba a API (`cd ../backend && npm run start:dev`) e,
se necessário, defina `NEXT_PUBLIC_API_URL`.
