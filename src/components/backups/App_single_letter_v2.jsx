import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { processSVGToFourierWithPaper } from './calculations/svg-to-fourier-paper.js';

const App = () => {
  const svgRef = useRef();
  const animationRef = useRef();
  const [coefficients, setCoefficients] = useState([]);
  const COEFFICIENTS_USED = 20;

  useEffect(() => {
    const loadAndProcessSVG = async () => {
      try {
        const result = await processSVGToFourierWithPaper('src/images/O_FRAME_3.svg', COEFFICIENTS_USED, 3, true);
        
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
    const scale = 120;

    // Set SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Path data for the persistent drawing trail
    let allPathData = [];
    let currentSegmentPoints = [];
    const maxTotalPoints = 5000;
    const segmentLength = 20; // Smaller segments for smoother appearance

    // Create groups for different elements
    const circlesGroup = svg.append('g').attr('class', 'circles');
    const linesGroup = svg.append('g').attr('class', 'lines');
    const pathGroup = svg.append('g').attr('class', 'path');
    const dotsGroup = svg.append('g').attr('class', 'dots');

    // Create circles (skip the DC component for visual purposes)
    const visualCoeffs = coefficients.filter(c => c.frequency !== 0);

    const circles = circlesGroup.selectAll('.circle')
      .data(visualCoeffs)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('r', d => Math.max(d.magnitude * scale, 2))
      .style('fill', 'none')
      .style('stroke', 'rgba(255, 255, 255, 0.15)')
      .style('stroke-width', '1.5px');

    // Create connecting lines
    const lines = linesGroup.selectAll('.connecting-line')
      .data(coefficients)
      .enter()
      .append('line')
      .attr('class', 'connecting-line')
      .style('stroke', 'rgba(255, 255, 255, 0.2)')
      .style('stroke-width', '1px');

    // Create the drawing paths - we'll create these dynamically during animation
    // to allow for overlapping and density accumulation

    // Create center dot
    const centerDot = dotsGroup.append('circle')
      .attr('class', 'center-dot')
      .attr('r', 4)
      .style('fill', '#ff6b6b')
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    // Create arm dots
    const armDots = dotsGroup.selectAll('.arm-dot')
      .data(coefficients)
      .enter()
      .append('circle')
      .attr('class', 'arm-dot')
      .attr('r', 2)
      .style('fill', '#4ecdc4')
      .style('stroke', 'white')
      .style('stroke-width', '1.5px');

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

      // Add current drawing position to paths
      const finalPos = positions[positions.length - 1];
      const newPoint = [finalPos.tipX, finalPos.tipY];

      // Add point to current segment
      currentSegmentPoints.push(newPoint);
      allPathData.push(newPoint);

      // Create a new path segment when we have enough points
      if (currentSegmentPoints.length >= segmentLength) {
        const lineGenerator = d3.line()
          .x(d => d[0])
          .y(d => d[1])
          .curve(d3.curveCatmullRom.alpha(0.5)); // Smoother curve

        pathGroup.append('path')
          .attr('d', lineGenerator(currentSegmentPoints))
          .style('fill', 'none')
          .style('stroke', 'rgba(0, 212, 255, 0.25)')
          .style('stroke-width', '2px')
          .style('stroke-linecap', 'round')
          .style('stroke-linejoin', 'round')
          .style('mix-blend-mode', 'lighten'); // Better for accumulation

        // Start new segment with more overlap for smoothness
        currentSegmentPoints = currentSegmentPoints.slice(-10); // Keep last 10 points for continuity
      }

      // Limit total points to prevent performance issues
      if (allPathData.length > maxTotalPoints) {
        allPathData.shift();
        
        // Remove old path elements to maintain performance
        const paths = pathGroup.selectAll('path');
        if (paths.size() > 100) { // Keep max 100 path segments
          paths.filter((d, i) => i < 10).remove(); // Remove oldest 10
        }
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