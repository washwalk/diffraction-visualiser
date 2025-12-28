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

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                const i = (y * N + x) * 4;
                const v = Math.log(1 + data[y][x]) / Math.log(1 + max);
                const c = Math.floor(255 * v);

                img.data[i] = c;
                img.data[i + 1] = c;
                img.data[i + 2] = c;
                img.data[i + 3] = 255;
            }
        }

        ctx.putImageData(img, 0, 0);
    }, [data]);

    return <canvas ref={ref} width={256} height={256} />;
}
