import SVGPathCommander from 'svg-path-commander';
import { processSVGToFourierWithPath } from './svg-to-fourier-path.js';

export async function processSVGWithPathCommander(svgFilePath, targetPoints = 256, precision = 3, normalize = true) {
  try {
    const response = await fetch(svgFilePath);
    if (!response.ok) {
      throw new Error(`Failed to load SVG file: ${response.statusText}`);
    }
    
    const svgContent = await response.text();
    const pathMatch = svgContent.match(/d="([^"]+)"/);
    
    if (!pathMatch) {
      throw new Error('No path data found in the SVG file');
    }
    
    const originalPath = pathMatch[1];
    const pathCommander = new SVGPathCommander(originalPath);      
    const processedPath = pathCommander.toAbsolute().toString();
       
    const result = await processSVGToFourierWithPath(
      { pathData: processedPath }, 
      targetPoints, 
      precision, 
      normalize
    );
    
    return result;
    
  } catch (error) {
    throw error;
  }
}