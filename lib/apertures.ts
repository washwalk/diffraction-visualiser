export function doubleSlit(
    size: number,
    slitWidth = 6,
    slitSeparation = 30
) {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const left = Math.abs(x - (cx - slitSeparation / 2)) < slitWidth;
            const right = Math.abs(x - (cx + slitSeparation / 2)) < slitWidth;
            A[y][x] = left || right ? 1 : 0;
        }
    }

    return A;
}
