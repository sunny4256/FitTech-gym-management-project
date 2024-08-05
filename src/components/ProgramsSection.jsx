import React from 'react';
import { FaDumbbell, FaRunning, FaBicycle, FaHeartbeat } from 'react-icons/fa';

const programs = [
  {
    icon: <FaDumbbell className="text-4xl mb-4" />,
    title: "Strength Training",
    description: "Our trainers will design a progressive workout plan that properly achieves strength gains.",
  },
  {
    icon: <FaHeartbeat className="text-4xl mb-4" />,
    title: "Basic Yoga",
    description: "This program combines yoga with cardio & strength training to help ease weight & fitness.",
  },
  {
    icon: <FaRunning className="text-4xl mb-4" />,
    title: "Body Building",
    description: "For those looking to increase muscle mass, our strength & muscle building programs are ideal.",
  },
  {
    icon: <FaBicycle className="text-4xl mb-4" />,
    title: "Weight Loss",
    description: "Our weight loss programs are designed to help you achieve sustainable lifestyle changes.",
  },
];

const ProgramsSection = () => {
  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          The Best Programs We Offer For You
        </h2>
        <p className="text-center mb-12 text-gray-400">
          We offer a wide range of comprehensive fitness programs designed to cater to individuals of all fitness levels. Our aim is to help you achieve specific goals & maximize results.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:bg-primary transition duration-300"
            >
              <div className="text-gray-400 hover:text-white transition duration-300">
                {program.icon}
                <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                <p className="text-gray-400 hover:text-white transition duration-300">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsSection;
