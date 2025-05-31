import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { processSVGToFourierWithPaper } from './calculations/svg-to-fourier-paper.js';

const App = () => {
  const svgRef = useRef();
  const animationRef = useRef();
  const [letterCoefficients, setLetterCoefficients] = useState({
    T: [], O: [], Z: [], E: [], R: [],
    L: [], A: [], B: [], S: []
  });
  const COEFFICIENTS_USED = 20;

  useEffect(() => {
    const loadAndProcessSVGs = async () => {
      try {
        const allLetters = ['T', 'O', 'Z', 'E', 'R', 'L', 'A', 'B', 'S'];
        const results = {};

        // Load all letters
        for (const letter of allLetters) {
          const result = await processSVGToFourierWithPaper(
            `/images/${letter}_FRAME_4.svg`, 
            COEFFICIENTS_USED, 
            3, 
            true
          );
          console.log(`${letter} Result:`, result);
          
          const sortedCoeffs = [...result.fourierCoefficients]
            .sort((a, b) => b.magnitude - a.magnitude)
            .slice(0, COEFFICIENTS_USED);
          
          results[letter] = sortedCoeffs;
        }

        setLetterCoefficients(results);

      } catch (error) {
        console.error('Error processing SVGs:', error);
      }
    };

    loadAndProcessSVGs();
  }, []);

  useEffect(() => {
    // Check if all letters are loaded
    const allLettersLoaded = Object.values(letterCoefficients).every(coeffs => coeffs.length > 0);
    if (!allLettersLoaded) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Animation setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = 80; // Increased by 25% (45 * 1.25)
    
    // Two-row layout calculations
    const tozerLetters = ['T', 'O', 'Z', 'E', 'R'];
    const labsLetters = ['L', 'A', 'B', 'S'];
    
    // Closer letter spacing - reduced spacing values
    const tozerSpacing = width * 0.12; // Reduced from 0.12 for closer spacing
    const labsSpacing = width * 0.14; // Reduced from 0.15 for closer spacing
    // const tozerSpacing = width * 0.09; // Reduced from 0.12 for closer spacing
    // const labsSpacing = width * 0.11; // Reduced from 0.15 for closer spacing
    
    // Center the words horizontally
    const tozerStartX = (width - (tozerLetters.length - 1) * tozerSpacing) / 2;
    const labsStartX = (width - (labsLetters.length - 1) * labsSpacing) / 2;
    
    // Vertical positioning
    const tozerY = height * 0.35; // Top row
    const labsY = height * 0.65;  // Bottom row

    // Professional, clean, magical color scheme
    const letterColors = {
      // TOZER colors (top row) - elegant and professional
      T: { 
        stroke: 'rgba(255, 255, 255, 0.15)',
        lines: 'rgba(255, 255, 255, 0.1)',
        path: 'rgba(255, 255, 255, 0.8)', 
        fill: '#ffffff', 
        armFill: 'rgba(255, 255, 255, 0.9)'
      },
      O: { 
        stroke: 'rgba(200, 220, 255, 0.2)',
        lines: 'rgba(200, 220, 255, 0.12)',
        path: 'rgba(200, 220, 255, 0.9)', 
        fill: '#e8f2ff', 
        armFill: 'rgba(200, 220, 255, 0.95)'
      },
      Z: { 
        stroke: 'rgba(220, 240, 255, 0.18)',
        lines: 'rgba(220, 240, 255, 0.1)',
        path: 'rgba(220, 240, 255, 0.85)', 
        fill: '#f0f8ff', 
        armFill: 'rgba(220, 240, 255, 0.9)'
      },
      E: { 
        stroke: 'rgba(240, 248, 255, 0.16)',
        lines: 'rgba(240, 248, 255, 0.08)',
        path: 'rgba(240, 248, 255, 0.9)', 
        fill: '#f8fcff', 
        armFill: 'rgba(240, 248, 255, 0.95)'
      },
      R: { 
        stroke: 'rgba(255, 255, 255, 0.2)',
        lines: 'rgba(255, 255, 255, 0.12)',
        path: 'rgba(255, 255, 255, 0.95)', 
        fill: '#ffffff', 
        armFill: 'rgba(255, 255, 255, 1)'
      },
      
      // LABS colors (bottom row) - subtle magical accent
      L: { 
        stroke: 'rgba(230, 240, 255, 0.18)',
        lines: 'rgba(230, 240, 255, 0.1)',
        path: 'rgba(230, 240, 255, 0.85)', 
        fill: '#e6f0ff', 
        armFill: 'rgba(230, 240, 255, 0.9)'
      },
      A: { 
        stroke: 'rgba(240, 245, 255, 0.16)',
        lines: 'rgba(240, 245, 255, 0.09)',
        path: 'rgba(240, 245, 255, 0.88)', 
        fill: '#f0f5ff', 
        armFill: 'rgba(240, 245, 255, 0.92)'
      },
      B: { 
        stroke: 'rgba(250, 252, 255, 0.15)',
        lines: 'rgba(250, 252, 255, 0.08)',
        path: 'rgba(250, 252, 255, 0.9)', 
        fill: '#fafcff', 
        armFill: 'rgba(250, 252, 255, 0.95)'
      },
      S: { 
        stroke: 'rgba(255, 255, 255, 0.18)',
        lines: 'rgba(255, 255, 255, 0.1)',
        path: 'rgba(255, 255, 255, 0.92)', 
        fill: '#ffffff', 
        armFill: 'rgba(255, 255, 255, 0.98)'
      }
    };

    // Set SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Create animation data for each letter
    const createLetterAnimation = (coefficients, centerX, centerY, letter) => {
      // Immediate drawing variables
      let pathData = "";
      let pointCount = 0;
      const maxPathLength = 1000;

      // Create groups for this letter
      const letterGroup = svg.append('g').attr('class', `letter-${letter}`);
      const circlesGroup = letterGroup.append('g').attr('class', 'circles');
      const linesGroup = letterGroup.append('g').attr('class', 'lines');
      const pathGroup = letterGroup.append('g').attr('class', 'path');
      const dotsGroup = letterGroup.append('g').attr('class', 'dots');

      // Create single path element for immediate drawing - clean and elegant
      const drawingPath = pathGroup.append('path')
        .style('fill', 'none')
        .style('stroke', letterColors[letter].path)
        .style('stroke-width', '1.5px')
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round')
        .style('opacity', 0.9)
        .style('filter', 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))')
        .style('mix-blend-mode', 'normal');

      // Create circles - minimal and clean but more visible
      const visualCoeffs = coefficients.filter(c => c.frequency !== 0);

      const circles = circlesGroup.selectAll('.circle')
        .data(visualCoeffs)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('r', d => Math.max(d.magnitude * scale, 0.5))
        .style('fill', 'none')
        .style('stroke', letterColors[letter].stroke)
        .style('stroke-width', '1.5px')
        .style('opacity', 0.8);

      // Create connecting lines - subtle and professional
      const lines = linesGroup.selectAll('.connecting-line')
        .data(coefficients)
        .enter()
        .append('line')
        .attr('class', 'connecting-line')
        .style('stroke', letterColors[letter].lines)
        .style('stroke-width', '0.5px')
        .style('opacity', 0.4);

      // Create center dot - clean and minimal
      const centerDot = dotsGroup.append('circle')
        .attr('class', 'center-dot')
        .attr('r', 2)
        .style('fill', letterColors[letter].fill)
        .style('stroke', 'rgba(255, 255, 255, 0.8)')
        .style('stroke-width', '1px')
        .style('filter', 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))');

      // Create arm dots - subtle and elegant
      const armDots = dotsGroup.selectAll('.arm-dot')
        .data(coefficients)
        .enter()
        .append('circle')
        .attr('class', 'arm-dot')
        .attr('r', 1)
        .style('fill', letterColors[letter].armFill)
        .style('stroke', 'rgba(255, 255, 255, 0.6)')
        .style('stroke-width', '0.5px')
        .style('opacity', 0.8);

      return {
        coefficients,
        centerX,
        centerY,
        circles,
        lines,
        centerDot,
        armDots,
        drawingPath,
        pathData,
        pointCount,
        maxPathLength,
        letter
      };
    };

    // Create animations for all letters
    const letterAnimations = {};
    
    // TOZER letters (top row)
    tozerLetters.forEach((letter, index) => {
      const centerX = tozerStartX + index * tozerSpacing;
      letterAnimations[letter] = createLetterAnimation(
        letterCoefficients[letter], 
        centerX, 
        tozerY,
        letter
      );
    });
    
    // LABS letters (bottom row)
    labsLetters.forEach((letter, index) => {
      const centerX = labsStartX + index * labsSpacing;
      letterAnimations[letter] = createLetterAnimation(
        letterCoefficients[letter], 
        centerX, 
        labsY,
        letter
      );
    });

    // Calculate epicycle positions at time t for a given letter
    function calculateEpicyclePositions(t, letterData) {
      let x = letterData.centerX;
      let y = letterData.centerY;
      const positions = [{ x, y }];

      for (let i = 0; i < letterData.coefficients.length; i++) {
        const coeff = letterData.coefficients[i];
        const angle = 2 * Math.PI * coeff.frequency * t + coeff.phase;

        const prevX = x;
        const prevY = y;

        x += coeff.magnitude * scale * Math.cos(angle);
        y -= coeff.magnitude * scale * Math.sin(angle);

        positions.push({
          centerX: prevX,
          centerY: prevY,
          tipX: x,
          tipY: y,
          radius: coeff.magnitude * scale,
          frequency: coeff.frequency
        });
      }

      return positions;
    }

    // Update animation for a single letter
    function updateLetterAnimation(t, letterData) {
      const positions = calculateEpicyclePositions(t, letterData);

      // Update circles
      letterData.circles
        .attr('cx', (d, i) => {
          const pos = positions.find(p => p.frequency === d.frequency);
          return pos ? pos.centerX : letterData.centerX;
        })
        .attr('cy', (d, i) => {
          const pos = positions.find(p => p.frequency === d.frequency);
          return pos ? pos.centerY : letterData.centerY;
        });

      // Update connecting lines
      letterData.lines
        .attr('x1', (d, i) => i === 0 ? positions[0].x : positions[i].centerX)
        .attr('y1', (d, i) => i === 0 ? positions[0].y : positions[i].centerY)
        .attr('x2', (d, i) => positions[i + 1] ? positions[i + 1].centerX : positions[i].tipX)
        .attr('y2', (d, i) => positions[i + 1] ? positions[i + 1].centerY : positions[i].tipY);

      // Update center dot
      letterData.centerDot
        .attr('cx', positions[0].x)
        .attr('cy', positions[0].y);

      // Update arm dots
      letterData.armDots
        .attr('cx', (d, i) => positions[i + 1] ? positions[i + 1].tipX : positions[i].tipX)
        .attr('cy', (d, i) => positions[i + 1] ? positions[i + 1].tipY : positions[i].tipY);

      // IMMEDIATE line drawing - draw directly at the tip position
      const finalPos = positions[positions.length - 1];
      
      if (letterData.pointCount === 0) {
        // Start the path
        letterData.pathData = `M${finalPos.tipX},${finalPos.tipY}`;
      } else {
        // Add line to current position
        letterData.pathData += `L${finalPos.tipX},${finalPos.tipY}`;
      }
      
      letterData.pointCount++;

      // Limit path length for performance
      if (letterData.pointCount > letterData.maxPathLength) {
        // Remove old points by finding the first 'L' and removing everything before it
        const firstL = letterData.pathData.indexOf('L');
        if (firstL !== -1) {
          letterData.pathData = 'M' + letterData.pathData.substring(firstL + 1);
          letterData.pointCount--;
        }
      }

      // Update the path immediately
      letterData.drawingPath.attr('d', letterData.pathData);

      // Dynamic color update - very subtle and professional
      if (letterData.pointCount % 20 === 0) {
        // Very subtle color variation - stays professional
        const baseOpacity = 0.85 + Math.sin(t * Math.PI * 2) * 0.1;
        letterData.drawingPath.style('opacity', baseOpacity);
      }
    }

    // Main animation function
    function animate(elapsed) {
      const t = (elapsed / 9100) % 1; // Slowed down by 30% (7000 * 1.3 = 9100)
      
      // Update all letters
      const allLetters = [...tozerLetters, ...labsLetters];
      allLetters.forEach(letter => {
        updateLetterAnimation(t, letterAnimations[letter]);
      });
    }

    // Start animation
    const timer = d3.timer(animate);
    animationRef.current = timer;

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      svg.attr('width', newWidth).attr('height', newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [letterCoefficients]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 overflow-hidden relative">
      <svg
        ref={svgRef}
        className="drop-shadow-2xl"
        style={{ 
          filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.05))',
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.8) 50%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      />
    </div>
  );
};

export default App;