import React from 'react';

const FluidBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Floating blobs */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-red-200/20 dark:bg-red-900/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl animate-drift"></div>
      
      {/* Secondary blobs with different animations */}
      <div className="absolute top-1/3 right-1/3 w-[350px] h-[350px] bg-pink-200/15 dark:bg-zinc-800/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-blue-200/15 dark:bg-zinc-700/20 rounded-full blur-3xl animate-drift" style={{ animationDelay: '-5s' }}></div>
      
      {/* Moving particles */}
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 20 }).map((_, index) => {
          // Determine random size (1-3px)
          const size = 1 + Math.floor(Math.random() * 3);
          // Determine color based on index
          const bgColor = index % 3 === 0 
            ? 'bg-orange-300/30 dark:bg-orange-700/20' 
            : index % 3 === 1 
              ? 'bg-red-300/30 dark:bg-red-700/20' 
              : 'bg-amber-300/30 dark:bg-amber-700/20';
          
          return (
            <div 
              key={index}
              className={`absolute rounded-full ${bgColor}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${index % 2 === 0 ? 'float' : 'sway'} ${5 + Math.random() * 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          );
        })}
      </div>
      
      {/* Swirling effect */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 overflow-hidden">
        <div className="absolute -inset-[100px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_0,_#f97316_100%)] dark:bg-[radial-gradient(circle_at_center,_rgba(30,30,30,0)_0,_#f97316_100%)] opacity-30 blur-3xl animate-spin-slow"></div>
      </div>
      
      {/* Light rays */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 dark:opacity-10">
        <div className="absolute top-0 left-1/3 w-[1px] h-[30vh] bg-gradient-to-b from-orange-500/0 via-orange-500 to-orange-500/0 animate-float-delayed"></div>
        <div className="absolute top-0 left-2/3 w-[1px] h-[40vh] bg-gradient-to-b from-red-500/0 via-red-500 to-red-500/0 animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-0 left-1/4 w-[1px] h-[25vh] bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0 animate-float-delayed" style={{ animationDelay: '-4s' }}></div>
      </div>
    </div>
  );
};

export default FluidBackground;