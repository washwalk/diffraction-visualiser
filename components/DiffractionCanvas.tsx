'use client';

import { useEffect, useRef } from 'react';

export function DiffractionCanvas({ data, isAperture }: { data: number[][]; isAperture: boolean }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = ref.current.getContext('2d')!;
        const N = data.length;
        const img = ctx.createImageData(N, N);

        const max = Math.max(...data.flat());
        console.log(isAperture ? 'aperture max:' : 'pattern max:', max);

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
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

        ctx.putImageData(img, 0, 0);
    }, [data, isAperture]);

    return <canvas ref={ref} width={64} height={64} style={{ width: '512px', height: '512px', border: '1px solid black' }} />;
}
