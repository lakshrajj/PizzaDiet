import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Star } from 'lucide-react';

const MenuSection = ({ onAddToCart }) => {
  const { data } = useData();
  const [activeCategory, setActiveCategory] = useState('featured');

  const categories = [
    { id: 'featured', label: 'Featured', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
    { id: 'simply-veg', label: 'Simply Veg', icon: '🥬', color: 'from-green-500 to-emerald-500' },
    { id: 'deluxe', label: 'Deluxe', icon: '👑', color: 'from-purple-500 to-pink-500' }
  ];

  const MenuItem = ({ item }) => {
    const [selectedSize, setSelectedSize] = useState(item.sizes[1] || item.sizes[0]);

    const handleAddToCart = () => {
      onAddToCart({
        name: item.name,
        description: item.description,
        size: selectedSize.name,
        sizeName: selectedSize.name,
        price: selectedSize.price
      });
    };

    return (
      <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
        {/* Pizza Image */}
        <div className="relative mb-6 overflow-hidden rounded-2xl">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800">
              {item.badge}
            </span>
          </div>
          
          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-800">{item.rating}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.name}</h3>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Size Selection */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Choose Size</h4>
          <div className="grid grid-cols-3 gap-3">
            {item.sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 ${
                  selectedSize.name === size.name
                    ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <div className="font-bold text-gray-800">{size.name}</div>
                <div className="text-orange-500 font-bold">₹{size.price}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Add to Cart • ₹{selectedSize.price}
        </button>
      </div>
    );
  };

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-gray-50 to-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Signature Menu</h2>
          <p className="section-subtitle">
            Crafted with love, served with passion. Each pizza tells a story of flavor and tradition.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-xl scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.menuItems[activeCategory]?.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>

        {(!data.menuItems[activeCategory] || data.menuItems[activeCategory].length === 0) && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🍕</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No items in this category</h3>
            <p className="text-gray-500">Check back soon for new additions!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;