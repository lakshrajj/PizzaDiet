import React from 'react';

const ScrollBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-950">
      {/* Pizza Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute w-24 h-24 top-1/4 left-1/4 animate-float">
          🍕
        </div>
        <div className="absolute w-20 h-20 top-3/4 right-1/3 animate-float-delayed">
          🧀
        </div>
        <div className="absolute w-16 h-16 bottom-1/4 right-1/4 animate-bounce-delayed">
          🍅
        </div>
        <div className="absolute w-20 h-20 top-1/2 left-1/3 animate-pulse">
          🌿
        </div>
        <div className="absolute w-16 h-16 bottom-1/3 left-1/4 animate-float">
          🫑
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-200/20 dark:bg-red-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] dark:opacity-[0.03]"></div>
    </div>
  );
};

export default ScrollBackground; 