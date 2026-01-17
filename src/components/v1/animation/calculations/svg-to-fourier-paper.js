import paper from 'paper';
import { normalizePoints, nextPowerOfTwo, extractPathFromSVG } from './svg-to-fourier-utils.js';
import { resample2dData, getFourierDataExtended, formatCoefficient } from './just-fourier-things.js';

function pathCommandsToPoints(pathData) {
  const points = [];
  const path = new paper.Path(pathData);
  const length = path.length;

  const numSamples = Math.max(100, Math.floor(length / 2)); // Adaptive sampling based on path length

  for (let i = 0; i <= numSamples; i++) {
    const offset = (i / numSamples) * length;
    const point = path.getPointAt(offset);
    if (point) {
      points.push({ x: point.x, y: point.y });
    }
  }

  return points;
}

export async function processSVGToFourierWithPaper(input, targetPoints = 256, precision = 3, normalize = true) {
  
  paper.setup(new paper.Size(1000, 1000));
  let pathData;

  const response = await fetch(input);
  if (!response.ok) {
    throw new Error(`Failed to load SVG file: ${response.statusText}`);
  }
  const svgContent = await response.text();

  pathData = extractPathFromSVG(svgContent);


  const path = new paper.Path(pathData);
  const absolutePathData = path.pathData; 
  
  // console.log("ABSOLUTE PATH DATA: ", absolutePathData);

  // Convert path to points
  let points = pathCommandsToPoints(absolutePathData);
  if (points.length === 0) {
    throw new Error('No points could be extracted from the SVG path');
  }

  if (normalize) {
    points = normalizePoints(points);
  }

  // Do we need?
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

  return result;

}