import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { reduced as still } from '../lib/scroll'
import { capture, captureDpr, clock as capClock, timeOf } from '../lib/capture'

const reduced = still || capture

const damp = THREE.MathUtils.damp
const NARROW_LIFT = Number(new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('lift') ?? -1.3)
const NARROW_BACK = Number(new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('back') ?? 1.9)

// Light on purpose: the scene only draws while it is on screen, about 30 times a second,
// at no more than 1.25x pixels. The rest of the site is plain HTML.
function Ticker({ active }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (!active) return
    const id = setInterval(invalidate, reduced ? 250 : 33)
    return () => clearInterval(id)
  }, [active, invalidate])
  return null
}

function Rig({ progress }) {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const now = useRef(new THREE.Vector3(0, 0.6, 0))
  const goal = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, delta) => {
    const p = progress.current
    const narrow = size.width < 820
    const back = narrow ? NARROW_BACK : 1
    // from a wide view of the candles down toward the bowl
    const x = THREE.MathUtils.lerp(0.2, 0.5, p) + (reduced ? 0 : state.pointer.x * 0.35)
    const y = THREE.MathUtils.lerp(2.4, 4.6, p) + (reduced ? 0 : state.pointer.y * 0.15)
    const z = THREE.MathUtils.lerp(7.2, 2.4, p) * back
    // phones: text covers the lower half, so aim lower to lift the bowl into the top of the screen
    look.set(0, THREE.MathUtils.lerp(0.7, 0.25, p) + (narrow ? NARROW_LIFT : 0), 0)
    const k = capture ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 4)
    camera.position.lerp(goal.set(x, y, z), k)
    now.current.lerp(look, k)
    camera.lookAt(now.current)
  })
  return null
}

const BOWL_PROFILE = [
  [0, 0], [0.5, 0], [0.82, 0.12], [1.0, 0.38], [1.05, 0.62], [1.03, 0.67],
  [0.97, 0.64], [0.93, 0.42], [0.76, 0.19], [0.46, 0.09], [0, 0.09],
].map(([x, y]) => new THREE.Vector2(x, y))

function Bowl({ onStrike, strikes }) {
  const group = useRef()
  const hover = useRef(0)
  const invalidate = useThree((s) => s.invalidate)
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const since = timeOf(state) - strikes.current.last
    const wobble = since < 3 ? Math.sin(since * 22) * 0.03 * Math.exp(-since * 1.6) : 0
    group.current.rotation.z = wobble
    group.current.rotation.x = wobble * 0.6
    group.current.rotation.y += dt * 0.05
    const s = 1 + hover.current * 0.03
    group.current.scale.setScalar(damp(group.current.scale.x, s, 8, dt))
  })
  return (
    <group
      ref={group}
      position={[0, 0.42, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        hover.current = 1
        document.body.style.cursor = 'pointer'
        invalidate()
      }}
      onPointerOut={() => {
        hover.current = 0
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onStrike()
      }}
    >
      <mesh>
        <latheGeometry args={[BOWL_PROFILE, 96]} />
        <meshStandardMaterial color="#c79b58" metalness={1} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* a hidden, larger target so the bowl is easy to click */}
      <mesh visible={false}>
        <cylinderGeometry args={[1.2, 1.2, 0.9, 16]} />
      </mesh>
    </group>
  )
}

function Candle({ position, height }) {
  const flame = useRef()
  const light = useRef()
  const seed = useMemo(() => position[0] * 13.7, [position])
  useFrame((state) => {
    const t = timeOf(state) + seed
    const f = still ? 1 : 0.85 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 13.1) * 0.05 + Math.sin(t * 2.1) * 0.04
    flame.current.scale.set(0.07, 0.17 * f, 0.07)
    flame.current.position.x = still ? 0 : Math.sin(t * 3.7) * 0.008
    light.current.intensity = 2.4 * f
  })
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.3, 0.32, height, 32]} />
        <meshStandardMaterial color="#efe3cc" roughness={0.85} emissive="#ffb35c" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
        <meshBasicMaterial color="#2a1d14" />
      </mesh>
      <mesh ref={flame} position={[0, height + 0.2, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffd690" toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, height + 0.35, 0]} color="#ffb565" distance={5} decay={1.8} />
    </group>
  )
}

const CANDLES = [
  { position: [-2.3, 0, -0.7], height: 1.45 },
  { position: [2.1, 0, -1.3], height: 1.05 },
  { position: [2.9, 0, 0.5], height: 0.7 },
]
// phones are narrow, so the candles stand closer in around the bowl
const CANDLES_NARROW = [
  { position: [-1.3, 0, -1.5], height: 1.45 },
  { position: [1.25, 0, -1.9], height: 1.05 },
  { position: [1.55, 0, -0.4], height: 0.7 },
]

