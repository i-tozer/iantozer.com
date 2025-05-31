import React from 'react';

const Expertise = () => {
  const expertiseAreas = [
    {
      icon: (
        <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Protocol Research & Web3 Auditing",
      description: "Contributing to blockchain security through public audits for protocols including Olas, Curves, and Lens Protocol, and through  vulnerability assessments."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-200/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Data Engineering & ETL Solutions",
      description: "Working with complex datasets to develop insights through custom ETL pipelines, having contributed to Web3 employment trend analysis for Solana Foundation and supported GIS-based asset mapping solutions for government contracts."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-100/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Full-Stack Development & System Architecture",
      description: "Developing applications across frontend and backend, working with Golang, JavaScript, and Rust, with experience in containerisation, database optimisation, and trading systems."
    }
  ];

  return (
    <section id="expertise" className="py-20" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.92) 100%)'
    }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Expertise
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Research and software development across traditional and web3 disciplines
          </p>
        </div>

        {/* Expertise Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 group transition-all duration-300"
              style={{ 
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))',
                background: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Icon */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300"
                   style={{ filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))' }}>
                {area.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-4 leading-tight"
                  style={{ filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))' }}>
                {area.title}
              </h3>

              {/* Description */}
              <p className="text-white/80 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise; 