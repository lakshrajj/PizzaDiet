import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Star, Package, X } from 'lucide-react';

const ComboSection = ({ onAddToCart }) => {
  const { data } = useData();
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Get all combo offers
  const comboOffers = data.offers?.combos?.filter(offer => offer.active) || [];

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

  const ComboModal = ({ combo, onClose }) => {
    const availablePizzas = getPizzasForCombo(combo);
    const [selectedPizzas, setSelectedPizzas] = useState([]);
    
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
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{combo.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{combo.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
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
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
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
    <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            📦 Combo Deals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Perfect combinations for every craving!
          </p>
        </div>

        {comboOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Active Combos</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for combo deals!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comboOffers.map(combo => (
            <div 
              key={combo.id}
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
                  <div className="absolute bottom-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
                    ₹{combo.price}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{combo.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{combo.description}</p>
                
                <div className="space-y-2">
                  {combo.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
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

export default ComboSection;