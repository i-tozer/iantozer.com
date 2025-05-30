import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { processSVGToFourierWithPaper } from './calculations/svg-to-fourier-paper.js';

const App = () => {
  const svgRef = useRef();
  const animationRef = useRef();
  const [coefficients, setCoefficients] = useState([]);
  const COEFFICIENTS_USED = 120;

  useEffect(() => {
    const loadAndProcessSVG = async () => {
      try {
        const result = await processSVGToFourierWithPaper('src/images/T_FRAME.svg', COEFFICIENTS_USED, 3, true);
        
        console.log(result);

        const sortedCoeffs = [...result.fourierCoefficients]
          .sort((a, b) => b.magnitude - a.magnitude)
          .slice(0, COEFFICIENTS_USED);

        setCoefficients(sortedCoeffs);

      } catch (error) {
        console.error('Error processing SVG:', error);
      }
    };

    loadAndProcessSVG();
  }, []);


  useEffect(() => {
    if (coefficients.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Animation setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const scale = 250;

    // Set SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Path data for the persistent drawing trail
    let pathData = "";
    const maxPathLength = 2000; // Reduced for better performance
    let pointCount = 0;

    // Create groups for different elements
    const circlesGroup = svg.append('g').attr('class', 'circles');
    const linesGroup = svg.append('g').attr('class', 'lines');
    const pathGroup = svg.append('g').attr('class', 'path');
    const dotsGroup = svg.append('g').attr('class', 'dots');

    // Create single path element for immediate drawing
    const drawingPath = pathGroup.append('path')
      .style('fill', 'none')
      .style('stroke', '#00D4FF')
      .style('stroke-width', '3px')
      .style('stroke-linecap', 'round')
      .style('stroke-linejoin', 'round')
      .style('opacity', 0.8)
      .style('filter', 'drop-shadow(0 0 3px rgba(0, 212, 255, 0.3))');

    // Create circles (skip the DC component for visual purposes)
    const visualCoeffs = coefficients.filter(c => c.frequency !== 0);

    const circles = circlesGroup.selectAll('.circle')
      .data(visualCoeffs)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('r', d => Math.max(d.magnitude * scale, 2))
      .style('fill', 'none')
      .style('stroke', (d, i) => {
        // Color circles based on frequency - mathematical spectrum
        const hue = (Math.abs(d.frequency) * 30) % 360;
        return `hsl(${hue}, 70%, 60%)`;
      })
      .style('stroke-width', d => Math.max(d.magnitude * scale * 0.02, 1.5) + 'px')
      .style('opacity', d => Math.min(0.8, d.magnitude * 2 + 0.3));

    // Create connecting lines
    const lines = linesGroup.selectAll('.connecting-line')
      .data(coefficients)
      .enter()
      .append('line')
      .attr('class', 'connecting-line')
      .style('stroke', (d, i) => {
        // Gradient from golden ratio colors for mathematical elegance
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
        const hue = (i * 137.5) % 360; // Golden angle
        return `hsl(${hue}, 60%, 70%)`;
      })
      .style('stroke-width', d => Math.max(d.magnitude * scale * 0.015, 1) + 'px')
      .style('opacity', 0.6);

    // Create the drawing paths - we'll create these dynamically during animation
    // to allow for overlapping and density accumulation

    // Create center dot
    const centerDot = dotsGroup.append('circle')
      .attr('class', 'center-dot')
      .attr('r', 6)
      .style('fill', '#FFD700') // Mathematical gold
      .style('stroke', '#FFF8DC')
      .style('stroke-width', '3px')
      .style('filter', 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))');

    // Create arm dots
    const armDots = dotsGroup.selectAll('.arm-dot')
      .data(coefficients)
      .enter()
      .append('circle')
      .attr('class', 'arm-dot')
      .attr('r', d => Math.max(d.magnitude * scale * 0.02, 2))
      .style('fill', (d, i) => {
        // Use mathematical color progression
        const hue = (Math.abs(d.frequency) * 30) % 360;
        return `hsl(${hue}, 80%, 65%)`;
      })
      .style('stroke', '#FFFFFF')
      .style('stroke-width', '1.5px')
      .style('filter', (d, i) => `drop-shadow(0 0 4px hsla(${(Math.abs(d.frequency) * 30) % 360}, 80%, 65%, 0.6))`);

    // Calculate epicycle positions at time t
    function calculateEpicyclePositions(t) {
      let x = centerX;
      let y = centerY;
      const positions = [{ x, y }];

      for (let i = 0; i < coefficients.length; i++) {
        const coeff = coefficients[i];
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

    // Animation function
    function animate(elapsed) {
      const t = (elapsed / 6000) % 1; // 6 second cycle
      const positions = calculateEpicyclePositions(t);

      // Update circles
      circles
        .attr('cx', (d, i) => {
          const pos = positions.find(p => p.frequency === d.frequency);
          return pos ? pos.centerX : centerX;
        })
        .attr('cy', (d, i) => {
          const pos = positions.find(p => p.frequency === d.frequency);
          return pos ? pos.centerY : centerY;
        });

      // Update connecting lines
      lines
        .attr('x1', (d, i) => i === 0 ? positions[0].x : positions[i].centerX)
        .attr('y1', (d, i) => i === 0 ? positions[0].y : positions[i].centerY)
        .attr('x2', (d, i) => positions[i + 1] ? positions[i + 1].centerX : positions[i].tipX)
        .attr('y2', (d, i) => positions[i + 1] ? positions[i + 1].centerY : positions[i].tipY);

      // Update center dot
      centerDot
        .attr('cx', positions[0].x)
        .attr('cy', positions[0].y);

      // Update arm dots
      armDots
        .attr('cx', (d, i) => positions[i + 1] ? positions[i + 1].tipX : positions[i].tipX)
        .attr('cy', (d, i) => positions[i + 1] ? positions[i + 1].tipY : positions[i].tipY);

      // IMMEDIATE line drawing - draw directly at the tip position
      const finalPos = positions[positions.length - 1];
      
      if (pointCount === 0) {
        // Start the path
        pathData = `M${finalPos.tipX},${finalPos.tipY}`;
      } else {
        // Add line to current position
        pathData += `L${finalPos.tipX},${finalPos.tipY}`;
      }
      
      pointCount++;

      // Limit path length for performance
      if (pointCount > maxPathLength) {
        // Remove old points by finding the first 'L' and removing everything before it
        const firstL = pathData.indexOf('L');
        if (firstL !== -1) {
          pathData = 'M' + pathData.substring(firstL + 1);
          pointCount--;
        }
      }

      // Update the path immediately
      drawingPath.attr('d', pathData);

      // Dynamic color update (less expensive)
      if (pointCount % 10 === 0) { // Update color every 10 frames for performance
        const cyclePosition = (elapsed / 6000) % 1;
        const hue = (cyclePosition * 360 + 180) % 360;
        drawingPath.style('stroke', `hsl(${hue}, 85%, 70%)`);
      }
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
  }, [coefficients]);


  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden relative">
      <svg
        ref={svgRef}
        className="drop-shadow-2xl"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))',
          background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.8) 70%, rgba(2, 6, 23, 1) 100%)'
        }}
      />
    </div>
  );
};

export default App;