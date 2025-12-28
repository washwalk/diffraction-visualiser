export function doubleSlit(
    size: number,
    slitWidth = 6,
    slitSeparation = 30
): number[][] {
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

export function smileyFace(size: number): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 3;

    // Face circle
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx * dx + dy * dy <= radius * radius) A[y][x] = 1;
        }
    }

    // Eyes
    const eyeRadius = radius / 5;
    const eyeOffset = radius / 2;
    // Left eye
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - (cx - eyeOffset);
            const dy = y - (cy - eyeOffset);
            if (dx * dx + dy * dy <= eyeRadius * eyeRadius) A[y][x] = 0;
        }
    }
    // Right eye
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - (cx + eyeOffset);
            const dy = y - (cy - eyeOffset);
            if (dx * dx + dy * dy <= eyeRadius * eyeRadius) A[y][x] = 0;
        }
    }

    // Smile (simple arc removal)
    const smileY = cy + radius / 2;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (y > smileY - 2 && y < smileY + 2 && x > cx - radius / 2 && x < cx + radius / 2) {
                A[y][x] = 0;
            }
        }
    }

    return A;
}
