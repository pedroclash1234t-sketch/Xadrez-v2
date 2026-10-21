# Relógios e modos de partida

Regras implementadas em `src/engine/clock.ts` e `src/engine/session.ts` (não só na interface).

## Modos

Classificação pela estimativa **tempo base + 40 × acréscimo** (a mesma do lichess):

| Modo | Estimativa | Predefinições |
|---|---|---|
| Bullet | < 3 min | 1+0, 2+1 |
| Blitz | < 8 min | 3+0, 3+2, 5+0 |
| Rápido | < 25 min | 10+0, 15+10 |
| Clássico | ≥ 25 min | 30+0, 60+30 |
| Sem relógio | — | como antes |

"Outro": minutos inteiros de 1 a 180 e acréscimo inteiro de 0 a 60 s; a classificação segue a mesma fórmula.
Acréscimo tipo Fischer: soma-se ao tempo de quem acabou de jogar.

## Contagem

1. O relógio só começa depois do **primeiro lance das brancas**, que não gasta tempo e não recebe acréscimo. A partir daí corre o relógio de quem está na vez.
2. Do segundo lance em diante, quem joga paga o tempo usado e recebe o acréscimo; o relógio do adversário começa.
3. Ao fim da partida (mate, desistência, acordo, reivindicação, tempo) o relógio para.

## Tempo esgotado

Perde quem ficou sem tempo. **Exceção (FIDE 6.9):** se o adversário não tem material para dar xeque-mate, é **empate**. A checagem é só por material e conservadora: na dúvida, não vira empate (ex.: cavalo contra rei com um peão adversário ainda pode, em teoria, dar mate com ajuda).

A bandeira é verificada a cada 250 ms e **antes de qualquer ação** (lance, desistência, empate, pausa): um lance feito depois de o tempo acabar é recusado e vale a derrota por tempo, mesmo sem a tela ter atualizado.

## Pausa

| Situação | Regra |
|---|---|
| Pausa manual | só **Rápido e Clássico**, e só depois do primeiro lance. Os dois relógios param, o tabuleiro fica coberto e os lances são recusados |
| Pausa automática | **qualquer modo**: o app saiu de foco (tela bloqueada, troca de app, aba oculta) ou a página foi fechada/recarregada. O tempo exato até ali é cobrado e salvo |
| Retomar | sempre por toque em "Retomar"; o tempo parado não é cobrado |
| Reabrir o app | volta **pausado**. Se o app foi encerrado sem aviso (sem `pagehide`), o tempo desde o último evento salvo **não é cobrado** (a favor dos jogadores) |
| Pausa em partida terminada ou sem lances | não existe |

Num mesmo aparelho a pausa manual é honra: o tabuleiro fica coberto, mas nada impede de pensar de cabeça.

## Desfazer, refazer, reiniciar

Com relógio:
- **Desfazer e refazer não existem** (devolveriam tempo).
- **Reiniciar e Nova partida são recusados** com a partida em andamento (a partir do 1º lance): a saída é **Desistir** ou **Empate**, que registram o resultado. Antes do primeiro lance e depois do fim, é livre.
- A recusa vale no motor (`canLeaveGame`), não só no botão desabilitado.

## Dados

`GameState.clock` (null sem relógio): controle, tempos restantes na hora do último evento, instante de início do relógio corrente e tipo de pausa. Gravado na sessão (esquema v2) e, no histórico, `timeControl` e quem ficou sem tempo (`flagged`). O PGN exportado traz `TimeControl` e, no tempo esgotado, `Termination "time forfeit"`.

Limite conhecido: o relógio usa a hora do aparelho (`Date`). Mudar o relógio do sistema durante a partida pode distorcer a contagem. Para partida competitiva online o tempo teria de ser do servidor.
