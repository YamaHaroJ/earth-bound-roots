import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// fonts are bundled with the site (not loaded from Google), so visitors' addresses are not sent to Google
import '@fontsource/young-serif/400.css'
import '@fontsource-variable/hanken-grotesk/index.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import Shell from './sections/Shell'
import Calendar from './sections/Calendar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Shell page="calendar">
      <Calendar />
    </Shell>
  </StrictMode>,
)
