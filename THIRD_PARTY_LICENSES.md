# Licenças de terceiros

O Midnight Chess é distribuído sob **GPL-3.0-or-later** (arquivo `LICENSE`) porque
incorpora o Chessground, que é GPL-3.0-or-later. Todos os demais componentes
abaixo têm licenças compatíveis com a GPL-3.0.

| Componente | Versão | Licença | Onde está | Uso |
|---|---|---|---|---|
| chess.js | 1.4.0 | BSD-2-Clause | `vendor/chess.js/` (+ `LICENSE`) | Regras, FEN, SAN, PGN |
| Chessground | 10.4.2 | **GPL-3.0-or-later** | `vendor/chessground/` (+ `LICENSE`) | Tabuleiro e interação |
| Peças "cburnett" (SVG embutidos em `chessground.cburnett.css`) | — | ver nota 1 | `vendor/chessground/assets/` | Desenho das peças |
| React / React DOM / Scheduler | 19.x | MIT | dependência npm (empacotada em `dist/app.js`) | Interface |
| esbuild, TypeScript, tsx, Playwright | — | MIT / Apache-2.0 | só desenvolvimento | Build, tipos, testes |
| Sir-Teo/web-chess | — | MIT (código); Stockfish empacotado nele é GPL-3.0 | **não incorporado** | Apenas referência de arquitetura |

## Notas

1. **Peças cburnett.** O repositório do Chessground fornecido não declara a licença
   das peças (o README só trata da licença do código). Pelo que se sabe do projeto
   original (Colin M. L. Burnett), o conjunto é licenciado em GPLv2+/BSD/GFDL, mas
   isso **não pôde ser verificado nos arquivos recebidos**. Confirme antes de
   publicar ou troque o conjunto de peças.
2. **Obrigações da GPL-3.0 ao distribuir.** Quem recebe o app (inclusive por um site)
   deve poder obter o código-fonte completo correspondente, sob GPL-3.0-or-later,
   com os avisos de copyright mantidos. Hospedar o código-fonte junto com o site
   (ou um link visível para ele) e manter este arquivo e o `LICENSE` atende o caso
   comum. Os avisos do React ficam em `dist/app.js.LEGAL.txt`.
3. **Se a distribuição planejada for proprietária/fechada**, o Chessground não pode
   ser usado. O tabuleiro está isolado atrás de `src/board/types.ts` (contrato
   `BoardProps`): basta escrever outra implementação com licença permissiva
   (por exemplo, um tabuleiro próprio ou o `react-chessboard`, MIT) e remover
   `vendor/chessground/`. As regras (chess.js, BSD-2) não são afetadas.
4. **Arquivos de terceiros modificados.** Nenhum. `chess.ts`, `node.ts`, `pgn.peggy`
   e todo o Chessground são idênticos aos do upstream (`npm run verify:vendor`).
   O único arquivo acrescentado é `vendor/chess.js/pgn.ts` (ver README).
