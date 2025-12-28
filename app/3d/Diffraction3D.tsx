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
      ) : shape === 'annulus' ? (
        <ringGeometry args={[size / 4, size / 3, 32]} />
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

function DiffractionScene({ playing, speed, shape }: { playing: boolean; speed: number; shape: string }) {
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
        const scale = 0.5 + (phase / 12) * 2

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
    if (transmittedGroupRef.current && lightsRef.current) {
      const numTransmitted = shape === 'circle' ? 5 : shape === 'slit' ? 2 : shape === 'annulus' ? 4 : 3 // Shape affects diffraction complexity
      for (let i = 0; i < Math.min(numTransmitted, 3); i++) { // Limit to 3 meshes
        const phase = (time + i * 3) % 15
        const z = 0.5 + phase * 1.5
        const scale = 0.3 + (phase / 15) * 3

        const mesh = transmittedGroupRef.current.children[i] as THREE.Mesh
        const light = lightsRef.current.children[i] as THREE.PointLight
        if (mesh && light) {
          mesh.position.z = z
          mesh.scale.set(scale, scale, scale)
          // Change color based on scale
          const hue = scale / 5
          const material = mesh.material as THREE.MeshLambertMaterial
          material.color.setHSL(hue, 1, 0.5)
          light.color.setHSL(hue, 1, 0.5)
          light.position.z = z
          light.intensity = scale
        }
      }
    }
  })

  /* @ts-ignore */
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
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={`transmitted-${i}`} position={[0, 0, 0.5]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshLambertMaterial />
          </mesh>
        ))}
      </group>
      <group ref={lightsRef}>
        {Array.from({ length: 3 }, (_, i) => (
          <pointLight key={`light-${i}`} position={[0, 0, 0.5]} intensity={1} />
        ))}
      </group>
    </>
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
          <option value="annulus">Annulus</option>
        </select>
      </div>
      /* @ts-ignore */
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#fff']} />
        <ambientLight intensity={0.1} />
        {/* Cube room */}
        <mesh>
          <boxGeometry args={[20, 20, 20]} />
          <meshLambertMaterial color="#111" transparent opacity={0.1} side={THREE.BackSide} />
        </mesh>
        <Aperture shape={shape} />
        <DiffractionScene playing={playing} speed={speed} shape={shape} />
        {/* <OrbitControls enablePan={false} enableZoom={true} /> */}
      </Canvas>
    </>
  )
}