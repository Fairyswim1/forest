import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoot } from './App'
import 'katex/dist/katex.min.css'
import './styles/uiTokens.css'
import './styles/index.css'
import './styles/fantasy-ui.css'
import './styles/result-screen.css'
import './styles/profile-setup.css'
import './styles/title-screen.css'
import './styles/board-direction.css'
import './styles/board-character.css'
import './styles/play-hud.css'
import './styles/fonts.css'
import './styles/mobile-landscape.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)
