import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../vendor/chessground/assets/chessground.base.css'
import '../vendor/chessground/assets/chessground.cburnett.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/board.css'
import './styles/layout.css'
import './styles/components.css'
import { Persistence, browserStorage } from './persistence/storage'
import { browserEnv } from './store/env'
import { GameStore } from './store/gameStore'
import { App } from './ui/App'
import { StoreProvider } from './ui/StoreContext'

const store = new GameStore(new Persistence(browserStorage(), browserEnv.now), browserEnv)
const root = document.getElementById('root')
if (!root) throw new Error('#root não encontrado')

createRoot(root).render(
  <StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </StrictMode>,
)

// Offline support once installed (production over http(s) only; never in dev).
if (__PROD__ && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* the app works the same without it */
    })
  })
}
