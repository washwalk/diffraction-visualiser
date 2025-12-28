'use client';

import { useEffect, useState } from 'react';
import { doubleSlit, smileyFace, singleSlit, circle, square } from '../lib/apertures';
import { diffractionPattern } from '../lib/fft';
import { DiffractionCanvas } from '../components/DiffractionCanvas';

export default function Home() {
    const [pattern, setPattern] = useState<number[][] | null>(null);
    const [aperture, setAperture] = useState<number[][] | null>(null);
    const [shape, setShape] = useState('smiley');
    const [slitWidth, setSlitWidth] = useState(10);
    const [slitSeparation, setSlitSeparation] = useState(25);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        let ap: number[][];
        if (shape === 'doubleSlit') {
            ap = doubleSlit(64, slitWidth, slitSeparation);
        } else if (shape === 'smiley') {
            ap = smileyFace(64);
        } else if (shape === 'singleSlit') {
            ap = singleSlit(64, slitWidth);
        } else if (shape === 'circle') {
            ap = circle(64);
        } else if (shape === 'square') {
            ap = square(64);
        } else {
            ap = doubleSlit(64, slitWidth, slitSeparation); // default
        }
        setAperture(ap);
        const result = diffractionPattern(ap);
        setPattern(result);
    }, [shape, slitWidth, slitSeparation]);

    return (
        <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Light propagation through apertures: Watch how light fills the space after passing through different shapes.</h1>
        <div>
            <label>Aperture Shape: </label>
            <select value={shape} onChange={e => setShape(e.target.value)}>
                <option value="smiley">Smiley Face</option>
                <option value="doubleSlit">Double Slit</option>
                <option value="singleSlit">Single Slit</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
            </select>
            <label style={{ marginLeft: '20px' }}>
                <input type="checkbox" checked={animate} onChange={e => setAnimate(e.target.checked)} />
                Animate Propagation
            </label>
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
        {aperture && <div><h3>Aperture</h3><DiffractionCanvas data={aperture} isAperture={true} animate={false} /></div>}
        {pattern && <div><h2>Diffraction Pattern</h2><DiffractionCanvas data={pattern} isAperture={false} animate={animate} /></div>}
        </div>
        </main>
    );
}
