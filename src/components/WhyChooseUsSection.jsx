import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import trainerImage from '../assets/goggins.jpg'; 

const WhyChooseUsSection = () => {
  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Should People Choose Fitnexia Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Personal Training</h3>
              <p className="text-gray-400">Our personal trainers can help you create a personalized fitness plan and track your progress.</p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Expert Trainer</h3>
              <p className="text-gray-400">Our gym is proud to offer a team of highly skilled and certified trainers to help achieve your health & fitness goals.</p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Flexible Time</h3>
              <p className="text-gray-400">There are many fitness classes that are offered during off-peak hours, such as early morning or late evening.</p>
            </div>
            <ScrollLink to="plans-section" smooth={true} duration={500}>
              <button className="mt-4 bg-primary hover:bg-secondary text-white py-3 px-6 rounded-full text-lg">
                Join Today
              </button>
            </ScrollLink>
          </div>
          <div className="relative">
            <img src={trainerImage} alt="Trainer" className="rounded-lg shadow-lg w-full" />
            <div className="absolute top-4 left-4 bg-white text-dark p-2 rounded-lg shadow-md flex items-center">
              <span className="text-xl font-bold mr-2">70 bpm</span>
              <span className="text-sm text-gray-600">Heart Rate</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-white text-dark p-2 rounded-lg shadow-md flex items-center">
              <span className="text-xl font-bold mr-2">24%</span>
              <span className="text-sm text-gray-600">Fat Burning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;
