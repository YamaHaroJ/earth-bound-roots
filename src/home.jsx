import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles.css'
import Shell from './sections/Shell'
import Hero from './sections/Hero'
import { Intro, Practices, Gatherings, Rsvp, Donate } from './sections/Content'
import { capture } from './lib/capture'

// ?capture=1 shows only the live 3D scene, for recording the pictures (the 3D code is never loaded otherwise)
const CaptureScene = lazy(() => import('./three/BowlScene').then((m) => ({ default: m.CaptureScene })))

createRoot(document.getElementById('root')).render(
  capture ? (
    <Suspense fallback={null}>
      <CaptureScene />
    </Suspense>
  ) : (
  <StrictMode>
    <Shell page="home">
      <Hero />
      <Intro />
      <Practices />
      <Gatherings />
      <Rsvp />
      <Donate />
    </Shell>
  </StrictMode>
  ),
)
