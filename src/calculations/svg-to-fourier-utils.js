function normalizePoints(points) {
    if (points.length === 0) return points;

    // Find bounding box
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Calculate center and size
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;
    const maxDimension = Math.max(width, height);

    // Normalize to unit circle (scale to fit in [-1, 1] range)
    const scale = maxDimension > 0 ? 2 / maxDimension : 1;

    return points.map(p => ({
        x: (p.x - centerX) * scale,
        y: -(p.y - centerY) * scale  // Flip Y coordinate for correct orientation
    }));
}

function nextPowerOfTwo(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
}

function extractPathFromSVG(svgContent) {
    const pathMatch = svgContent.match(/d="([^"]+)"/);
    if (!pathMatch) {
        throw new Error('No path data found in the SVG file');
    }
    return pathMatch[1];
}

export { normalizePoints, nextPowerOfTwo, extractPathFromSVG };