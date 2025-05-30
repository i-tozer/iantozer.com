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
            `src/images/${letter}_FRAME_4.svg`, 
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
    const tozerSpacing = width * 0.09; // Reduced from 0.12 for closer spacing
    const labsSpacing = width * 0.11; // Reduced from 0.15 for closer spacing
    
    // Center the words horizontally
    const tozerStartX = (width - (tozerLetters.length - 1) * tozerSpacing) / 2;
    const labsStartX = (width - (labsLetters.length - 1) * labsSpacing) / 2;
    
    // Vertical positioning
    const tozerY = height * 0.35; // Top row
    const labsY = height * 0.65;  // Bottom row

    // Enhanced color scheme for each letter
    const letterColors = {
      // TOZER colors (top row)
      T: { stroke: 'rgba(255, 80, 80, 0.2)', path: 'rgba(255, 80, 80, 0.4)', fill: '#ff4757', armFill: '#ff6b7a' },
      O: { stroke: 'rgba(80, 255, 80, 0.2)', path: 'rgba(80, 255, 80, 0.4)', fill: '#2ed573', armFill: '#7bed9f' },
      Z: { stroke: 'rgba(80, 80, 255, 0.2)', path: 'rgba(80, 80, 255, 0.4)', fill: '#5352ed', armFill: '#7f8ff4' },
      E: { stroke: 'rgba(255, 200, 80, 0.2)', path: 'rgba(255, 200, 80, 0.4)', fill: '#ffa502', armFill: '#ffb142' },
      R: { stroke: 'rgba(255, 80, 200, 0.2)', path: 'rgba(255, 80, 200, 0.4)', fill: '#ff3838', armFill: '#ff6b9d' },
      
      // LABS colors (bottom row)
      L: { stroke: 'rgba(150, 255, 150, 0.2)', path: 'rgba(150, 255, 150, 0.4)', fill: '#26de81', armFill: '#7bed9f' },
      A: { stroke: 'rgba(255, 150, 100, 0.2)', path: 'rgba(255, 150, 100, 0.4)', fill: '#fd79a8', armFill: '#fdcb6e' },
      B: { stroke: 'rgba(100, 200, 255, 0.2)', path: 'rgba(100, 200, 255, 0.4)', fill: '#74b9ff', armFill: '#a29bfe' },
      S: { stroke: 'rgba(200, 100, 255, 0.2)', path: 'rgba(200, 100, 255, 0.4)', fill: '#a29bfe', armFill: '#fd79a8' }
    };

    // Set SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Create animation data for each letter
    const createLetterAnimation = (coefficients, centerX, centerY, letter) => {
      let allPathData = [];
      let currentSegmentPoints = [];
      const maxTotalPoints = 1800; // Optimized for 9 letters
      const segmentLength = 10;

      // Create groups for this letter
      const letterGroup = svg.append('g').attr('class', `letter-${letter}`);
      const circlesGroup = letterGroup.append('g').attr('class', 'circles');
      const linesGroup = letterGroup.append('g').attr('class', 'lines');
      const pathGroup = letterGroup.append('g').attr('class', 'path');
      const dotsGroup = letterGroup.append('g').attr('class', 'dots');

      // Create circles (skip the DC component for visual purposes)
      const visualCoeffs = coefficients.filter(c => c.frequency !== 0);

      const circles = circlesGroup.selectAll('.circle')
        .data(visualCoeffs)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('r', d => Math.max(d.magnitude * scale, 1)) // Increased from 0.8
        .style('fill', 'none')
        .style('stroke', letterColors[letter].stroke)
        .style('stroke-width', '1.25px'); // Increased by 25%

      // Create connecting lines
      const lines = linesGroup.selectAll('.connecting-line')
        .data(coefficients)
        .enter()
        .append('line')
        .attr('class', 'connecting-line')
        .style('stroke', letterColors[letter].stroke)
        .style('stroke-width', '0.875px'); // Increased by 25% (0.7 * 1.25)

      // Create center dot
      const centerDot = dotsGroup.append('circle')
        .attr('class', 'center-dot')
        .attr('r', 2.5) // Increased by 25% (2 * 1.25)
        .style('fill', letterColors[letter].fill)
        .style('stroke', 'white')
        .style('stroke-width', '1.5px'); // Increased by 25%

      // Create arm dots
      const armDots = dotsGroup.selectAll('.arm-dot')
        .data(coefficients)
        .enter()
        .append('circle')
        .attr('class', 'arm-dot')
        .attr('r', 1) // Increased by 25% (0.8 * 1.25)
        .style('fill', letterColors[letter].armFill)
        .style('stroke', 'white')
        .style('stroke-width', '0.75px'); // Increased by 25%

      return {
        coefficients,
        centerX,
        centerY,
        circles,
        lines,
        centerDot,
        armDots,
        pathGroup,
        allPathData,
        currentSegmentPoints,
        maxTotalPoints,
        segmentLength,
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

      // Add current drawing position to paths
      const finalPos = positions[positions.length - 1];
      const newPoint = [finalPos.tipX, finalPos.tipY];

      // Add point to current segment
      letterData.currentSegmentPoints.push(newPoint);
      letterData.allPathData.push(newPoint);

      // Create a new path segment when we have enough points
      if (letterData.currentSegmentPoints.length >= letterData.segmentLength) {
        const lineGenerator = d3.line()
          .x(d => d[0])
          .y(d => d[1])
          .curve(d3.curveCatmullRom.alpha(0.5));

        letterData.pathGroup.append('path')
          .attr('d', lineGenerator(letterData.currentSegmentPoints))
          .style('fill', 'none')
          .style('stroke', letterColors[letterData.letter].path)
          .style('stroke-width', '2px') // Increased by 25% (1.6 * 1.25)
          .style('stroke-linecap', 'round')
          .style('stroke-linejoin', 'round')
          .style('mix-blend-mode', 'lighten');

        // Start new segment with overlap for smoothness
        letterData.currentSegmentPoints = letterData.currentSegmentPoints.slice(-5);
      }

      // Limit total points to prevent performance issues
      if (letterData.allPathData.length > letterData.maxTotalPoints) {
        letterData.allPathData.shift();
        
        // Remove old path elements to maintain performance
        const paths = letterData.pathGroup.selectAll('path');
        if (paths.size() > 50) {
          paths.filter((d, i) => i < 5).remove();
        }
      }
    }

    // Main animation function
    function animate(elapsed) {
      const t = (elapsed / 7000) % 1; // 7 second cycle - faster animation
      
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
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden relative">
      <svg
        ref={svgRef}
        className="drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }}
      />
    </div>
  );
};

export default App;