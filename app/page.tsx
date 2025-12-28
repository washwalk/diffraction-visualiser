'use client';

import { useEffect, useState } from 'react';
import { doubleSlit } from '../lib/apertures';
import { diffractionPattern } from '../lib/fft';
import { DiffractionCanvas } from '../components/DiffractionCanvas';

export default function Home() {
    const [pattern, setPattern] = useState<number[][] | null>(null);
    const [slitWidth, setSlitWidth] = useState(10);
    const [slitSeparation, setSlitSeparation] = useState(25);

    const [aperture, setAperture] = useState<number[][] | null>(null);

    useEffect(() => {
        const ap = doubleSlit(64, slitWidth, slitSeparation);
        setAperture(ap);
        const result = diffractionPattern(ap);
        setPattern(result);
    }, [slitWidth, slitSeparation]);

    return (
        <main style={{ padding: 24 }}>
        <h1>Diffraction Visualiser</h1>
        <p>Fraunhofer diffraction of a double slit</p>
        <p>The red areas show high intensity diffraction patterns.</p>
        <div>
            <label>Slit Width: {slitWidth}</label>
            <input type="range" min="1" max="20" value={slitWidth} onChange={e => setSlitWidth(Number(e.target.value))} />
        </div>
        <div>
            <label>Slit Separation: {slitSeparation}</label>
            <input type="range" min="10" max="40" value={slitSeparation} onChange={e => setSlitSeparation(Number(e.target.value))} />
        </div>
        {aperture && <div><h2>Aperture</h2><DiffractionCanvas data={aperture} isAperture={true} /></div>}
        {pattern && <div><h2>Diffraction Pattern</h2><DiffractionCanvas data={pattern} isAperture={false} /></div>}
        </main>
    );
}
