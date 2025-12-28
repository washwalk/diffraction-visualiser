'use client';

import { useEffect, useRef, useState } from 'react';

export function DiffractionCanvas({ data, isAperture, animate }: { data: number[][]; isAperture: boolean; animate: boolean }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [animationFrame, setAnimationFrame] = useState(0);

    useEffect(() => {
        if (!ref.current || isAperture) return;
        const ctx = ref.current.getContext('2d')!;
        const N = data.length;
        const centerX = N / 2;
        const centerY = N / 2;

        const max = Math.max(...data.flat());
        console.log(isAperture ? 'aperture max:' : 'pattern max:', max);

        const maxDist = Math.sqrt(2) * (N / 2); // Distance to corners
        const draw = (progress: number) => {
            ctx.clearRect(0, 0, N, N);
            if (isAperture) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, N, N);
            }
            const img = ctx.createImageData(N, N);

            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    const revealProgress = dist / maxDist; // 0 to 1, corners at 1

                    if (!animate || revealProgress <= progress) {
                        const i = (y * N + x) * 4;
                        let v;
                        if (isAperture) {
                            v = data[y][x]; // 0 or 1
                        } else {
                            v = Math.log(1 + data[y][x]) / Math.log(1 + max);
                        }
                        const c = Math.floor(255 * v);

                        if (isAperture) {
                            img.data[i] = c;
                            img.data[i + 1] = c;
                            img.data[i + 2] = c;
                        } else {
                            img.data[i] = c;     // red
                            img.data[i + 1] = 0; // green
                            img.data[i + 2] = 0; // blue
                        }
                        img.data[i + 3] = 255;
                    }
                }
            }

            ctx.putImageData(img, 0, 0);


        };

        if (animate) {
            let startTime: number;
            const animateFrame = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = (elapsed / 8000) % 1; // 8 second loop
                draw(progress);
                setAnimationFrame(requestAnimationFrame(animateFrame));
            };
            setAnimationFrame(requestAnimationFrame(animateFrame));
        } else {
            draw(1); // Full reveal
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [data, isAperture, animate]);

    const displaySize = isAperture ? '200px' : '512px';
    return <canvas ref={ref} width={64} height={64} style={{ width: displaySize, height: displaySize, border: '1px solid black' }} />;
}
