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
    <mesh position={[0, 0, position]} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

function DiffractionScene({ playing, speed }: { playing: boolean; speed: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!groupRef.current || !playing) return

    const time = state.clock.elapsedTime * speed
    const numWavefronts = 5
    for (let i = 0; i < numWavefronts; i++) {
      const phase = (time + i * 2) % 10 // Staggered phases
      const z = 1 + phase * 2
      const scale = 0.5 + phase * 0.5

      const mesh = groupRef.current.children[i] as THREE.Mesh
      if (mesh) {
        mesh.position.z = z
        mesh.scale.set(scale, scale, scale)
        // Change color based on scale
        const material = mesh.material as THREE.MeshBasicMaterial
        material.color.setHSL(scale / 5, 1, 0.5)
      }
    }
  })

  /* @ts-ignore */
  return (
    <group ref={groupRef}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0, 1]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial />
        </mesh>
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
      <Canvas camera={{ position: [0, 5, 5], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Aperture shape={shape} />
        <DiffractionScene playing={playing} speed={speed} />
        {/* <OrbitControls enablePan={false} enableZoom={true} /> */}
      </Canvas>
    </>
  )
}