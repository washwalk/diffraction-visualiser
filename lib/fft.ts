import { GPU } from 'gpu.js';

const gpu = new GPU();

export function diffractionPattern(aperture: number[][]) {
    const N = aperture.length;

    const kernel = gpu.createKernel(function (A) {
        let real = 0;
        let imag = 0;

        for (let y = 0; y < this.constants.N; y++) {
            for (let x = 0; x < this.constants.N; x++) {
                const phase =
                -2.0 * Math.PI *
                ((this.thread.x * x + this.thread.y * y) /
                this.constants.N);

                const a = A[y][x];
                real += a * Math.cos(phase);
                imag += a * Math.sin(phase);
            }
        }

        return real * real + imag * imag;
    }, {
        output: [N, N],
        constants: { N }
    });

    return kernel(aperture) as number[][];
}
