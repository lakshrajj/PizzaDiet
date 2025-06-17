import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Settings, X, Save, Upload, Trash2, Download, RefreshCw, AlertTriangle, Wifi, WifiOff, Plus, Minus } from 'lucide-react';

const EnhancedAdminPanel = ({ isOpen, onClose }) => {
  const { 
    data, 
    hasLocalChanges, 
    isOnline, 
    lastSync,
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    addGalleryItem, 
    deleteGalleryItem,
    exportData,
    resetToOriginal,
    syncData,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    getMenuCategories,
    addGalleryCategory,
    updateGalleryCategory,
    deleteGalleryCategory,
    getGalleryCategories
  } = useData();
  
  const [activeTab, setActiveTab] = useState('menu');
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    image: '',
    badge: '',
    rating: 4.5,
    category: 'featured',
    sizes: [
      { name: 'Small', price: 0 }
    ]
  });

  const [newSize, setNewSize] = useState({ name: '', price: 0 });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    image: '',
    category: 'pizzas'
  });
  
  const [newMenuCategory, setNewMenuCategory] = useState({
    id: '',
    name: '',
    icon: '🍕',
    color: 'from-orange-500 to-red-500'
  });

  const [newGalleryCategory, setNewGalleryCategory] = useState({
    id: '',
    name: '',
    icon: '📸'
  });
  
  const [showMenuCategoryForm, setShowMenuCategoryForm] = useState(false);
  const [showGalleryCategoryForm, setShowGalleryCategoryForm] = useState(false);

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
          { name: 'Small', price: 0 }
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

  const handleExport = () => {
    try {
      const jsonString = exportData();
      alert('Data exported successfully! Save the downloaded file and upload it to your server.');
    } catch (error) {
      alert('Export failed: ' + error.message);
    }
  };

  const handleReset = async () => {
    if (window.confirm('This will reset all changes to the original data. Are you sure?')) {
      const success = await resetToOriginal();
      if (success) {
        alert('Data reset to original successfully!');
      } else {
        alert('Reset failed. Please try again.');
      }
    }
  };

  const handleSync = async () => {
    const result = await syncData();
    if (result.success) {
      alert('Data synced successfully!');
    } else if (result.conflicts) {
      setShowSyncDialog(true);
    } else {
      alert('Sync failed. Please check your connection.');
    }
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (window.confirm('This will replace all current data. Are you sure?')) {
            // Validate data structure
            if (importedData.menuItems && importedData.galleryItems) {
              localStorage.setItem('pizzaDietData', JSON.stringify(importedData));
              window.location.reload(); // Reload to apply changes
            } else {
              alert('Invalid file format. Please check your JSON structure.');
            }
          }
        } catch (error) {
          alert('Error reading file: ' + error.message);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid JSON file.');
    }
    event.target.value = ''; // Reset input
  };

  const handleAddSize = () => {
    if (!newSize.name) {
      alert('Please enter a size name');
      return;
    }
    setNewItem({
      ...newItem,
      sizes: [...newItem.sizes, { ...newSize }]
    });
    setNewSize({ name: '', price: 0 });
  };

  const handleRemoveSize = (index) => {
    setNewItem({
      ...newItem,
      sizes: newItem.sizes.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings size={32} />
            <div>
              <h2 className="text-3xl font-bold">Admin Panel</h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                  {isOnline ? 'Online' : 'Offline'}
                </div>
                {hasLocalChanges && (
                  <div className="flex items-center gap-1 text-yellow-300">
                    <AlertTriangle size={16} />
                    Unsaved Changes
                  </div>
                )}
                {lastSync && (
                  <div className="text-xs">
                    Last sync: {new Date(lastSync).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 p-4 border-b flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download size={16} />
            Export Data
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
            <Upload size={16} />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleSync}
            disabled={!isOnline}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={16} />
            Sync Data
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <AlertTriangle size={16} />
            Reset to Original
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
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-8 py-4 font-semibold transition-colors ${
              activeTab === 'instructions' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Instructions
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {activeTab === 'instructions' && (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">How to Update Your Website</h3>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">📋 Workflow</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>Make changes to menu items or gallery images</li>
                    <li>Click "Export Data" to download the updated JSON file</li>
                    <li>Replace the file at <code className="bg-blue-100 px-2 py-1 rounded">public/data/menu.json</code></li>
                    <li>Deploy your website (changes will be live for all users)</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">✅ Benefits</h4>
                  <ul className="list-disc list-inside space-y-2 text-green-700">
                    <li>All users see the same updated content</li>
                    <li>Changes persist across browser sessions</li>
                    <li>Easy to backup and version control</li>
                    <li>No database required</li>
                    <li>Fast loading times</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Important Notes</h4>
                  <ul className="list-disc list-inside space-y-2 text-yellow-700">
                    <li>Local changes are temporary until exported and deployed</li>
                    <li>Use "Reset to Original" to discard all local changes</li>
                    <li>Export data regularly to avoid losing changes</li>
                    <li>Test image URLs before adding them</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">📁 File Structure</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`public/
├── data/
│   └── menu.json  ← Replace this file
├── index.html
└── ...`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-8">
              {/* Add New Menu Category */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Menu Categories</h3>
                  <button
                    onClick={() => setShowMenuCategoryForm(!showMenuCategoryForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {showMenuCategoryForm ? 'Cancel' : 'Add New Category'}
                  </button>
                </div>
                
                {showMenuCategoryForm && (
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">Create New Menu Category</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Category ID (e.g., 'spicy-specials') *"
                        value={newMenuCategory.id}
                        onChange={(e) => setNewMenuCategory({...newMenuCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Display Name (e.g., 'Spicy Specials') *"
                        value={newMenuCategory.name}
                        onChange={(e) => setNewMenuCategory({...newMenuCategory, name: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Icon (emoji) *"
                        value={newMenuCategory.icon}
                        onChange={(e) => setNewMenuCategory({...newMenuCategory, icon: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Color gradient (from-X-500 to-Y-500) *"
                        value={newMenuCategory.color}
                        onChange={(e) => setNewMenuCategory({...newMenuCategory, color: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (newMenuCategory.id && newMenuCategory.name) {
                            addMenuCategory(
                              newMenuCategory.id,
                              newMenuCategory.name,
                              newMenuCategory.icon,
                              newMenuCategory.color
                            );
                            setNewMenuCategory({
                              id: '',
                              name: '',
                              icon: '🍕',
                              color: 'from-orange-500 to-red-500'
                            });
                            setShowMenuCategoryForm(false);
                            alert('Menu category added successfully!');
                          } else {
                            alert('Please fill in ID and Name fields');
                          }
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {Object.entries(getMenuCategories()).map(([id, category]) => (
                    <div key={id} className="bg-white rounded-xl p-4 shadow border border-gray-100 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{category.icon || '🍕'}</span>
                          <h5 className="font-semibold text-gray-800">{category.name}</h5>
                        </div>
                        <p className="text-sm text-gray-500">ID: {id}</p>
                        <div className="mt-2 px-3 py-1 text-xs inline-block rounded-full" 
                          style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`, 
                            '--tw-gradient-from': (category.color?.split(' ')[0] || 'from-orange-500').replace('from-', ''),
                            '--tw-gradient-to': (category.color?.split(' ')[1] || 'to-red-500').replace('to-', '')
                          }}>
                          Color Preview
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${category.name}" category? This will remove all items in this category!`)) {
                            deleteMenuCategory(id);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Add New Menu Item */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Menu Item</h3>
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
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="input-field"
                  >
                    {Object.entries(getMenuCategories()).map(([id, category]) => (
                      <option key={id} value={id}>{category.name}</option>
                    ))}
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
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-700">Size Options</h4>
                    
                    <div className="space-y-2">
                      {newItem.sizes.map((size, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="text-gray-600">
                              <span className="font-medium">{size.name}</span>
                            </div>
                            <div className="text-gray-600">
                              ₹{size.price}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveSize(index)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        placeholder="Size name (e.g., Extra Large)"
                        value={newSize.name}
                        onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                        className="input-field flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={newSize.price}
                        onChange={(e) => setNewSize({ ...newSize, price: Number(e.target.value) })}
                        className="input-field w-32"
                      />
                      <button
                        onClick={handleAddSize}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
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
                {Object.entries(data.menuItems || {}).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h4 className="text-xl font-semibold mb-4 text-purple-600 capitalize">
                      {category.replace('-', ' ')} ({items?.length || 0} items)
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items?.map(item => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-gray-800 flex-1">{item.name}</h5>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}"?`)) {
                                  deleteMenuItem(category, item.id);
                                }
                              }}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="text-sm text-gray-500">
                            <p>Badge: {item.badge || 'None'}</p>
                            <p>Rating: {item.rating}/5</p>
                            <p>Prices: {item.sizes?.map(size => `${size.name}: ₹${size.price}`).join(', ')}</p>
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Add New Gallery Category */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Gallery Categories</h3>
                  <button
                    onClick={() => setShowGalleryCategoryForm(!showGalleryCategoryForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {showGalleryCategoryForm ? 'Cancel' : 'Add New Category'}
                  </button>
                </div>
                
                {showGalleryCategoryForm && (
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">Create New Gallery Category</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Category ID (e.g., 'events') *"
                        value={newGalleryCategory.id}
                        onChange={(e) => setNewGalleryCategory({...newGalleryCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Display Name (e.g., 'Events') *"
                        value={newGalleryCategory.name}
                        onChange={(e) => setNewGalleryCategory({...newGalleryCategory, name: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Icon (emoji) *"
                        value={newGalleryCategory.icon}
                        onChange={(e) => setNewGalleryCategory({...newGalleryCategory, icon: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (newGalleryCategory.id && newGalleryCategory.name) {
                            addGalleryCategory(
                              newGalleryCategory.id,
                              newGalleryCategory.name,
                              newGalleryCategory.icon
                            );
                            setNewGalleryCategory({
                              id: '',
                              name: '',
                              icon: '📸'
                            });
                            setShowGalleryCategoryForm(false);
                            alert('Gallery category added successfully!');
                          } else {
                            alert('Please fill in ID and Name fields');
                          }
                        }}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {Object.entries(getGalleryCategories()).map(([id, category]) => (
                    <div key={id} className="bg-white rounded-xl p-4 shadow border border-gray-100 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{category.icon || '📸'}</span>
                          <h5 className="font-semibold text-gray-800">{category.name}</h5>
                        </div>
                        <p className="text-sm text-gray-500">ID: {id}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${category.name}" category? This will remove all gallery items with this category!`)) {
                            deleteGalleryCategory(id);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
                      {Object.entries(getGalleryCategories()).map(([id, category]) => (
                        <option key={id} value={id}>{category.name}</option>
                      ))}
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
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  Existing Gallery Items ({data.galleryItems?.length || 0})
                </h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.galleryItems?.map(item => (
                    <div key={item.id} className="relative group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${item.title}"?`)) {
                              deleteGalleryItem(item.id);
                            }
                          }}
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
                  )) || []}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminPanel;