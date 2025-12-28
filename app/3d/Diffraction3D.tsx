// @ts-nocheck
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Aperture({ shape }: { shape: string }) {
  /* @ts-ignore */
  return (
    <mesh position={[0, 0, 0]}>
      {shape === 'circle' ? (
        <ringGeometry args={[0, 0.5, 32]} />
      ) : shape === 'slit' ? (
        <planeGeometry args={[1, 0.1]} />
      ) : shape === 'square' ? (
        <planeGeometry args={[0.5, 0.5]} />
      ) : shape === 'triangle' ? (
        <coneGeometry args={[0.4, 0.8, 3]} />
      ) : (
        <boxGeometry args={[1, 0.5, 0.1]} /> // grating approximation
      )}
      <meshBasicMaterial color="gray" />
    </mesh>
  )
}

function Wavefront({ position, scale }: { position: number; scale: number }) {
  /* @ts-ignore */
  return (
    <mesh position={[0, 0, position]} scale={[scale * 2, scale * 2, scale]}>
      <boxGeometry args={[1, 1, 0.5]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  )
}

function DiffractionScene({ playing, speed }: { playing: boolean; speed: number }) {
  const wavefrontsRef = useRef<THREE.Group>(null)
  const [wavefronts, setWavefronts] = useState<number[]>([])

  useFrame((state, delta) => {
    if (!playing) return

    console.log('playing, delta:', delta, 'wavefronts before:', wavefronts.length)

    // Update existing wavefronts: move and scale, limit to 10
    setWavefronts(prev =>
      prev.map(w => ({ z: w.z + speed * delta * 5, scale: w.scale + speed * delta * 4 }))
        .filter(w => w.z < 15 && w.scale < 5)
        .slice(-10) // Keep max 10
    )

    // Add new wavefronts at aperture more frequently
    if (Math.random() < 0.5) {
      console.log('adding wavefront')
      setWavefronts(prev => [...prev, { z: 0, scale: 0.5 }])
    }
  })

  /* @ts-ignore */
  return (
    <group ref={wavefrontsRef}>
      {wavefronts.map((z, index) => (
        <Wavefront key={index} position={z} opacity={0.5} />
      ))}
    </group>
  )
}

export default function Diffraction3D() {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [shape, setShape] = useState('circle')

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, color: 'white' }}>
        <h1>3D Diffraction Animation</h1>
        <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
        <label>Speed: <input type="range" min="0.1" max="3" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label>
            <select value={shape} onChange={e => setShape(e.target.value)}>
          <option value="circle">Circle</option>
          <option value="slit">Slit</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="grating">Grating</option>
        </select>
      </div>
      /* @ts-ignore */
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach="background" args={['#111']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Aperture shape={shape} />
        {/* Test mesh */}
        <mesh position={[0, 0, 2]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="green" />
        </mesh>
        <DiffractionScene playing={playing} speed={speed} />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </>
  )
}