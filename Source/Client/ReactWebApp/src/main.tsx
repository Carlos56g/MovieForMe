import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MovieForMeHome from './MovieForMeHome.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MovieForMeHome />
  </StrictMode>,
)
