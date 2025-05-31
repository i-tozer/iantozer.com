import React from 'react';
import Header from './components/Header';
import Hero from './Hero';
import Expertise from './components/Expertise';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      {/* Header - Fixed navigation */}
      <Header />
      
      {/* Hero Section - Full viewport height */}
      <Hero />
      
      {/* Expertise Section */}
      <Expertise />
      
      {/* About Section */}
      <About />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
      
      {/* Additional sections can be added here */}
    </div>
  );
};

export default App;