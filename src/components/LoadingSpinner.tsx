import type React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center px-4 py-2 bg-gray-800 rounded-full shadow-lg">
        <output className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></output>
        <span className="ml-3 text-sm text-white">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
