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
    <mesh position={[0, 0, position]} scale={[scale, scale, 1]}>
      <circleGeometry args={[5, 32]} />
      <meshBasicMaterial color="cyan" transparent opacity={0.5} />
    </mesh>
  )
}

function DiffractionScene({ playing, speed }: { playing: boolean; speed: number }) {
  const wavefrontsRef = useRef<THREE.Group>(null)
  const [wavefronts, setWavefronts] = useState<number[]>([])

  useFrame((state, delta) => {
    if (!playing) return

    // Move existing wavefronts
    if (wavefrontsRef.current) {
      wavefrontsRef.current.children.forEach((child, index) => {
        child.position.z += speed * delta * 2
        if (child.position.z > 10) {
          wavefrontsRef.current!.remove(child)
        }
      })
    }

    // Add new wavefronts at aperture
    if (Math.random() < 0.1) { // Occasional new wavefront
      setWavefronts(prev => [...prev, 0])
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Aperture shape={shape} />
        <DiffractionScene playing={playing} speed={speed} />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </>
  )
}