import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.93) 50%, rgba(51, 65, 85, 0.9) 100%)'
    }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About TOZER LABS
          </h2>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-center text-white/90">
              Tozer Labs is a technical consultancy focused on Web3 security and data engineering.
            </p>
                        
            <p className="text-center text-white/90">
              My background spans security research, full-stack development, and data analysis. I've worked on audits for various protocols, built governance tools for DAOs, and created data systems for everything from trading bots to government mapping projects. I try to contribute to open-source projects when I can.
            </p>
            
            <p className="text-center text-white/90">
              I approach problems by understanding the underlying systems first. Whether it's analyzing a smart contract, designing a data pipeline, or building a frontend, I dig into the technical details before implementing solutions.
            </p>
            
            <p className="text-center font-medium text-white">
              If you're working on something that needs thorough research and technical work, I'd be happy to help.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 