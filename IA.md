# Inteligência artificial: análise e decisão pendente

**Status: BLOQUEADO por decisão e por ambiente. Nada de IA foi implementado nesta execução**, e a interface não oferece nenhum modo contra o computador, dica ou análise.

## O que existe hoje

Nenhum motor no projeto. O chess.js só gera e valida lances; não avalia posições.

## Por que não foi feito

1. **Sem rede neste ambiente**: não dá para baixar, medir nem testar um motor externo. Qualquer número de tamanho/versão de motor abaixo vem de memória e **não foi verificado**.
2. **Decisão relevante**: escolher o motor adiciona uma dependência grande e/ou de licença forte ao app e ao APK. O documento pede não improvisar nesse caso.

## Dado medido

chess.js (perft, este servidor, não um celular): ~480 mil nós/s na posição inicial e ~350 mil nós/s na Kiwipete. Um motor próprio em cima dele, com avaliação, ordenação e desfazer, fica bem abaixo disso, e um celular é mais lento ainda.

## Alternativas (a confirmar com rede)

| | Stockfish (WASM, versão de 1 thread) | Motor JS pequeno (ex.: Lozza, js-chess-engine) | Motor próprio sobre chess.js |
|---|---|---|---|
| Força | muito acima de "Mestre" | fraca a média | fraca a média |
| Níveis verificáveis | sim: `Skill Level`, `UCI_LimitStrength`/`UCI_Elo`, `go depth/movetime` | só profundidade/tempo | só profundidade/tempo/aleatoriedade, implementados por nós |
| Licença | GPL-3.0 (compatível: o app já é GPL-3.0-or-later por causa do Chessground) | a verificar (varia) | nossa |
| Tamanho | alguns MB de WASM (a medir; entra no APK) | pequeno | ~zero |
| Offline / Capacitor | sim, empacotando o `.wasm`; a versão de 1 thread evita `SharedArrayBuffer` e cabeçalhos COOP/COEP | sim | sim |
| Complexidade | Web Worker + protocolo UCI | Worker | Worker + o motor inteiro (proibido "do zero" havendo alternativa) |

## Recomendação

Stockfish WASM de 1 thread, empacotado localmente, em um Web Worker. Antes de integrar, **confirmar com rede**: versão, licença do pacote exato, tamanho do `.wasm`/JS, tempo de resposta em celular de entrada. Precisa da sua decisão sobre: (a) adicionar essa dependência; (b) o impacto no tamanho do APK.

## Desenho já definido (para quando houver decisão)

- Cada pedido ao motor leva `requestId` + identidade da posição (`id da partida`, número de lances, FEN). A resposta **só é aplicada** se ainda bater com a partida atual; reiniciar, nova partida, desfazer, desistir, pausa ou fim cancelam (`stop`) e invalidam o pedido.
- O Worker nunca mexe no estado: devolve um lance candidato, e o `playMove` do motor de regras o valida como qualquer outro lance.
- Níveis: Iniciante, Fácil, Médio, Difícil, Mestre, cada um com parâmetros de força reais (não só rótulos), **calibrados por partidas automáticas contra um nível de referência** antes de receberem nome. A calibração é critério de aceitação.
- Dicas, análise de erros e explicações são funcionalidades separadas e só podem ser anunciadas quando existirem.

## Critérios de aceitação da Fase 3

1. Motor roda offline, no navegador e no APK, sem travar a interface.
2. Resposta atrasada após nova partida/desfazer/fim **nunca** altera a partida (teste automatizado com motor falso e atraso controlado).
3. Níveis medidos: cada nível vence o anterior em amostra de partidas de teste com margem definida.
4. Lance do motor sempre passa pela validação do chess.js.
5. Partida contra o computador registrada no histórico com o nível usado.
