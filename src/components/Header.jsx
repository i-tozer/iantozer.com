import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Animate header appearance after a longer delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Appear after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Track active section based on scroll position
    const handleScroll = () => {
      const sections = ['expertise', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navItems = [
    { id: 'expertise', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}
    >
      <div className="backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src="/logo.svg" 
                alt="Tozer Labs Logo" 
                className="w-8 h-8 filter brightness-0 invert opacity-90"
              />
              <span className="text-white font-bold text-lg tracking-wide">
                TOZER LABS
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    px-4 py-2 text-sm transition-all duration-300 ease-out
                    ${activeSection === item.id 
                      ? 'text-white font-semibold' 
                      : 'text-white/70 hover:text-white hover:font-medium'
                    }
                  `}
                  style={{
                    animationDelay: `${3.5 + index * 0.2}s`
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-white/70 hover:text-white transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 