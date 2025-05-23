import React from 'react';
import { Plus } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 overflow-hidden pt-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-2xl">🏆</span>
            <span className="text-orange-600 font-semibold">Premium Vegetarian Pizzas</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Craving Something
            <span className="block text-5xl lg:text-6xl mt-2">Extraordinary?</span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Experience the perfect blend of fresh ingredients, authentic flavors, and culinary artistry with our handcrafted vegetarian pizzas that will transport your taste buds to heaven.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <a href="#menu" className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
              <span>Order Now</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Plus size={16} />
              </div>
            </a>
            <a href="#gallery" className="px-8 py-4 border-2 border-orange-500 text-orange-500 rounded-full font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl text-center">
              View Gallery
            </a>
          </div>
        </div>
        
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <div className="w-96 h-96 lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-br from-orange-300 via-red-300 to-pink-300 flex items-center justify-center shadow-2xl animate-float">
              <div className="text-[150px] lg:text-[200px] animate-spin-slow">🍕</div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce">
              🧀
            </div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce-delayed">
              🍅
            </div>
            <div className="absolute top-1/2 -right-12 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-xl animate-pulse">
              🌶️
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;