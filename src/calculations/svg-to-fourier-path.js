import { SVGPathData } from 'svg-pathdata';
import { resample2dData, getFourierDataExtended, formatCoefficient, generateCoefficientsCode } from './just-fourier-things.js';
import { normalizePoints, nextPowerOfTwo, extractPathFromSVG } from './svg-to-fourier-utils.js';

function sampleCubicBezier(x0, y0, x1, y1, x2, y2, x3, y3, numSamples) {
  const points = [];
  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
    const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;

    points.push({ x, y });
  }
  return points;
}

function sampleQuadraticBezier(x0, y0, x1, y1, x2, y2, numSamples) {
  const points = [];
  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    const x = mt2 * x0 + 2 * mt * t * x1 + t2 * x2;
    const y = mt2 * y0 + 2 * mt * t * y1 + t2 * y2;

    points.push({ x, y });
  }
  return points;
}

function pathCommandsToPoints(commands) {
  const points = [];
  let currentX = 0;
  let currentY = 0;
  let lastControlX = 0;
  let lastControlY = 0;

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];

    switch (command.type) {
      case 2: // MOVE_TO
        currentX = command.x || currentX;
        currentY = command.y || currentY;
        points.push({ x: currentX, y: currentY });
        break;

      case 4: // HORIZ_LINE_TO
        currentX = command.x || currentX;
        points.push({ x: currentX, y: currentY });
        break;

      case 8: // VERT_LINE_TO
        currentY = command.y || currentY;
        points.push({ x: currentX, y: currentY });
        break;

      case 3: // LINE_TO
        currentX = command.x || currentX;
        currentY = command.y || currentY;
        points.push({ x: currentX, y: currentY });
        break;

      case 5: // CURVE_TO (cubic bezier)
        // Sample the cubic Bézier curve
        const cubicSamples = sampleCubicBezier(
          currentX, currentY,
          command.x1, command.y1,
          command.x2, command.y2,
          command.x, command.y,
          15 // More samples for better curve representation
        );
        // Skip the first point (it's the current position)
        points.push(...cubicSamples.slice(1));

        lastControlX = command.x2;
        lastControlY = command.y2;
        currentX = command.x;
        currentY = command.y;
        break;

      case 6: // SMOOTH_CURVE_TO
        // Calculate reflected control point
        const reflectedX = 2 * currentX - lastControlX;
        const reflectedY = 2 * currentY - lastControlY;

        const smoothCubicSamples = sampleCubicBezier(
          currentX, currentY,
          reflectedX, reflectedY,
          command.x2, command.y2,
          command.x, command.y,
          15
        );
        points.push(...smoothCubicSamples.slice(1));

        lastControlX = command.x2;
        lastControlY = command.y2;
        currentX = command.x;
        currentY = command.y;
        break;

      case 7: // QUAD_TO (quadratic bezier)
        const quadSamples = sampleQuadraticBezier(
          currentX, currentY,
          command.x1, command.y1,
          command.x, command.y,
          10
        );
        points.push(...quadSamples.slice(1));

        lastControlX = command.x1;
        lastControlY = command.y1;
        currentX = command.x;
        currentY = command.y;
        break;

      case 9: // SMOOTH_QUAD_TO
        // Calculate reflected control point for quadratic
        const reflectedQuadX = 2 * currentX - lastControlX;
        const reflectedQuadY = 2 * currentY - lastControlY;

        const smoothQuadSamples = sampleQuadraticBezier(
          currentX, currentY,
          reflectedQuadX, reflectedQuadY,
          command.x, command.y,
          10
        );
        points.push(...smoothQuadSamples.slice(1));

        lastControlX = reflectedQuadX;
        lastControlY = reflectedQuadY;
        currentX = command.x;
        currentY = command.y;
        break;

      case 10: // ARC
        // For arcs, we'll approximate with line segments for now
        // This could be enhanced to properly sample the arc
        currentX = command.x || currentX;
        currentY = command.y || currentY;
        points.push({ x: currentX, y: currentY });
        break;

      case 1: // CLOSE_PATH
        // Connect back to the first point if we have points
        if (points.length > 0) {
          points.push({ x: points[0].x, y: points[0].y });
        }
        break;
    }
  }

  return points;
}

export async function processSVGToFourierWithPath(input, targetPoints = 256, precision = 3, normalize = true) {
  let pathData;

    const response = await fetch(input);
    if (!response.ok) {
      throw new Error(`Failed to load SVG file: ${response.statusText}`);
    }
    const svgContent = await response.text();
    pathData = extractPathFromSVG(svgContent);

    const pathDataObj = new SVGPathData(pathData).toAbs();
    let points = pathCommandsToPoints(pathDataObj.commands);
    if (points.length === 0) {
      throw new Error('No points could be extracted from the SVG path');
    }

    if (normalize) {
      points = normalizePoints(points);
    }

    // Ensure target points is a power of 2 for FFT
    const powerOfTwoPoints = nextPowerOfTwo(targetPoints);
    const resampledData = resample2dData(points, powerOfTwoPoints);
    const fourierData = getFourierDataExtended(resampledData);

    const formattedCoefficients = fourierData.map(coeff => formatCoefficient(coeff, precision));

    const result = {
      originalPoints: points,
      resampledData: resampledData,
      fourierCoefficients: formattedCoefficients,
      metadata: {
        originalPointCount: points.length,
        resampledPointCount: powerOfTwoPoints,
        fourierCoefficientCount: fourierData.length,
        precision: precision,
        normalized: normalize
      }
    };

    // Generate JavaScript code for the coefficients
    const jsCode = generateCoefficientsCode(formattedCoefficients, precision);
    console.log('\n=== JAVASCRIPT CODE FOR COEFFICIENTS ===');
    console.log(jsCode);

    return result;

  }
