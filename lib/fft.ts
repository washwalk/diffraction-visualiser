export function diffractionPattern(aperture: number[][]) {
    const N = aperture.length;
    const result: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));

    for (let ky = 0; ky < N; ky++) {
        for (let kx = 0; kx < N; kx++) {
            let real = 0;
            let imag = 0;

            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    const phase = -2.0 * Math.PI * (((kx - N / 2) * x + (ky - N / 2) * y) / N);
                    const a = aperture[y][x];
                    real += a * Math.cos(phase);
                    imag += a * Math.sin(phase);
                }
            }

            result[ky][kx] = real * real + imag * imag;
        }
    }

    return result;
}
