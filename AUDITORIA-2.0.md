# Auditoria 2.0 (Fase Zero) e plano

Feita antes de alterar código, sobre o repositório real (`git log`: commit "Baseline: Midnight Chess 1.0").

## 1. Linha de base (comandos reais do `package.json`, ambiente sem rede)

| Comando | Resultado |
|---|---|
| `npm run verify:vendor` | OK (26 arquivos idênticos ao upstream) |
| `npm run typecheck` | **Falha neste ambiente**: `TS2688 Cannot find type definition file for 'node'` (sem rede não há `@types/node` nem `@types/react`). Não é erro do código; ver "Limites da verificação" |
| `npm test` | 70/70 |
| `npm run build` | OK, `app.js` 291 KB, `app.css` 28 KB |
| `npm run test:e2e` (Chromium, Playwright) | 37/37 |

Substituto do typecheck: `tsc --noEmit` estrito com declarações mínimas locais de React/Node (fora do projeto): limpo.

## 2. Estado real encontrado

**A. Existente e verificado:** regras via chess.js (suíte original do chess.js, 464 testes, passa 464/464 contra a cópia vendorizada com o `pgn.ts` escrito à mão); roque, en passant, promoção, mate, afogamento, material insuficiente, repetição, 50 lances; desfazer/refazer/navegação; partida encerrada recusa lances; persistência com validação por replay, dados corrompidos e versão mais nova preservados à parte; histórico, replay, exportação de PGN; layouts desktop/celular; PWA; build esbuild.

**B. Existente, mas incompleto ou com falha** (o que foi encontrado e o que foi feito):
- Repetição tripla reivindicada **uma ocorrência tarde** num caso raro (peão cravado com en passant só no papel): o hash do chess.js conta o en passant pseudolegal. FIDE 9.2 exige captura legal. **Corrigido** (contagem própria; teste documenta o desvio da biblioteca).
- Sem importação de PGN (só cópia). **Implementada** com validação rígida, isolada da partida em andamento.
- Toque duplo no destino mostrava erro "lance não permitido". **Corrigido** (janela de 600 ms para o mesmo lance).
- No celular, após "Nova partida" a página ficava rolada para baixo. **Corrigido**.
- Sem `package-lock.json` (o CI usa `npm install`): builds não reprodutíveis. **Pendente**: gerar o lock com rede.
- Capacitor: só `capacitor.config.json` e o workflow; `android/` nunca foi gerado e nenhum APK foi compilado. **Não verificado**.
- Sem entrada de lances por teclado (limitação do Chessground). Pendente.
- Duas abas salvando a mesma partida sobrescrevem uma à outra. Pendente.

**C. Inexistente:** IA, tabuleiro de análise, variações, puzzles, aberturas, perfil/rating/conquistas, temas/som, backup completo, multiplayer, contas.

## 3. Dependências entre sistemas

- Relógios → esquema v2 (`session.clock`, `timeControl`) → PGN `TimeControl`/`Termination` → estatísticas por modalidade (Fase 5).
- IA → motor + Web Worker + proteção contra resposta atrasada → dicas/análise (Fase 4).
- Análise e puzzles → **`GameState` que parte de uma FEN** (hoje só parte da posição inicial; `replay()` já aceita `startFen`, o resto não) → variações.
- Multiplayer → servidor autoritativo com relógio no servidor. O relógio atual é só do cliente e **não** serve de base para competição.

## 4. Riscos de regressão e mitigação

| Risco | Mitigação aplicada |
|---|---|
| Mudar o formato dos dados e perder partidas | v1→v2 só acrescenta campos; cópia intacta `...:backup-v1`; fixtures geradas pelo código v1 reproduzidas em teste |
| Regras divergirem do chess.js | 3 testes de auditoria cruzam replay do app × chess.js em partidas aleatórias, inclusive `undo()` da biblioteca |
| Relógio injusto (desfazer, reiniciar, app em segundo plano) | regras explícitas em `docs/RELOGIOS.md`, impostas no motor (não só na tela) e testadas |
| Testes de UI dependentes de animação | `reducedMotion` e relógio falso do Playwright; ver "Notas de teste" |

## 5. Ordem seguida

1 auditoria e base → 2 regras → 3 histórico/persistência/PGN → 4 relógios e modos → (IA: **bloqueada**, ver `docs/IA.md`). Fases 5 em diante não foram iniciadas.

## 6. Limites da verificação

- Sem `@types/react`/`@types/node` o `npm run typecheck` real não rodou; o código foi checado contra declarações mínimas escritas à mão. Erros nos tipos reais só aparecem após `npm install`.
- Nada foi testado em Android, Safari ou Firefox. O comportamento de `visibilitychange` dentro da WebView do Capacitor (usado na pausa automática) é uma suposição não verificada.
- Notas de teste: o Chessground só processa cliques via `requestAnimationFrame`; com o relógio falso congelado do Playwright é preciso liberar quadros (`runFor`) após cada clique. Isso é artefato do teste, não do app.
