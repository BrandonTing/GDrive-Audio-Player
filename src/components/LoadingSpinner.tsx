import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center px-4 py-2 bg-gray-800 rounded-full shadow-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span className="ml-3 text-white text-sm">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;