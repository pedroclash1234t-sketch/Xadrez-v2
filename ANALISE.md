# Análise inicial dos três repositórios

Feita antes de qualquer código, sobre os arquivos efetivamente recebidos
(`chess_js-master.zip`, `chessground-master.zip`, `web-chess-main.zip`).

## chess.js 1.4.0 — BSD-2-Clause
- Aproveitado: todas as regras (lances legais, xeque, mate, roque, en passant,
  promoção, afogamento, material insuficiente, repetição tripla, regra dos 50
  lances), FEN, SAN e PGN. É a única autoridade sobre legalidade.
- Observado: a biblioteca trata repetição tripla e 50 lances como "empate"
  (`isDraw`). Pelas regras oficiais são empates **reivindicáveis**; o app os
  oferece como reivindicação e só encerra sozinho por mate, afogamento, material
  insuficiente, repetição quíntupla e regra dos 75 lances (estas duas últimas
  calculadas no adaptador, pois a biblioteca não as expõe).
- Problema do ambiente: `src/pgn.js` é gerado pelo `peggy` e não vem no repositório.
  O `peggy` não está disponível offline, então o parser foi reescrito à mão a partir
  da mesma gramática (`vendor/chess.js/pgn.ts`).

## Chessground 10.4.2 — GPL-3.0-or-later
- Aproveitado: renderização, clique/toque/arrastar, animações, destaques
  (destinos, último lance, xeque), orientação. Não valida regras: recebe `dests`
  calculados pelo chess.js e devolve a tentativa de lance, que o motor confirma.
- Licença: copyleft forte. O app inteiro passa a ser GPL-3.0-or-later ao ser
  distribuído. Decisão: manter o Chessground atrás de uma interface própria e
  publicar o projeto como GPL-3.0-or-later; se isso não servir à distribuição
  pretendida, trocar o tabuleiro (ver `THIRD_PARTY_LICENSES.md`, nota 3).

## Sir-Teo/web-chess — MIT (+ Stockfish GPL-3.0 empacotado)
- Usado só como referência: separação entre lógica pura (`engine/`) e componentes,
  persistência em localStorage com validação, testes de lógica sem renderização.
- Não copiado: o `App.tsx` tem ~6.400 linhas, depende de Stockfish/Web Workers,
  `react-chessboard`, nuvem do Lichess e análise de partidas — fora do escopo.
- Lição aplicada: a lógica e o estado ficam em módulos puros e testáveis; a UI é fina.

## Arquitetura adotada
`engine/` (chess.js + reducers imutáveis) → `persistence/` (localStorage versionado,
validação por replay) → `store/` (estado, autosave, arquivamento) → `board/`
(adaptador do Chessground) → `ui/` (React). Detalhes no README.
