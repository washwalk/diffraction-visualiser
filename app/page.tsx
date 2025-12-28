'use client';

import { useEffect, useState } from 'react';
import { doubleSlit } from '../lib/apertures';
import { diffractionPattern } from '../lib/fft';
import { DiffractionCanvas } from '../components/DiffractionCanvas';

export default function Home() {
    const [pattern, setPattern] = useState<number[][] | null>(null);

    useEffect(() => {
        const aperture = doubleSlit(64, 10, 25);
        const result = diffractionPattern(aperture);
        setPattern(result);
    }, []);

    return (
        <main style={{ padding: 24 }}>
        <h1>Diffraction Visualiser</h1>
        <p>Fraunhofer diffraction of a double slit</p>
        <p>The red areas show high intensity diffraction patterns.</p>
        {pattern && <DiffractionCanvas data={pattern} />}
        </main>
    );
}
