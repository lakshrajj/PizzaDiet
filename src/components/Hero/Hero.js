import React from 'react';
import { Plus } from 'lucide-react';
import PizzaBackground from './PizzaBackground';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-accent overflow-hidden pt-24">
      {/* Pizza Background */}
      <PizzaBackground />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-2xl">🏆</span>
            <span className="text-orange-600 dark:text-dark-orange font-semibold">Premium Vegetarian Pizzas</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Craving Something
            <span className="block text-5xl lg:text-6xl mt-2">Extraordinary?</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            Experience the perfect blend of fresh ingredients, authentic flavors, and culinary artistry with our handcrafted vegetarian pizzas that will transport your taste buds to heaven.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <a href="#menu" className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 dark:from-dark-purple dark:to-dark-blue text-white rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
              <span>Order Now</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Plus size={16} />
              </div>
            </a>
            <a href="#gallery" className="px-8 py-4 border-2 border-orange-500 dark:border-dark-teal text-orange-500 dark:text-dark-teal rounded-full font-bold text-lg hover:bg-orange-500 dark:hover:bg-dark-teal hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl text-center">
              View Gallery
            </a>
          </div>
        </div>
        
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <div className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] rounded-full bg-gradient-to-br from-orange-300 via-red-300 to-pink-300 dark:bg-gradient-to-r dark:from-zinc-700 dark:via-zinc-600 dark:to-neutral-500 flex items-center justify-center shadow-2xl">
              <div className="w-[480px] h-[480px] lg:w-[650px] lg:h-[650px]" style={{animation: "float 4s ease-in-out infinite"}}>
                <img src="/pizza.png" alt="Pizza" className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-white dark:bg-dark-secondary rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce">
              🧀
            </div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-white dark:bg-dark-secondary rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce-delayed">
              🍅
            </div>
            <div className="absolute top-1/2 -right-12 w-14 h-14 bg-white dark:bg-dark-secondary rounded-full shadow-lg flex items-center justify-center text-xl animate-pulse">
              🌶️
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;