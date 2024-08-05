import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import coverImage from '../assets/gym1.jpg'; 

const HeroSection = () => {
  return (
    <div className="bg-dark text-light py-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 animate-slideIn">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fadeIn">
          Building strong minds and bodies
          </h1>
          <p className="text-lg md:text-2xl mt-4 animate-fadeIn delay-1s">
          We are always ready to help you transform your lives through fitness
          </p>
          <ScrollLink to="plans-section" smooth={true} duration={500}>
            <button className="mt-6 bg-primary hover:bg-secondary text-white py-3 px-6 rounded-full text-lg animate-fadeIn delay-2s">
              Get Started
            </button>
          </ScrollLink>
        </div>
        <div className="w-full md:w-1/2 animate-slideIn delay-1s">
          <img src={coverImage} alt="Fitness" className="rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