function Embers({ candles }) {
  const count = 90
  const geo = useRef()
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const c = candles[Math.floor(Math.random() * candles.length)]
        return { c, off: Math.random(), speed: 0.05 + Math.random() * 0.08, sway: Math.random() * 6 }
      }),
    [candles],
  )
  const positions = useMemo(() => new Float32Array(count * 3), [])
  useFrame((state) => {
    const t = timeOf(state)
    seeds.forEach((s, i) => {
      const u = (s.off + t * s.speed) % 1
      positions[i * 3] = s.c.position[0] + Math.sin(t * 0.8 + s.sway) * 0.25 * u
      positions[i * 3 + 1] = s.c.height + 0.3 + u * 3.2
      positions[i * 3 + 2] = s.c.position[2] + Math.cos(t * 0.6 + s.sway) * 0.2 * u
    })
    geo.current.attributes.position.needsUpdate = true
  })
  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#ffcf8a" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// Sound made visible: rings travel out across the floor when the bowl is struck.
function Ripples({ strikes }) {
  const rings = [useRef(), useRef(), useRef(), useRef()]
  useFrame((state) => {
    const since = timeOf(state) - strikes.current.last
    rings.forEach((r, i) => {
      const s = since - i * 0.35
      const on = s > 0 && s < 4
      r.current.visible = on
      if (!on) return
      r.current.scale.setScalar(1.3 + s * 1.6)
      r.current.material.opacity = 0.45 * (1 - s / 4)
    })
  })
  return (
    <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {rings.map((r, i) => (
        <mesh ref={r} key={i} visible={false}>
          <ringGeometry args={[0.98, 1, 96]} />
          <meshBasicMaterial color="#e9b46a" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ progress, onStrike, active }) {
  const strikes = useRef({ last: -100 })
  const clock = useThree((s) => s.clock)
  // phones use a farther camera, so the fog has to start and end farther away too
  const narrow = useThree((s) => s.size.width < 820)
  const far = narrow ? NARROW_BACK : 1
  const candles = narrow ? CANDLES_NARROW : CANDLES
  const strike = () => {
    strikes.current.last = clock.elapsedTime
    onStrike?.()
  }
  return (
    <>
      <color attach="background" args={['#1c2620']} />
      <fog attach="fog" args={['#1c2620', 7 * far, 16 * far]} />
      <Ticker active={active} />
      <Rig progress={progress} />
      <ambientLight intensity={0.25} color="#cfd9c4" />
      <directionalLight position={[-3, 5, 3]} intensity={0.5} color="#ffe4c2" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={1.6} color="#ffd9a3" position={[0, 3, 3]} scale={[5, 1, 1]} />
        <Lightformer form="rect" intensity={1} color="#ff9e4f" position={[-3, 1, 0]} rotation-y={Math.PI / 2} scale={[3, 1, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#b7c9a8" position={[3, 2, -2]} rotation-y={-Math.PI / 2} scale={[3, 2, 1]} />
      </Environment>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#2b231c" roughness={0.85} />
      </mesh>
      {/* folded cloth cushion */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.24, 24, 64]} />
        <meshStandardMaterial color="#5a3a2c" roughness={0.95} />
      </mesh>
      <Bowl onStrike={strike} strikes={strikes} />
      {candles.map((c, i) => (
        <Candle key={i} {...c} />
      ))}
      <Embers candles={candles} />
      <Ripples strikes={strikes} />
    </>
  )
}

export default function BowlScene({ progress, onStrike, active, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop="demand"
      camera={{ fov: 32, near: 0.1, far: 40, position: [0.2, 2.4, 7.2] }}
      gl={{ antialias: true, stencil: false, powerPreference: 'low-power' }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <Scene progress={progress} onStrike={onStrike} active={active} />
    </Canvas>
  )
}

function shrink(src, w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const x = c.getContext('2d')
  x.imageSmoothingEnabled = true
  x.imageSmoothingQuality = 'high'
  x.drawImage(src, 0, 0, w, h)
  return c
}

// Recorder hooks: the capture script sets a scroll position, draws, and reads back the picture
// plus where the bowl is on screen (so clicks on the bowl still work in the picture version).
function CaptureHooks({ progress }) {
  const { gl, camera, advance, size } = useThree()
  useEffect(() => {
    const c = new THREE.Vector3()
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    window.__capture = {
      set(p) {
        progress.current = p
        capClock.t = p * 14
      },
      // outW/outH: render bigger, then shrink with high-quality smoothing (crisper edges)
      shot(quality = 0.74, outW = 0, outH = 0) {
        advance(performance.now())
        c.set(0, 0.45, 0).project(camera)
        a.set(-1.05, 0.45, 0).project(camera)
        b.set(1.05, 0.45, 0).project(camera)
        return {
          url: outW ? shrink(gl.domElement, outW, outH).toDataURL('image/webp', quality) : gl.domElement.toDataURL('image/webp', quality),
          bowl: [+((c.x + 1) / 2).toFixed(4), +((1 - c.y) / 2).toFixed(4), +(Math.abs(b.x - a.x) / 4).toFixed(4)],
        }
      },
    }
  }, [gl, camera, advance, size, progress])
  return null
}

export function CaptureScene() {
  const progress = useRef(0)
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0 }}
      dpr={captureDpr}
      frameloop="never"
      camera={{ fov: 32, near: 0.1, far: 40, position: [0.2, 2.4, 7.2] }}
      gl={{ antialias: true, stencil: false, preserveDrawingBuffer: true }}
    >
      <CaptureHooks progress={progress} />
      <Scene progress={progress} active={false} />
    </Canvas>
  )
}
