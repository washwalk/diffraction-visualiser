'use client';

import { useEffect, useRef } from 'react';

export function DiffractionCanvas({ data }: { data: number[][] }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const ctx = ref.current.getContext('2d')!;
        const N = data.length;
        const img = ctx.createImageData(N, N);

        const max = Math.max(...data.flat());
        console.log('max intensity:', max);

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                const i = (y * N + x) * 4;
                const v = Math.log(1 + data[y][x]) / Math.log(1 + max);
                const c = Math.floor(255 * v);

                img.data[i] = c;     // red
                img.data[i + 1] = 0; // green
                img.data[i + 2] = 0; // blue
                img.data[i + 3] = 255;
            }
        }

        ctx.putImageData(img, 0, 0);
    }, [data]);

    return <canvas ref={ref} width={64} height={64} style={{ width: '512px', height: '512px', border: '1px solid black' }} />;
}
