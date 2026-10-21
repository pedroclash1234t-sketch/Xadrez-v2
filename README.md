# Midnight Chess

Xadrez para dois jogadores no mesmo aparelho, no navegador (computador e celular), com relógios,
histórico e partidas salvas. Regras oficiais via chess.js, tabuleiro via Chessground.

## Como rodar

Requer Node 22+ (os scripts de teste usam padrões glob do `node --test`).

```bash
npm install
npm run dev        # http://localhost:5173 (esbuild, recompila ao salvar)
npm run build      # gera dist/ (index.html, app.js, app.css, PWA)
npm run preview    # serve dist/ em http://localhost:4173
```

## Verificações

```bash
npm run typecheck      # tsc estrito
npm test               # unitários: regras, sessão, relógio, persistência, migração, PGN (node:test via tsx)
npm run test:audit     # cruzamento do app com o chess.js em partidas aleatórias (mais lento)
npm run test:chessjs -- <pasta do repositório chess.js com __tests__>   # suíte ORIGINAL do chess.js contra a cópia vendorizada
npx playwright install chromium   # uma vez
npm run test:e2e       # Chromium real: clique, toque, arrastar, relógio, importação, responsivo, PWA
npm run verify         # vendor + typecheck + unitários + auditoria + E2E
npm run verify:vendor  # chess.js/Chessground idênticos ao upstream
```

## O que tem

- **Regras oficiais** via chess.js (roque, en passant, promoção, mate, afogamento, material insuficiente).
  Empates como nas regras: repetição tripla e 50 lances são **reivindicáveis**; repetição quíntupla e 75 lances
  encerram sozinhas. Também empate por acordo e desistência.
- **Relógios e modos** Bullet, Blitz, Rápido, Clássico e personalizado, com acréscimo, bandeira (com a exceção da
  FIDE 6.9 para material insuficiente), pausa e regras anti-trapaça. Veja `docs/RELOGIOS.md`.
- Clique/toque, arrastar, destinos legais, último lance, xeque, girar, desfazer/refazer (sem relógio),
  navegação por lances (botões, lista, ← → Home End).
- **Histórico** com reprodução, estatísticas, PGN copiável, exclusão com confirmação.
- **Importação de PGN** (texto ou arquivo): valida tudo antes, só adiciona ao histórico, nunca mexe na partida em andamento.
- Salvamento automático, recuperação, **migração** de dados antigos com cópia de segurança.
- PWA instalável e funcionamento offline; layouts próprios para computador e celular. Veja `docs/APK.md`.

## Arquitetura

```
src/engine/       regras e estado, puro: chessLib, position, session, clock, pgnImport, messages
src/persistence/  schema (validação por replay + migração), storage (localStorage versionado), record (PGN, stats)
src/store/        GameStore: estado, autosave, arquivamento, relógio, importação, avisos
src/board/        contrato BoardProps + adaptador do Chessground
src/ui/           React: App, PlayView, ReplayView, HistoryView, diálogos
src/styles/       tokens, base, board, layout, components
vendor/           chess.js e Chessground sem alteração (checksums em UPSTREAM.sha256)
tests/unit/       regras, sessão, relógio, persistência, migração, PGN
tests/audit/      cruzamentos aleatórios com o chess.js
tests/fixtures/   dados reais do formato v1, gerados pelo código v1
tests/e2e/        Playwright no Chromium
docs/             AUDITORIA-2.0, RELOGIOS, IA, ANALISE (repositórios), APK
```

Decisões que importam:
- O motor é a autoridade: o tabuleiro só mostra destinos e reporta tentativas.
- Uma partida é uma lista de lances a partir da posição inicial; posição, histórico e repetições são reconstruídos por replay.
- Esquema de dados **v2**: dados v1 são migrados só acrescentando campos, e a primeira leitura guarda `...:backup-v1`.
  Dados corrompidos ou de versão mais nova ficam à parte, sem sobrescrever.
- A repetição é contada pelo app (FIDE 9.2), não pelo hash do chess.js, que erra uma ocorrência em um caso raro.

## Ferramentas

Build com esbuild e testes com `node:test` e Playwright (o projeto não usa Vite nem Vitest).
`vendor/chess.js/pgn.ts` é uma tradução à mão da gramática de PGN, porque o `peggy` não estava disponível; é o
único arquivo acrescentado ao chess.js e foi validado pela suíte original dele (464/464). Com npm, dá para trocar
por `chess.js@1.4.0` mudando o import único de `src/engine/chessLib.ts`.

## Limitações conhecidas

- Sem IA, análise, puzzles, perfil ou multiplayer (ver `docs/IA.md` e `docs/AUDITORIA-2.0.md`).
- Sem entrada de lances por teclado; o estado da vez e o resultado são anunciados por região `aria-live`.
- Partida só a partir da posição inicial (importação rejeita PGN com FEN personalizada).
- Uma aba por vez. O relógio usa a hora do aparelho e não serve para competição online.
- Sem `package-lock.json` (gerado com rede). Testado em Chromium; Android/Capacitor, Safari e Firefox não foram testados.

## Licença

GPL-3.0-or-later (por causa do Chessground). Veja `LICENSE` e `THIRD_PARTY_LICENSES.md` **antes de publicar**:
há uma pendência sobre a licença das peças cburnett.
