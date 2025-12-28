'use client';

import { useEffect, useState } from 'react';
import { doubleSlit, smileyFace } from '../lib/apertures';
import { diffractionPattern } from '../lib/fft';
import { DiffractionCanvas } from '../components/DiffractionCanvas';

export default function Home() {
    const [pattern, setPattern] = useState<number[][] | null>(null);
    const [aperture, setAperture] = useState<number[][] | null>(null);
    const [shape, setShape] = useState('smiley');
    const [slitWidth, setSlitWidth] = useState(10);
    const [slitSeparation, setSlitSeparation] = useState(25);

    useEffect(() => {
        let ap: number[][];
        if (shape === 'doubleSlit') {
            ap = doubleSlit(64, slitWidth, slitSeparation);
        } else if (shape === 'smiley') {
            ap = smileyFace(64);
        } else {
            ap = doubleSlit(64, slitWidth, slitSeparation); // default
        }
        setAperture(ap);
        const result = diffractionPattern(ap);
        setPattern(result);
    }, [shape, slitWidth, slitSeparation]);

    return (
        <main style={{ padding: 24 }}>
        <h1>Diffraction Visualiser</h1>
        <p>Light propagation through apertures</p>
        <p>Watch how light fills the space after passing through different shapes.</p>
        <div>
            <label>Aperture Shape: </label>
            <select value={shape} onChange={e => setShape(e.target.value)}>
                <option value="doubleSlit">Double Slit</option>
                <option value="smiley">Smiley Face</option>
            </select>
        </div>
        {shape === 'doubleSlit' && (
            <>
                <div>
                    <label>Slit Width: {slitWidth}</label>
                    <input type="range" min="1" max="20" value={slitWidth} onChange={e => setSlitWidth(Number(e.target.value))} />
                </div>
                <div>
                    <label>Slit Separation: {slitSeparation}</label>
                    <input type="range" min="10" max="40" value={slitSeparation} onChange={e => setSlitSeparation(Number(e.target.value))} />
                </div>
            </>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {aperture && <div><h3>Aperture</h3><DiffractionCanvas data={aperture} isAperture={true} /></div>}
            {pattern && <div><h2>Diffraction Pattern</h2><DiffractionCanvas data={pattern} isAperture={false} /></div>}
        </div>
        </main>
    );
}
