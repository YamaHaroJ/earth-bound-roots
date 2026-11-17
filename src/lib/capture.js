// Capture mode (?capture=1): the live 3D bowl scene is drawn frame by frame so scripts/capture.mjs can save it
// as pictures. Visitors never load the 3D code; they get the pictures (see sections/HeroSequence.jsx).
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
export const capture = params.has('capture')
export const captureDpr = Number(params.get('dpr') || 1)

// In capture mode time follows scroll, so flames and embers move smoothly from one saved frame to the next.
export const clock = { t: 0 }
export const timeOf = (state) => (capture ? clock.t : state.clock.elapsedTime)
