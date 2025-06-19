import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Star, Package, Gift, X } from 'lucide-react';

const OffersSection = ({ onAddToCart }) => {
  const { data } = useData();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Get all BOGO offers
  const bogoOffers = data.offers?.bogo?.filter(offer => offer.active) || [];
  
  // Get all combo offers
  const comboOffers = data.offers?.combos?.filter(offer => offer.active) || [];

  // Get all pizzas from valid categories (excluding pizzas with only small sizes) for BOGO
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

  // Get pizzas for combo selection based on combo requirements
  const getPizzasForCombo = (combo) => {
    const pizzaItems = combo.items.filter(item => item.type === 'pizza');
    const selectablePizzaItems = pizzaItems.filter(item => item.selectable);
    
    if (selectablePizzaItems.length === 0) {
      return []; // No selectable pizzas
    }
    
    // If combo has category restriction, only show pizzas from that category
    const firstSelectablePizza = selectablePizzaItems[0];
    if (firstSelectablePizza.category) {
      return data.menuItems[firstSelectablePizza.category] || [];
    }
    
    // Otherwise show all pizzas
    const allPizzas = [];
    Object.values(data.menuItems || {}).forEach(category => {
      if (Array.isArray(category)) {
        allPizzas.push(...category);
      }
    });
    return allPizzas;
  };

  const BOGOModal = ({ offer, onClose }) => {
    const validPizzas = getValidPizzas(offer);
    const [step, setStep] = useState(1); // 1: select first pizza, 2: select second pizza, 3: review
    const [pizza1, setPizza1] = useState(null);
    const [pizza2, setPizza2] = useState(null);
    const [size1, setSize1] = useState(null);
    const [size2, setSize2] = useState(null);

    // Lock background scroll when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

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

    const handleNextStep = () => {
      if (step === 1 && pizza1 && size1) {
        setStep(2);
      } else if (step === 2 && pizza2 && size2) {
        setStep(3);
      }
    };

    const handlePrevStep = () => {
      if (step === 2) {
        setStep(1);
      } else if (step === 3) {
        setStep(2);
      }
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
      <div className="fixed inset-0 bg-black/50 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-6 border-b flex justify-between items-center flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{offer.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{offer.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>1</div>
                  <span className="text-sm font-medium">First Pizza</span>
                </div>
                <div className={`w-8 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>2</div>
                  <span className="text-sm font-medium">Second Pizza</span>
                </div>
                <div className={`w-8 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>3</div>
                  <span className="text-sm font-medium">Review</span>
                </div>
              </div>
            </div>

            {/* Step 1: Select First Pizza */}
            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                  Select Your First Pizza
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
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
                      <div className="flex items-center gap-3">
                        {pizza.image && (
                          <img src={pizza.image} alt={pizza.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{pizza.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{pizza.description}</p>
                        </div>
                      </div>
                      
                      {pizza1?.id === pizza.id && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
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
                              <div className="font-semibold text-xs">{size.name}</div>
                              <div className="text-orange-500 text-xs">₹{size.price}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {pizza1 && size1 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all duration-300"
                    >
                      Continue to Second Pizza →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Second Pizza */}
            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white text-center">
                  Select Your Second Pizza
                </h3>
                
                {/* Selected First Pizza Display */}
                {pizza1 && size1 && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                      <div className="flex items-center gap-3 flex-1">
                        {pizza1.image && (
                          <img src={pizza1.image} alt={pizza1.name} className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{pizza1.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{size1.name} - ₹{size1.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
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
                      <div className="flex items-center gap-3">
                        {pizza.image && (
                          <img src={pizza.image} alt={pizza.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{pizza.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{pizza.description}</p>
                        </div>
                      </div>
                      
                      {pizza2?.id === pizza.id && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
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
                              <div className="font-semibold text-xs">{size.name}</div>
                              <div className="text-orange-500 text-xs">₹{size.price}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  {pizza2 && size2 && (
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all duration-300"
                    >
                      Review Order →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review & Add to Cart */}
            {step === 3 && pizza1 && pizza2 && size1 && size2 && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                  Review Your BOGO Deal
                </h3>
                
                {/* Combo Type Display */}
                {(() => {
                  const comboInfo = getComboInfo();
                  return comboInfo && (
                    <div className="mb-6 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
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

                {/* Selected Pizzas */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                      <div className="flex items-center gap-3 flex-1">
                        {pizza1.image && (
                          <img src={pizza1.image} alt={pizza1.name} className="w-16 h-16 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{pizza1.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{size1.name} - ₹{size1.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                      <div className="flex items-center gap-3 flex-1">
                        {pizza2.image && (
                          <img src={pizza2.image} alt={pizza2.name} className="w-16 h-16 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{pizza2.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{size2.name} - ₹{size2.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Individual Price:</span>
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
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-base hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    <Gift size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  const ComboModal = ({ combo, onClose }) => {
    const availablePizzas = getPizzasForCombo(combo);
    const [selectedPizzas, setSelectedPizzas] = useState([]);

    // Lock background scroll when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);
    
    // Get pizza items from combo
    const pizzaItems = combo.items.filter(item => item.type === 'pizza');
    const selectablePizzaItems = pizzaItems.filter(item => item.selectable);
    const requiredPizzaCount = selectablePizzaItems.reduce((sum, item) => sum + item.quantity, 0);

    const handlePizzaSelection = (pizza, itemIndex) => {
      const newSelectedPizzas = [...selectedPizzas];
      newSelectedPizzas[itemIndex] = pizza;
      setSelectedPizzas(newSelectedPizzas);
    };

    const calculateTotalValue = () => {
      let totalValue = 0;
      selectedPizzas.forEach((pizza, index) => {
        if (pizza) {
          const requiredSize = pizzaItems[Math.floor(index / pizzaItems[0].quantity)]?.size || 'Medium';
          const sizePrice = pizza.sizes.find(s => s.name === requiredSize)?.price || 0;
          totalValue += sizePrice;
        }
      });
      
      // Add other items estimated value
      combo.items.forEach(item => {
        if (item.type !== 'pizza') {
          const estimatedPrice = item.type === 'beverage' ? 50 : 80; // Rough estimates
          totalValue += estimatedPrice * item.quantity;
        }
      });
      
      return totalValue;
    };

    const handleAddToCart = () => {
      if (requiredPizzaCount > 0 && (selectedPizzas.length < requiredPizzaCount || selectedPizzas.some(p => !p))) {
        alert('Please select all required pizzas');
        return;
      }

      const totalValue = calculateTotalValue();
      const savings = totalValue - combo.price;

      // Create combo description
      let description = '';
      
      // Add selected pizzas
      if (selectedPizzas.length > 0) {
        const pizzaNames = selectedPizzas.map(pizza => pizza.name).join(', ');
        description += `Pizzas: ${pizzaNames}`;
      }
      
      // Add fixed pizzas
      const fixedPizzas = pizzaItems.filter(item => !item.selectable);
      if (fixedPizzas.length > 0) {
        const fixedPizzaNames = fixedPizzas.map(item => `${item.quantity}x ${item.name}`).join(', ');
        if (description) description += ' | ';
        description += `Fixed: ${fixedPizzaNames}`;
      }
      
      // Add other items
      const otherItems = combo.items
        .filter(item => item.type !== 'pizza')
        .map(item => `${item.quantity}x ${item.name}`)
        .join(', ');
      
      if (otherItems) {
        if (description) description += ' | ';
        description += otherItems;
      }

      onAddToCart({
        id: `combo-${Date.now()}`,
        name: combo.name,
        description: description,
        type: 'combo',
        comboId: combo.id,
        selectedPizzas: selectedPizzas,
        comboItems: combo.items,
        price: combo.price,
        originalPrice: totalValue,
        savings: savings,
        category: 'offers'
      });

      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 sm:p-6 border-b flex justify-between items-center flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{combo.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{combo.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {requiredPizzaCount > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Select Your Pizzas ({requiredPizzaCount} required)
                </h3>
                
                <div className="grid gap-4">
                  {Array.from({ length: requiredPizzaCount }, (_, index) => {
                    const selectablePizzaItem = selectablePizzaItems[Math.floor(index / selectablePizzaItems[0]?.quantity || 1)];
                    const requiredSize = selectablePizzaItem?.size || 'Medium';
                    
                    return (
                      <div key={index} className="border rounded-xl p-4">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
                          Pizza {index + 1} ({requiredSize})
                          {selectablePizzaItem?.category && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              - {selectablePizzaItem.category.replace('-', ' ').replace('veg', 'vegetarian')}
                            </span>
                          )}
                        </h4>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                          {availablePizzas.map(pizza => (
                            <div
                              key={`${index}-${pizza.id}`}
                              className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                selectedPizzas[index]?.id === pizza.id
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                              }`}
                              onClick={() => handlePizzaSelection(pizza, index)}
                            >
                              <div className="flex items-center gap-3">
                                {pizza.image && (
                                  <img src={pizza.image} alt={pizza.name} className="w-12 h-12 rounded-lg object-cover" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                                    {pizza.name}
                                  </h5>
                                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                    {pizza.description}
                                  </p>
                                  <div className="text-orange-500 text-sm font-semibold">
                                    ₹{pizza.sizes.find(s => s.name === requiredSize)?.price || 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Combo Items Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {combo.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      {item.type === 'pizza' ? '🍕' : item.type === 'beverage' ? '🥤' : '🍞'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {item.quantity}x {item.type === 'pizza' ? `${item.size} Pizza` : item.name}
                      </div>
                      {item.selectable && (
                        <div className="text-sm text-gray-600 dark:text-gray-300">Choose your selection</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            {(requiredPizzaCount === 0 || (selectedPizzas.length === requiredPizzaCount && selectedPizzas.every(p => p))) && (
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Combo Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Individual Items Value:</span>
                    <span className="line-through text-gray-500">₹{calculateTotalValue()}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>You Save:</span>
                    <span>₹{calculateTotalValue() - combo.price}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>Combo Price:</span>
                    <span>₹{combo.price}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Package size={20} />
                  Add Combo to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-100 via-red-100 to-purple-100 dark:from-orange-900/20 dark:via-red-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🎉 Special Offers & Combo Deals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Amazing deals and perfect combinations for every craving!
          </p>
        </div>

        {(bogoOffers.length === 0 && comboOffers.length === 0) ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🎉</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Active Offers</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* BOGO Offers */}
            {bogoOffers.map(offer => (
              <div 
                key={`bogo-${offer.id}`}
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
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold">
                        🎁 BOGO
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{offer.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
                  
                  {/* Pricing Preview */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center">Combo Prices</h5>
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

            {/* Combo Deals */}
            {comboOffers.map(combo => (
              <div 
                key={`combo-${combo.id}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
              >
                {combo.image && (
                  <div className="relative mb-6 overflow-hidden rounded-xl">
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-full h-48 object-cover"
                    />
                    {combo.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800">
                          {combo.badge}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full font-bold">
                      ₹{combo.price}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-semibold">
                        📦 COMBO
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{combo.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{combo.description}</p>
                  
                  <div className="space-y-2">
                    {combo.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-200">
                          {item.quantity}x {item.type === 'pizza' ? `${item.size} Pizza` : item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    // For fixed combos (like Value Combo), add directly to cart
                    const pizzaItems = combo.items.filter(item => item.type === 'pizza');
                    const hasSelectablePizzas = pizzaItems.some(item => item.selectable);
                    
                    if (!hasSelectablePizzas) {
                      // Fixed combo - add directly to cart
                      const totalValue = combo.items.reduce((sum, item) => {
                        if (item.type === 'pizza') {
                          // Find the fixed pizza by name in menu data
                          const foundPizza = Object.values(data.menuItems || {}).flat().find(p => p.name === item.name);
                          if (foundPizza) {
                            const sizePrice = foundPizza.sizes.find(s => s.name === item.size)?.price || 0;
                            return sum + (sizePrice * item.quantity);
                          }
                        }
                        // Estimate price for other items
                        const estimatedPrice = item.type === 'beverage' ? 50 : 80;
                        return sum + (estimatedPrice * item.quantity);
                      }, 0);
                      
                      const savings = totalValue - combo.price;
                      const description = combo.items.map(item => `${item.quantity}x ${item.name || `${item.size} Pizza`}`).join(', ');
                      
                      onAddToCart({
                        id: `combo-${Date.now()}`,
                        name: combo.name,
                        description: description,
                        type: 'combo',
                        comboId: combo.id,
                        selectedPizzas: [],
                        comboItems: combo.items,
                        price: combo.price,
                        originalPrice: totalValue,
                        savings: savings,
                        category: 'offers'
                      });
                    } else {
                      // Customizable combo - open modal
                      setSelectedCombo(combo);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Package size={16} />
                  {combo.items.filter(item => item.type === 'pizza' && item.selectable).length > 0 ? 'Customize Combo' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {selectedOffer && (
          <BOGOModal 
            offer={selectedOffer}
            onClose={() => setSelectedOffer(null)}
          />
        )}

        {selectedCombo && (
          <ComboModal 
            combo={selectedCombo}
            onClose={() => setSelectedCombo(null)}
          />
        )}
      </div>
    </section>
  );
};

export default OffersSection;