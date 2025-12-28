'use client';

import { useEffect, useState } from 'react';
import { doubleSlit } from '../lib/apertures';
import { diffractionPattern } from '../lib/fft';
import { DiffractionCanvas } from '../components/DiffractionCanvas';

export default function Home() {
    const [pattern, setPattern] = useState<number[][] | null>(null);
    const [slitWidth, setSlitWidth] = useState(10);
    const [slitSeparation, setSlitSeparation] = useState(25);

    useEffect(() => {
        const aperture = doubleSlit(64, slitWidth, slitSeparation);
        const result = diffractionPattern(aperture);
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
        {pattern && <DiffractionCanvas data={pattern} />}
        </main>
    );
}
