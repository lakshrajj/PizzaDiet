import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Star, Eye, X } from 'lucide-react';

const Gallery = () => {
  const { data } = useData();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filters = [
    { id: 'all', label: 'All', icon: '🍽️' },
    { id: 'pizzas', label: 'Pizzas', icon: '🍕' },
    { id: 'ingredients', label: 'Ingredients', icon: '🥬' },
    { id: 'specials', label: 'Specials', icon: '⭐' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? data.galleryItems 
    : data.galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 bg-gradient-to-b from-white to-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Delicious Gallery</h2>
          <p className="section-subtitle">
            A visual feast of our handcrafted pizzas and premium ingredients that make every bite extraordinary
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`group px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              <span className="text-xl">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Improved Gallery Grid with Better Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer bg-white aspect-square"
              onClick={() => setSelectedImage(item)}
            >
              <div className="w-full h-full overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm opacity-90">Premium Quality</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 capitalize">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Show message when no items match filter */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🍕</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title} 
                className="w-full h-auto max-h-[80vh] object-contain" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                <p className="text-white/90 capitalize">{selectedImage.category}</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;