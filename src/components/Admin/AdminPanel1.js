import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Settings, X, Save, Upload, Trash2 } from 'lucide-react';

const AdminPanel = ({ isOpen, onClose }) => {
  const { data, addMenuItem, updateMenuItem, deleteMenuItem, addGalleryItem, deleteGalleryItem } = useData();
  const [activeTab, setActiveTab] = useState('menu');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    image: '',
    badge: '',
    rating: 4.5,
    category: 'featured',
    sizes: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 0 }
    ]
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    image: '',
    category: 'pizzas'
  });

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.description && newItem.image) {
      addMenuItem(newItem.category, newItem);
      setNewItem({
        name: '',
        description: '',
        image: '',
        badge: '',
        rating: 4.5,
        category: 'featured',
        sizes: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Large', price: 0 }
        ]
      });
      alert('Menu item added successfully!');
    } else {
      alert('Please fill in all required fields (name, description, image)');
    }
  };

  const handleAddGalleryItem = () => {
    if (newGalleryItem.title && newGalleryItem.image) {
      addGalleryItem(newGalleryItem);
      setNewGalleryItem({
        title: '',
        image: '',
        category: 'pizzas'
      });
      alert('Gallery item added successfully!');
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleDeleteMenuItem = (category, itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      deleteMenuItem(category, itemId);
      alert('Menu item deleted successfully!');
    }
  };

  const handleDeleteGalleryItem = (itemId, itemTitle) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      deleteGalleryItem(itemId);
      alert('Gallery item deleted successfully!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Settings size={32} />
            Admin Panel
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-8 py-4 font-semibold transition-colors ${
              activeTab === 'menu' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Menu Management
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-8 py-4 font-semibold transition-colors ${
              activeTab === 'gallery' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Gallery Management
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'menu' && (
            <div className="space-y-8">
              {/* Add New Menu Item */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Menu Item</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Pizza Name *"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="input-field"
                    />
                    <textarea
                      placeholder="Description *"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      className="input-field h-32 resize-none"
                    />
                    <input
                      type="url"
                      placeholder="Image URL * (e.g., https://images.unsplash.com/...)"
                      value={newItem.image}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Badge (e.g., 🏆 Signature, 🔥 Popular)"
                      value={newItem.badge}
                      onChange={(e) => setNewItem({...newItem, badge: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-4">
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="input-field"
                    >
                      <option value="featured">Featured</option>
                      <option value="simply-veg">Simply Veg</option>
                      <option value="deluxe">Deluxe</option>
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="Rating (1-5)"
                      value={newItem.rating}
                      onChange={(e) => setNewItem({...newItem, rating: parseFloat(e.target.value)})}
                      className="input-field"
                    />
                    <div className="space-y-2">
                      <label className="font-semibold text-gray-700">Prices (₹):</label>
                      {newItem.sizes.map((size, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="w-20 p-3 bg-gray-100 rounded-lg text-center font-medium">{size.name}</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={size.price}
                            onChange={(e) => {
                              const newSizes = [...newItem.sizes];
                              newSizes[index].price = parseInt(e.target.value) || 0;
                              setNewItem({...newItem, sizes: newSizes});
                            }}
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                    {newItem.image && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img
                          src={newItem.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleAddMenuItem}
                  className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Save size={20} />
                  Add Menu Item
                </button>
              </div>

              {/* Existing Menu Items */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Menu Items</h3>
                {Object.entries(data.menuItems).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h4 className="text-xl font-semibold mb-4 text-purple-600 capitalize">{category.replace('-', ' ')}</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map(item => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-gray-800 flex-1">{item.name}</h5>
                            <button
                              onClick={() => handleDeleteMenuItem(category, item.id, item.name)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="text-sm text-gray-500">
                            <p>Badge: {item.badge || 'None'}</p>
                            <p>Rating: {item.rating}/5</p>
                            <p>Prices: {item.sizes.map(size => `${size.name}: ₹${size.price}`).join(', ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Add New Gallery Item */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Gallery Item</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Image Title *"
                      value={newGalleryItem.title}
                      onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})}
                      className="input-field"
                    />
                    <input
                      type="url"
                      placeholder="Image URL * (e.g., https://images.unsplash.com/...)"
                      value={newGalleryItem.image}
                      onChange={(e) => setNewGalleryItem({...newGalleryItem, image: e.target.value})}
                      className="input-field"
                    />
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) => setNewGalleryItem({...newGalleryItem, category: e.target.value})}
                      className="input-field"
                    >
                      <option value="pizzas">Pizzas</option>
                      <option value="ingredients">Ingredients</option>
                      <option value="specials">Specials</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-center">
                    {newGalleryItem.image && (
                      <img
                        src={newGalleryItem.image}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-xl shadow-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Invalid+URL';
                        }}
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={handleAddGalleryItem}
                  className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Upload size={20} />
                  Add Gallery Item
                </button>
              </div>

              {/* Existing Gallery Items */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Gallery Items ({data.galleryItems.length})</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.galleryItems.map(item => (
                    <div key={item.id} className="relative group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-white/80 text-sm capitalize">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;