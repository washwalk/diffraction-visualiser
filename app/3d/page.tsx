import { Suspense } from 'react'
import Diffraction3D from './Diffraction3D'

export default function Page() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Diffraction3D />
      </Suspense>
    </div>
  )
}