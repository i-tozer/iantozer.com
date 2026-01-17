import FFT from 'fft.js';
import { slurp } from './util.js';

/**
 * Do the fourier thing using a bunch of complex points
 * Returns extended format with real, imaginary, magnitude, and phase
 *
 * @param {Array<Number>} points Array of points, alternative with re, im pairs. Length must be a power of 2
 */
export function getFourierDataExtended(points) {
    if (points.length == 0) {
        return [];
    }
    const numPoints = points.length / 2;
    const fft = new FFT(numPoints);

    const out = fft.createComplexArray();
    fft.transform(out, points);

    // Transform into extended API format
    const fftData = [];
    for (let i = 0; i < numPoints; i++) {
        // to reorder the frequencies a little nicer, we pick from the front and back alternatively
        const j = i % 2 == 0 ? i / 2 : numPoints - ((i + 1) / 2);
        const real = out[2 * j] / numPoints;     // Normalize by numPoints
        const imag = out[2 * j + 1] / numPoints; // Normalize by numPoints
        const frequency = ((j + numPoints / 2) % numPoints) - numPoints / 2;
        
        const magnitude = Math.sqrt(real * real + imag * imag);
        const phase = Math.atan2(imag, real);
        
        fftData.push({
            frequency: frequency,
            real: real,
            imag: imag,
            magnitude: magnitude,
            phase: phase
        });
    }
    
    return fftData;
}

/**
 * Original getFourierData function for backward compatibility
 * Returns the original format with freq, amplitude, phase
 */
export function getFourierData(points) {
    if (points.length == 0) {
        return [];
    }
    const numPoints = points.length / 2;
    const fft = new FFT(numPoints);

    const out = fft.createComplexArray();
    fft.transform(out, points);

    // Transform into an API of points I find friendlier.
    const fftData = [];
    for (let i = 0; i < numPoints; i++) {
        // to reorder the frequencies a little nicer, we pick from the front and back alternatively
        const j = i % 2 == 0 ? i / 2 : numPoints - ((i + 1) / 2);
        const x = out[2 * j];
        const y = out[2 * j + 1];
        const freq = ((j + numPoints / 2) % numPoints) - numPoints / 2;
        fftData.push({
            freq: freq,
            // a little expensive
            amplitude: Math.sqrt(x * x + y * y) / numPoints,
            // a lottle expensive :(
            phase: Math.atan2(y, x),
        });
    }
    // fftData.sort((a, b) => b.amplitude - a.amplitude);
    return fftData;
}

/**
 * Convert between the two formats
 * From extended format to original format
 */
export function extendedToOriginal(extendedData) {
    return extendedData.map(coeff => ({
        freq: coeff.frequency,
        amplitude: coeff.magnitude,
        phase: coeff.phase
    }));
}

/**
 * Convert from original format to extended format
 * Note: This loses the real/imag breakdown since original format only has magnitude/phase
 */
export function originalToExtended(originalData) {
    return originalData.map(coeff => {
        const real = coeff.amplitude * Math.cos(coeff.phase);
        const imag = coeff.amplitude * Math.sin(coeff.phase);
        return {
            frequency: coeff.freq,
            real: real,
            imag: imag,
            magnitude: coeff.amplitude,
            phase: coeff.phase
        };
    });
}

/**
 *
 * @param {Array<Number>} points Array of values of some wave. Must be a power of 2.
 */
export function getRealFourierData(points) {
    if (points.length == 0) {
        return [];
    }
    const numPoints = points.length;
    const fft = new FFT(numPoints);

    const formatedPoints = fft.createComplexArray();
    fft.toComplexArray(points, formatedPoints);

    const out = fft.createComplexArray();
    fft.transform(out, formatedPoints);

    // Transform into an API of points I find friendlier.
    const fftData = [];
    // We only have to read the first half of this because of symmetry things.
    for (let i = 0; i < numPoints / 2; i++) {
        const x = out[2 * i];
        const y = out[2 * i + 1];
        const freq = i;
        fftData.push({
            freq: freq,
            // a little expensive
            // Also we gotta multiply this by 2 to account for the other side that
            amplitude: 2 * Math.sqrt(x * x + y * y) / numPoints,
            // a lottle expensive :(
            phase: Math.atan2(y, x),
        });
    }
    // fftData.sort((a, b) => b.amplitude - a.amplitude);
    return fftData;
}

/**
 * Extended version of getRealFourierData
 */
export function getRealFourierDataExtended(points) {
    if (points.length == 0) {
        return [];
    }
    const numPoints = points.length;
    const fft = new FFT(numPoints);

    const formatedPoints = fft.createComplexArray();
    fft.toComplexArray(points, formatedPoints);

    const out = fft.createComplexArray();
    fft.transform(out, formatedPoints);

    const fftData = [];
    // We only have to read the first half of this because of symmetry things.
    for (let i = 0; i < numPoints / 2; i++) {
        const real = 2 * out[2 * i] / numPoints;     // Multiply by 2 and normalize
        const imag = 2 * out[2 * i + 1] / numPoints; // Multiply by 2 and normalize
        const frequency = i;
        
        const magnitude = Math.sqrt(real * real + imag * imag);
        const phase = Math.atan2(imag, real);
        
        fftData.push({
            frequency: frequency,
            real: real,
            imag: imag,
            magnitude: magnitude,
            phase: phase
        });
    }
    
    return fftData;
}

/**
 * Transforms a list of x, y points into input appropriate for a fourier transform.
 */
export function resample2dData(points, numSamples) {
    if (points.length == 0) {
        // Can't resample if we don't have ANY points
        return [];
    }
    let newPoints = [];
    for (let i = 0; i < numSamples; i++) {
        let position = points.length * (i / numSamples);
        let index = Math.floor(position);
        let nextIndex = (index + 1) % points.length;
        let amt = position - index;
        newPoints.push(
            /* x */ slurp(points[index].x, points[nextIndex].x, amt),
            /* y */ slurp(points[index].y, points[nextIndex].y, amt),
        )
    }
    return newPoints;
}

/**
 * Utility function to format coefficients for display
 */
export function formatCoefficient(coeff, precision = 3) {
    return {
        frequency: coeff.frequency,
        real: parseFloat(coeff.real.toFixed(precision)),
        imag: parseFloat(coeff.imag.toFixed(precision)),
        magnitude: parseFloat(coeff.magnitude.toFixed(precision)),
        phase: coeff.phase // Keep full precision for phase
    };
}

/**
 * Generate JavaScript code string for coefficients array
 */
export function generateCoefficientsCode(coefficients, precision = 3) {
    const formatted = coefficients.map(coeff => {
        const formatted = formatCoefficient(coeff, precision);
        return `    { frequency: ${formatted.frequency}, real: ${formatted.real}, imag: ${formatted.imag}, magnitude: ${formatted.magnitude}, phase: Math.atan2(${formatted.imag}, ${formatted.real}) }`;
    });
    
    return `const coefficients = [\n${formatted.join(',\n')}\n];`;
} 