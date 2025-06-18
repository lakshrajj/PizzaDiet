import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Star, Gift, X } from 'lucide-react';

const BOGOSection = ({ onAddToCart }) => {
  const { data } = useData();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedPizzas, setSelectedPizzas] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Get all BOGO offers
  const bogoOffers = data.offers?.bogo?.filter(offer => offer.active) || [];

  // Get all pizzas from valid categories (excluding pizzas with only small sizes)
  const getValidPizzas = (offer) => {
    const validPizzas = [];
    offer.validCategories.forEach(category => {
      if (data.menuItems[category]) {
        // Filter pizzas that have Medium or Large sizes available
        const categoryPizzas = data.menuItems[category].filter(pizza => {
          return pizza.sizes && pizza.sizes.some(size => 
            size.name === 'Medium' || size.name === 'Large'
          );
        });
        validPizzas.push(...categoryPizzas);
      }
    });
    return validPizzas;
  };

  const BOGOModal = ({ offer, onClose }) => {
    const validPizzas = getValidPizzas(offer);
    const [pizza1, setPizza1] = useState(null);
    const [pizza2, setPizza2] = useState(null);
    const [size1, setSize1] = useState(null);
    const [size2, setSize2] = useState(null);

    const calculateBOGOPrice = () => {
      if (!pizza1 || !pizza2 || !size1 || !size2) return 0;
      
      // Get categories for both pizzas
      const cat1 = getCategoryForPizza(pizza1);
      const cat2 = getCategoryForPizza(pizza2);
      
      // Determine the highest tier between the two pizzas
      const tier1 = offer.categoryMapping[cat1] || 'classic';
      const tier2 = offer.categoryMapping[cat2] || 'classic';
      
      // Get the highest tier (supreme > deluxe > classic)
      const tierPriority = { classic: 1, deluxe: 2, supreme: 3 };
      const finalTier = tierPriority[tier1] >= tierPriority[tier2] ? tier1 : tier2;
      
      // Determine size (use larger size if different)
      const finalSize = (size1.name === 'Large' || size2.name === 'Large') ? 'Large' : 'Medium';
      
      // Return combo price
      return offer.pricing?.[finalSize]?.[finalTier] || 0;
    };

    const getCategoryForPizza = (pizza) => {
      // Find which category this pizza belongs to
      const validPizzas = getValidPizzas(offer);
      for (const category of offer.validCategories) {
        if (data.menuItems[category]?.some(item => item.id === pizza.id)) {
          return category;
        }
      }
      return 'classic-veg'; // fallback
    };

    const getComboInfo = () => {
      if (!pizza1 || !pizza2 || !size1 || !size2) return null;
      
      const cat1 = getCategoryForPizza(pizza1);
      const cat2 = getCategoryForPizza(pizza2);
      const tier1 = offer.categoryMapping[cat1] || 'classic';
      const tier2 = offer.categoryMapping[cat2] || 'classic';
      const tierPriority = { classic: 1, deluxe: 2, supreme: 3 };
      const finalTier = tierPriority[tier1] >= tierPriority[tier2] ? tier1 : tier2;
      const finalSize = (size1.name === 'Large' || size2.name === 'Large') ? 'Large' : 'Medium';
      
      return {
        tier: finalTier.charAt(0).toUpperCase() + finalTier.slice(1),
        size: finalSize,
        price: offer.pricing?.[finalSize]?.[finalTier] || 0
      };
    };

    const handleAddToCart = () => {
      if (!pizza1 || !pizza2 || !size1 || !size2) {
        alert('Please select both pizzas and their sizes');
        return;
      }

      const bogoPrice = calculateBOGOPrice();
      const savings = (size1.price + size2.price) - bogoPrice;

      // Add as a single BOGO item to cart
      onAddToCart({
        id: `bogo-${Date.now()}`,
        name: `BOGO: ${pizza1.name} + ${pizza2.name}`,
        description: `${pizza1.name} (${size1.name}) + ${pizza2.name} (${size2.name})`,
        type: 'bogo',
        offerName: offer.name,
        pizza1: { ...pizza1, size: size1 },
        pizza2: { ...pizza2, size: size2 },
        price: bogoPrice,
        originalPrice: size1.price + size2.price,
        savings: savings,
        category: 'offers'
      });

      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{offer.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{offer.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Pricing Guide */}
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white text-center">
                🎉 BOGO Combo Pricing
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-center mb-2 text-gray-700 dark:text-gray-200">Medium Combos</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Classic Medium:</span>
                      <span className="font-bold text-green-600">₹400</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deluxe Medium:</span>
                      <span className="font-bold text-blue-600">₹450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supreme Medium:</span>
                      <span className="font-bold text-purple-600">₹500</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-center mb-2 text-gray-700 dark:text-gray-200">Large Combos</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Classic Large:</span>
                      <span className="font-bold text-green-600">₹550</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deluxe Large:</span>
                      <span className="font-bold text-blue-600">₹650</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supreme Large:</span>
                      <span className="font-bold text-purple-600">₹700</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center mt-3 text-gray-600 dark:text-gray-400">
                *Final price determined by highest category and largest size selected<br/>
                *Available for Classic, Deluxe & Supreme pizzas only (Medium & Large sizes)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pizza 1 Selection */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Select First Pizza</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {validPizzas.map(pizza => (
                    <div 
                      key={`pizza1-${pizza.id}`}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        pizza1?.id === pizza.id 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                      onClick={() => setPizza1(pizza)}
                    >
                      <div className="flex items-center gap-4">
                        {pizza.image && (
                          <img src={pizza.image} alt={pizza.name} className="w-16 h-16 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{pizza.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{pizza.description}</p>
                        </div>
                      </div>
                      
                      {pizza1?.id === pizza.id && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {pizza.sizes.filter(size => size.name === 'Medium' || size.name === 'Large').map((size, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSize1(size);
                              }}
                              className={`p-2 rounded-lg text-center border-2 ${
                                size1?.name === size.name
                                  ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="font-semibold text-sm">{size.name}</div>
                              <div className="text-orange-500 text-sm">₹{size.price}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pizza 2 Selection */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Select Second Pizza</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {validPizzas.map(pizza => (
                    <div 
                      key={`pizza2-${pizza.id}`}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        pizza2?.id === pizza.id 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                      onClick={() => setPizza2(pizza)}
                    >
                      <div className="flex items-center gap-4">
                        {pizza.image && (
                          <img src={pizza.image} alt={pizza.name} className="w-16 h-16 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{pizza.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{pizza.description}</p>
                        </div>
                      </div>
                      
                      {pizza2?.id === pizza.id && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {pizza.sizes.filter(size => size.name === 'Medium' || size.name === 'Large').map((size, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSize2(size);
                              }}
                              className={`p-2 rounded-lg text-center border-2 ${
                                size2?.name === size.name
                                  ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="font-semibold text-sm">{size.name}</div>
                              <div className="text-orange-500 text-sm">₹{size.price}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {pizza1 && pizza2 && size1 && size2 && (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">BOGO Combo Summary</h3>
                
                {/* Combo Type Display */}
                {(() => {
                  const comboInfo = getComboInfo();
                  return comboInfo && (
                    <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-orange-800 dark:text-orange-200">
                          {comboInfo.tier} {comboInfo.size} Combo
                        </h4>
                        <p className="text-sm text-orange-600 dark:text-orange-300">
                          Buy 1 Get 1 - Special Combo Price
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{pizza1.name} ({size1.name})</span>
                    <span className="text-gray-500">Individual: ₹{size1.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{pizza2.name} ({size2.name})</span>
                    <span className="text-gray-500">Individual: ₹{size2.price}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Individual Price:</span>
                    <span className="line-through text-gray-500">₹{size1.price + size2.price}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>You Save:</span>
                    <span>₹{(size1.price + size2.price) - calculateBOGOPrice()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>BOGO Combo Price:</span>
                    <span>₹{calculateBOGOPrice()}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Gift size={20} />
                  Add BOGO Deal to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🎉 Special Offers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Amazing deals that you can't resist!
          </p>
        </div>

        {bogoOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🎉</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Active Offers</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bogoOffers.map(offer => (
            <div 
              key={offer.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              {offer.image && (
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={offer.image} 
                    alt={offer.name} 
                    className="w-full h-48 object-cover"
                  />
                  {offer.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800">
                        {offer.badge}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{offer.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
                
                {/* Pricing Preview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center">Combo Prices</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-gray-600 dark:text-gray-300">Medium</div>
                      <div className="text-green-600 font-bold">₹400-500</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-600 dark:text-gray-300">Large</div>
                      <div className="text-blue-600 font-bold">₹550-700</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOffer(offer)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Gift size={16} />
                Select Pizzas
              </button>
            </div>
          ))}
          </div>
        )}

        {selectedOffer && (
          <BOGOModal 
            offer={selectedOffer}
            onClose={() => setSelectedOffer(null)}
          />
        )}
      </div>
    </section>
  );
};

export default BOGOSection;