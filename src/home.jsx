import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
// fonts are bundled with the site (not loaded from Google), so visitors' addresses are not sent to Google
import '@fontsource/young-serif/400.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import Shell from './sections/Shell'
import Hero from './sections/Hero'
import { Intro, Practices, Gatherings, MeetTeaser, Rsvp, Donate } from './sections/Content'
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
      <MeetTeaser />
      <Rsvp />
      <Donate />
    </Shell>
  </StrictMode>
  ),
)
