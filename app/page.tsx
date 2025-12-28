'use client';

import { useEffect, useState } from 'react';
import { doubleSlit, smileyFace, singleSlit, circle, square, triangle, grating, annulus } from '../lib/apertures';
import { diffractionPattern } from '../lib/fft';
import { DiffractionCanvas } from '../components/DiffractionCanvas';

export default function Home() {
    const [pattern, setPattern] = useState<number[][] | null>(null);
    const [aperture, setAperture] = useState<number[][] | null>(null);
    const [shape, setShape] = useState('smiley');
    const [slitWidth, setSlitWidth] = useState(10);
    const [slitSeparation, setSlitSeparation] = useState(25);
    const [loading, setLoading] = useState(false);
    const [compareMode, setCompareMode] = useState(false);
    const [pattern2, setPattern2] = useState<number[][] | null>(null);
    const [aperture2, setAperture2] = useState<number[][] | null>(null);
    const [shape2, setShape2] = useState('doubleSlit');
    const [slitWidth2, setSlitWidth2] = useState(10);
    const [slitSeparation2, setSlitSeparation2] = useState(25);
    const [loading2, setLoading2] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => { // Simulate async for UI feedback
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
            } else if (shape === 'triangle') {
                ap = triangle(64);
            } else if (shape === 'grating') {
                ap = grating(64);
            } else if (shape === 'annulus') {
                ap = annulus(64);
            } else {
                ap = doubleSlit(64, slitWidth, slitSeparation); // default
            }
            setAperture(ap);
            const result = diffractionPattern(ap);
            setPattern(result);
            setLoading(false);
        }, 100);
    }, [shape, slitWidth, slitSeparation]);

    useEffect(() => {
        if (!compareMode) return;
        setLoading2(true);
        setTimeout(() => {
            let ap: number[][];
            if (shape2 === 'doubleSlit') {
                ap = doubleSlit(64, slitWidth2, slitSeparation2);
            } else if (shape2 === 'smiley') {
                ap = smileyFace(64);
            } else if (shape2 === 'singleSlit') {
                ap = singleSlit(64, slitWidth2);
            } else if (shape2 === 'circle') {
                ap = circle(64);
            } else if (shape2 === 'square') {
                ap = square(64);
            } else if (shape2 === 'triangle') {
                ap = triangle(64);
            } else if (shape2 === 'grating') {
                ap = grating(64);
            } else if (shape2 === 'annulus') {
                ap = annulus(64);
            } else {
                ap = doubleSlit(64, slitWidth2, slitSeparation2); // default
            }
            setAperture2(ap);
            const result = diffractionPattern(ap);
            setPattern2(result);
            setLoading2(false);
        }, 100);
    }, [compareMode, shape2, slitWidth2, slitSeparation2]);

    return (
        <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Light propagation through apertures: Watch how light fills the space after passing through different shapes.</h1>
        <p><a href="/3d" style={{ color: 'blue' }}>View 3D Animation</a></p>
        <label>
            <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} />
            Compare Mode
        </label>
        <div>
            <label>Aperture Shape: </label>
            <select value={shape} onChange={e => setShape(e.target.value)}>
                <option value="smiley">Smiley Face</option>
                <option value="doubleSlit">Double Slit</option>
                <option value="singleSlit">Single Slit</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
                <option value="grating">Grating</option>
                <option value="annulus">Annulus</option>
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
