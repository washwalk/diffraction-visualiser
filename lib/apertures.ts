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

export function singleSlit(size: number, slitWidth = 10): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (Math.abs(x - cx) < slitWidth / 2) A[y][x] = 1;
        }
    }

    return A;
}

export function circle(size: number, radius = size / 4): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;
    const cy = size / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx * dx + dy * dy <= radius * radius) A[y][x] = 1;
        }
    }

    return A;
}

export function square(size: number, side = size / 2): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;
    const cy = size / 2;
    const halfSide = side / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (Math.abs(x - cx) < halfSide && Math.abs(y - cy) < halfSide) A[y][x] = 1;
        }
    }

    return A;
}

export function triangle(size: number, height = size / 2): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;
    const cy = size / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = Math.abs(x - cx);
            const dy = y - (cy - height / 2);
            if (dy >= 0 && dy <= height && dx <= (height - dy) * 0.5) A[y][x] = 1;
        }
    }

    return A;
}

export function grating(size: number, slitWidth = 4, slitSpacing = 10, numSlits = 3): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;
    const startY = size / 2 - (numSlits - 1) * slitSpacing / 2;

    for (let i = 0; i < numSlits; i++) {
        const slitY = startY + i * slitSpacing;
        for (let y = Math.floor(slitY - slitWidth / 2); y <= Math.floor(slitY + slitWidth / 2); y++) {
            if (y >= 0 && y < size) {
                for (let x = 0; x < size; x++) {
                    A[y][x] = 1;
                }
            }
        }
    }

    return A;
}

export function annulus(size: number, innerRadius = size / 4, outerRadius = size / 3): number[][] {
    const A = Array.from({ length: size }, () =>
        new Array(size).fill(0)
    );

    const cx = size / 2;
    const cy = size / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= innerRadius && dist <= outerRadius) A[y][x] = 1;
        }
    }

    return A;
}
