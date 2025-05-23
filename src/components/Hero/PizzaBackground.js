import React from 'react';

const PizzaBackground = () => {
  // Array of colorful circle backgrounds
  const colorfulBackgrounds = [
    'bg-orange-200/30 dark:bg-orange-900/15',
    'bg-red-200/30 dark:bg-red-900/15',
    'bg-pink-200/30 dark:bg-pink-900/15',
    'bg-amber-200/30 dark:bg-amber-900/15'
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Colored blobs matching Hero section */}
      <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/15 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-200/30 dark:bg-red-900/15 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-2/3 left-1/2 w-72 h-72 bg-pink-200/30 dark:bg-pink-900/15 rounded-full blur-3xl animate-drift"></div>

      {/* Pizza pattern background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-15">
        <div className="relative w-full h-full">
          {/* Create a grid of pizza images */}
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-around">
              {Array.from({ length: 6 }).map((_, colIndex) => {
                // Pick a random background color
                const bgColorClass = colorfulBackgrounds[Math.floor(Math.random() * colorfulBackgrounds.length)];
                // Random size between 80px and 120px
                const size = 80 + Math.floor(Math.random() * 40);
                
                return (
                  <div 
                    key={`pizza-${rowIndex}-${colIndex}`}
                    className="relative blur-md"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      marginTop: `${rowIndex * 20}vh`,
                      marginLeft: `${colIndex * 15}vw`,
                      position: 'absolute',
                      animation: `${Math.random() > 0.5 ? 'float' : 'drift'} ${10 + Math.random() * 10}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 10}s`
                    }}
                  >
                    {/* Add a colored circle behind some of the pizzas */}
                    {Math.random() > 0.3 && (
                      <div className={`absolute inset-0 -z-10 ${bgColorClass} rounded-full scale-125 blur-md`}></div>
                    )}
                    <img 
                      src="/pizza.png" 
                      alt="Pizza" 
                      className="w-full h-full object-contain opacity-30 dark:opacity-20"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/95 via-red-50/90 to-pink-50/85 dark:from-dark-primary/95 dark:via-dark-secondary/90 dark:to-dark-accent/85 backdrop-blur-md"></div>
    </div>
  );
};

export default PizzaBackground;