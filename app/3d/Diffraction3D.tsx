// @ts-nocheck
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { diffractionPattern } from '../../lib/fft'
import { doubleSlit, singleSlit, circle, square, triangle, grating, annulus, smileyFace } from '../../lib/apertures'

function Aperture({ shape }: { shape: string }) {
  {/* @ts-ignore */}
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
      ) : shape === 'annulus' ? (
        <ringGeometry args={[0.25, 0.375, 32]} />
      ) : (
        <boxGeometry args={[1, 0.5, 0.1]} /> // grating approximation
      )}
      <meshBasicMaterial color="gray" />
    </mesh>
  )
}

function Wavefront({ position, scale }: { position: number; scale: number }) {
  {/* @ts-ignore */}
  return (
    <mesh position={[0, 0, position]} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

function DiffractionScene({ playing, speed, shape, diffractionData }: { playing: boolean; speed: number; shape: string; diffractionData: number[][] | null }) {
  const transmittedGroupRef = useRef<THREE.Group>(null!)
  const incomingGroupRef = useRef<THREE.Group>(null!)
  const lightsRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!playing) return

    const time = state.clock.elapsedTime * speed

    // Incoming wavefronts (approaching from left)
    if (incomingGroupRef.current) {
      const numIncoming = 8
      for (let i = 0; i < numIncoming; i++) {
        const phase = (time + i * 1.5) % 12
        const z = -5 + phase * 1 // Move from -5 to 7, but stop at 0
        const scale = 0.2 + (phase / 12) * 0.5

        const mesh = incomingGroupRef.current.children[i] as THREE.Mesh
        if (mesh && z < 0) { // Only show before aperture
          mesh.position.z = z
          mesh.scale.set(scale, scale, scale)
          const material = mesh.material as THREE.MeshBasicMaterial
          material.color.setHSL(0.6, 1, 0.5) // Blue for incoming
          mesh.visible = true
        } else if (mesh) {
          mesh.visible = false
        }
      }
    }

    // Transmitted wavefronts (diffracted on right)
    if (transmittedGroupRef.current && lightsRef.current && diffractionData) {
      // Find top intensity positions in diffraction pattern
      const positions: {x: number, y: number, intensity: number}[] = []
      const N = diffractionData.length
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          positions.push({x: (x - N/2) / N * 2, y: (y - N/2) / N * 2, intensity: diffractionData[y][x]})
        }
      }
      positions.sort((a, b) => b.intensity - a.intensity)
      const maxIntensity = positions[0].intensity
      const threshold = maxIntensity * 0.001 // Include peaks above 0.1% of max
      const validPositions = positions.filter(p => p.intensity >= threshold)
      const numTransmitted = Math.min(6, validPositions.length)

      for (let i = 0; i < Math.min(numTransmitted, 6); i++) { // Up to 6 meshes
        const pos = validPositions[i]
        const phase = (time + i * 3) % 10
        const z = 0.5 + phase * 0.5
        const intensityRatio = pos.intensity / maxIntensity
        const scale = 0.1 + (phase / 10) * 0.4 * Math.sqrt(intensityRatio)

        const mesh = transmittedGroupRef.current.children[i] as THREE.Mesh
        const light = lightsRef.current.children[i] as THREE.PointLight
        if (mesh && light) {
          mesh.position.set(pos.x * 0.5, pos.y * 0.5, z) // Scale positions to fit aperture
          mesh.scale.set(scale, scale, scale)
          // Change color based on intensity
          const hue = intensityRatio * 0.7
          const material = mesh.material as THREE.MeshLambertMaterial
          material.color.setHSL(hue, 1, 0.5)
          light.color.setHSL(hue, 1, 0.5)
          light.position.set(pos.x * 0.5, pos.y * 0.5, z)
          light.intensity = scale * intensityRatio * 2
        }
      }
    }
  })

  {/* @ts-ignore */}
  return (
    <>
      <group ref={incomingGroupRef}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={`incoming-${i}`} position={[0, 0, -5]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial />
          </mesh>
        ))}
      </group>
      <group ref={transmittedGroupRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`transmitted-${i}`} position={[0, 0, 0.5]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshLambertMaterial />
          </mesh>
        ))}
      </group>
      <group ref={lightsRef}>
        {Array.from({ length: 6 }, (_, i) => (
          <pointLight key={`light-${i}`} position={[0, 0, 0.5]} intensity={1} />
        ))}
      </group>
    </>
  )
}

// Compute initial diffraction for circle
const initialDiffraction = (() => {
  const ap = circle(64)
  return diffractionPattern(ap)
})()

export default function Diffraction3D() {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [shape, setShape] = useState('circle')
  const [diffractionData, setDiffractionData] = useState<number[][] | null>(initialDiffraction)

  useEffect(() => {
    let ap: number[][]
    if (shape === 'circle') {
      ap = circle(64)
    } else if (shape === 'slit') {
      ap = singleSlit(64, 10)
    } else if (shape === 'square') {
      ap = square(64)
    } else if (shape === 'triangle') {
      ap = triangle(64)
    } else if (shape === 'grating') {
      ap = grating(64)
    } else if (shape === 'annulus') {
      ap = annulus(64)
    } else {
      ap = circle(64) // default
    }
    const pattern = diffractionPattern(ap)
    setDiffractionData(pattern)
  }, [shape])

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
          <option value="annulus">Annulus</option>
        </select>
      </div>
      {/* @ts-ignore */}
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#fff']} />
        <ambientLight intensity={0.1} />
        {/* Cube room */}
        <mesh>
          <boxGeometry args={[20, 20, 20]} />
          <meshLambertMaterial color="#111" transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>
        <Aperture shape={shape} />
        <DiffractionScene playing={playing} speed={speed} shape={shape} diffractionData={diffractionData} />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </>
  )
}