import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoot } from './App'
import 'katex/dist/katex.min.css'
import './styles/index.css'
import './styles/result-screen.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)
