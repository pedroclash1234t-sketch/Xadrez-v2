# Instalar no celular

> Nada nesta pasta foi gerado como APK ainda: o ambiente onde o projeto foi escrito não tem
> Android SDK nem rede. As três opções abaixo foram preparadas; só a **opção A** foi testada
> (no Chromium). As opções B e C dependem de ferramentas que não pude rodar.

## A. Instalar como app pelo Chrome (sem APK) — testado

O app é um PWA (manifesto, ícones e funcionamento offline). Publique a pasta `dist/` em
qualquer hospedagem com HTTPS (GitHub Pages, Netlify, Cloudflare Pages, Vercel...), abra o
endereço no Chrome do Android e use **menu ⋮ → Instalar app** (ou "Adicionar à tela inicial").
Ele abre em tela cheia, com ícone próprio, e funciona sem internet depois da primeira visita.

## B. APK gerado na nuvem (GitHub Actions) — não testado

1. Crie um repositório no GitHub e envie esta pasta.
2. Aba **Actions → APK Android → Run workflow**.
3. Ao terminar (alguns minutos), baixe **midnight-chess-apk** em *Artifacts*, extraia o
   `app-debug.apk` e abra no celular (permita "instalar apps desconhecidos" para o navegador/arquivos).

O workflow usa Capacitor 7 + JDK 21. Se algum passo falhar, o log do Actions mostra qual.

## C. APK na sua máquina — não testado

Precisa de Node 22+, JDK 21 e Android SDK (o jeito mais fácil é instalar o Android Studio).

```bash
npm install
npm run apk          # build + cap add android + gradle assembleDebug
# resultado: android/app/build/outputs/apk/debug/app-debug.apk
```

Depois de mudar o código: `npm run apk:update`.

## Observações

- **Relógio e pausa automática:** o app pausa a partida cronometrada quando a página deixa de ficar visível (`visibilitychange`/`pagehide`). Isso foi testado no Chromium; **não foi verificado na WebView do Android/Capacitor**. Se a pausa não disparar no aparelho, a alternativa é o evento `appStateChange` do plugin oficial `@capacitor/app`.

- É um APK **debug** (assinado com a chave de debug): serve para instalar e usar, mas não
  para publicar na Play Store. Para a loja é preciso um APK/AAB de release assinado com sua chave.
- O ícone do APK será o padrão do Capacitor até você gerar ícones nativos
  (por exemplo com `@capacitor/assets`, usando `public/icon-512.png`).
- As partidas ficam no armazenamento local do app (WebView); desinstalar o app apaga o histórico.
