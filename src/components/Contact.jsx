import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.85) 100%)'
    }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Ready to collaborate on your next breakthrough project?
          </p>
        </div>

        {/* Contact Content */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 w-full max-w-2xl"
                 style={{ 
                   filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))',
                   background: 'rgba(255, 255, 255, 0.05)'
                 }}>
              <h3 className="text-3xl font-bold text-white mb-12 text-center">
                Contact Information
              </h3>
              
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 text-xl font-medium">info@tozerlabs.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-200/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-100/90 text-xl font-medium">+44 (0) 20 7123 4567</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-100/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-50/85 text-xl font-medium">London, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 