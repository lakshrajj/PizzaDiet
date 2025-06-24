import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Star, Filter, RefreshCw } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../../config/api';

const MenuSection = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // MongoDB state
  const [mongoMenuItems, setMongoMenuItems] = useState({});
  const [mongoCategories, setMongoCategories] = useState([]);
  const [loadingMenuData, setLoadingMenuData] = useState(false);

  // Get current data source (always use MongoDB)
  const categories = mongoCategories.reduce((acc, cat) => ({ ...acc, [cat.categoryId]: cat }), {});
  const categoryKeys = Object.keys(categories);

  // Fetch menu data from MongoDB
  const fetchMenuData = useCallback(async () => {
    setLoadingMenuData(true);
    try {
      const data = await apiRequest(API_ENDPOINTS.MENU_ITEMS_GROUPED);
      if (data.success) {
        setMongoMenuItems(data.menuItems);
        setMongoCategories(data.categories);
        
        // Set first category as active if available
        if (data.categories.length > 0) {
          const firstCategoryId = data.categories[0].categoryId;
          if (!Object.keys(data.menuItems).includes(activeCategory)) {
            setActiveCategory(firstCategoryId);
          }
        }
      } else {
        console.error('Failed to fetch menu data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoadingMenuData(false);
    }
  }, [activeCategory]);

  // Load menu data when component mounts
  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Set first available category as active if current doesn't exist
  useEffect(() => {
    if (categoryKeys.length > 0 && !categoryKeys.includes(activeCategory)) {
      setActiveCategory(categoryKeys[0]);
    }
  }, [categoryKeys, activeCategory]);

  const MenuItem = ({ item }) => {
    const [selectedSize, setSelectedSize] = useState(item.sizes?.[0]);

    const handleAddToCart = () => {
      if (!selectedSize) {
        alert('Please select a size first!');
        return;
      }

      onAddToCart({
        id: item._id || item.id, // Handle both MongoDB (_id) and local (id) formats
        name: item.name,
        description: item.description,
        size: selectedSize.name,
        sizeName: selectedSize.name,
        price: selectedSize.price,
        category: item.category
      });
    };

    return (
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 dark:border-gray-700">
        {/* Pizza Image */}
        {item.image && (
          <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-xl">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            
            {/* Badge */}
            {item.badge && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {item.badge}
                </span>
              </div>
            )}
            
            {/* Rating */}
            {item.rating && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">{item.rating}</span>
              </div>
            )}
          </div>
        )}

        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">{item.name}</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3">{item.description}</p>
        </div>

        {/* Size Selection */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-4">Choose Size</h4>
            <div className={`grid gap-2 sm:gap-3 ${
              item.sizes.length <= 3 ? 'grid-cols-' + item.sizes.length : 'grid-cols-3'
            }`}>
              {item.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`p-2 sm:p-4 rounded-lg sm:rounded-xl text-center transition-all duration-300 border-2 ${
                    selectedSize?.name === size.name
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                  }`}
                >
                  <div className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{size.name}</div>
                  <div className="text-orange-500 dark:text-orange-400 text-sm sm:text-base font-bold">₹{size.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg hover:scale-105 disabled:scale-100 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl group"
        >
          <Plus size={16} className="sm:size-20 group-hover:rotate-90 transition-transform duration-300" />
          Add to Cart {selectedSize && `• ₹${selectedSize.price}`}
        </button>
      </div>
    );
  };

  return (
    <section id="menu" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="section-title">Our Signature Menu</h2>
          <p className="section-subtitle dark:text-gray-300">
            Crafted with love, served with passion. Each pizza tells a story of flavor and tradition.
          </p>
          {loadingMenuData && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading from database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-center mb-6 sm:mb-8">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white dark:bg-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <Filter size={16} />
            <span className="font-semibold text-sm sm:text-base dark:text-white">Category: {categories[activeCategory]?.name || activeCategory}</span>
          </button>
        </div>
        
        {/* Filter Drawer for Mobile */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}>  
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-5 sm:p-6 shadow-xl" onClick={e => e.stopPropagation()}>              
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center dark:text-white">Select Category</h3>
              <div className="flex flex-col gap-2 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pb-safe">
                {categoryKeys.map(categoryKey => {
                  const category = categories[categoryKey];
                  return (
                    <button
                      key={categoryKey}
                      onClick={() => {
                        setActiveCategory(categoryKey);
                        setIsFilterOpen(false);
                      }}
                      className={`p-3 sm:p-4 rounded-xl flex items-center gap-3 ${activeCategory === categoryKey ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <span className="text-lg sm:text-xl">{category.icon || '🍕'}</span>
                      <span className="dark:text-white">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Category Tabs */}
        {categoryKeys.length > 0 && (
          <div className="hidden md:flex justify-center flex-wrap gap-3 lg:gap-4 mb-12 lg:mb-16">
            {categoryKeys.map(categoryKey => {
              const category = categories[categoryKey];
              return (
                <button
                  key={categoryKey}
                  onClick={() => setActiveCategory(categoryKey)}
                  className={`group px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 lg:gap-3 ${
                    activeCategory === categoryKey
                      ? `bg-gradient-to-r ${category.color || 'from-orange-500 to-red-500'} text-white shadow-xl scale-105`
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  <span className="text-lg lg:text-xl">{category.icon || '🍕'}</span>
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {mongoMenuItems?.[activeCategory]?.map(item => (
            <MenuItem key={item.id || item._id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {(!mongoMenuItems?.[activeCategory] || mongoMenuItems[activeCategory].length === 0) && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4 opacity-50">🍕</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">No items in this category</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for new additions!</p>
          </div>
        )}

        {/* No Categories State */}
        {categoryKeys.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4 opacity-50">📋</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">No menu categories available</h3>
            <p className="text-gray-500 dark:text-gray-400">Please contact the administrator to add menu categories.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;