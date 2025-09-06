
import React from 'react';

const WaterDropletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 2.363.863 4.545 2.28 6.223a.75.75 0 001.06-1.06A8.25 8.25 0 013.75 12c0-4.538 3.69-8.25 8.25-8.25s8.25 3.712 8.25 8.25c0 1.944-.678 3.754-1.8 5.163a.75.75 0 001.06 1.06c1.417-1.678 2.28-3.86 2.28-6.223C21.75 6.615 17.385 2.25 12 2.25z" />
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6.19l-2.47-2.47a.75.75 0 00-1.06 1.06l3.75 3.75a.75.75 0 001.06 0l3.75-3.75a.75.75 0 10-1.06-1.06l-2.47 2.47V6z" clipRule="evenodd" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <WaterDropletIcon className="w-12 h-12 text-blue-600" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Groundwater Pollution Index Calculator
            </h1>
            <p className="text-sm md:text-md text-gray-500 mt-1">
              Automated assessment of heavy metal contamination in groundwater.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
