import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.99) 0%, rgba(30, 41, 59, 0.97) 50%, rgba(51, 65, 85, 0.95) 100%)'
    }} className="border-t border-white/10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Company Name */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            {/* Logo Icon */}
            <img 
              src="/logo.svg" 
              alt="Tozer Labs Logo" 
              className="w-8 h-8 filter brightness-0 invert opacity-90"
            />
            
            {/* Company Name */}
            <div className="text-white font-bold text-lg"
                 style={{ filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))' }}>
              TOZER LABS LTD
            </div>
          </div>

          {/* Copyright */}
          <div className="text-white/60 text-sm">
            © 2025 TOZER LABS LTD. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 