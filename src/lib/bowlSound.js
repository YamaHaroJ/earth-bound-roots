// A singing-bowl tone made in the browser (no audio files): a few inharmonic partials that ring and slowly fade,
// with a slight beat between paired tones like a real bowl. Only ever plays after a click or tap.
let ctx = null

export function strikeBowl(strength = 1) {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = ctx || new AC()
  if (ctx.state === 'suspended') ctx.resume()
  const now = ctx.currentTime
  const out = ctx.createGain()
  out.gain.value = 0.18 * strength
  out.connect(ctx.destination)

  const base = 196 // G3
  const partials = [
    [1, 1, 9],
    [2.71, 0.45, 6.5],
    [5.15, 0.22, 4],
    [8.43, 0.1, 2.6],
  ]
  for (const [ratio, level, decay] of partials) {
    for (const detune of [-1.2, 1.2]) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = base * ratio + detune
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(level, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay)
      osc.connect(g).connect(out)
      osc.start(now)
      osc.stop(now + decay + 0.1)
    }
  }
}
