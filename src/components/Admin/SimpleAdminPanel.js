import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Trash2, Plus, Save, Download, Upload, AlertTriangle } from 'lucide-react';

const SimpleAdminPanel = ({ isOpen, onClose }) => {
  const { data, updateData, exportData, resetToOriginal } = useData();
  const [activeTab, setActiveTab] = useState('categories');
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    sizes: [{ name: 'Small', price: 0 }]
  });

  if (!isOpen) return null;

  // Get current categories from menu data
  const getCurrentCategories = () => {
    return Object.keys(data.menuItems || {});
  };

  // Delete a category and all its items
  const deleteCategory = (categoryId) => {
    if (window.confirm(`Delete "${categoryId}" and all its items?`)) {
      const newData = { ...data };
      if (newData.menuItems && newData.menuItems[categoryId]) {
        delete newData.menuItems[categoryId];
        updateData(newData);
      }
    }
  };

  // Add a new category
  const addCategory = () => {
    if (!newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
    const newData = { ...data };
    
    if (!newData.menuItems) {
      newData.menuItems = {};
    }
    
    if (newData.menuItems[categoryId]) {
      alert('Category already exists');
      return;
    }
    
    newData.menuItems[categoryId] = [];
    updateData(newData);
    setNewCategory('');
    alert('Category added successfully!');
  };

  // Delete a menu item
  const deleteItem = (categoryId, itemId) => {
    if (window.confirm('Delete this item?')) {
      const newData = { ...data };
      if (newData.menuItems && newData.menuItems[categoryId]) {
        newData.menuItems[categoryId] = newData.menuItems[categoryId].filter(
          item => item.id !== itemId
        );
        updateData(newData);
      }
    }
  };

  // Add a new menu item
  const addMenuItem = () => {
    if (!newItem.name || !newItem.description || !newItem.category) {
      alert('Please fill in all required fields');
      return;
    }

    const newData = { ...data };
    const allItems = Object.values(newData.menuItems || {}).flat();
    const newId = allItems.length > 0 ? Math.max(...allItems.map(item => item.id)) + 1 : 1;

    if (!newData.menuItems[newItem.category]) {
      newData.menuItems[newItem.category] = [];
    }

    newData.menuItems[newItem.category].push({
      ...newItem,
      id: newId
    });

    updateData(newData);
    setNewItem({
      name: '',
      description: '',
      image: '',
      category: '',
      sizes: [{ name: 'Small', price: 0 }]
    });
    alert('Item added successfully!');
  };

  // Handle file import
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (window.confirm('This will replace all current data. Continue?')) {
            updateData(importedData);
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const categories = getCurrentCategories();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-b bg-gray-50 flex gap-3 flex-wrap">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download size={16} />
            Export Data
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            <Upload size={16} />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={async () => {
              if (window.confirm('Reset all data to original?')) {
                await resetToOriginal();
                alert('Data reset successfully!');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <AlertTriangle size={16} />
            Reset Data
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'categories' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'items' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Menu Items
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Add New Category */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Category name (e.g., 'New Specials')"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Category
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
                <div className="grid gap-3">
                  {categories.map(categoryId => (
                    <div key={categoryId} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {categoryId.replace(/-/g, ' ')}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {data.menuItems[categoryId]?.length || 0} items
                        </p>
                      </div>
                      <button
                        onClick={() => deleteCategory(categoryId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Add New Item */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item name *"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category *</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  
                  <textarea
                    placeholder="Description *"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  />
                  
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div>
                    <h4 className="font-medium mb-2">Sizes & Prices</h4>
                    {newItem.sizes.map((size, index) => (
                      <div key={index} className="flex items-center gap-3 mb-2">
                        <input
                          type="text"
                          placeholder="Size name"
                          value={size.name}
                          onChange={(e) => {
                            const newSizes = [...newItem.sizes];
                            newSizes[index].name = e.target.value;
                            setNewItem({ ...newItem, sizes: newSizes });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={size.price}
                          onChange={(e) => {
                            const newSizes = [...newItem.sizes];
                            newSizes[index].price = Number(e.target.value);
                            setNewItem({ ...newItem, sizes: newSizes });
                          }}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {newItem.sizes.length > 1 && (
                          <button
                            onClick={() => {
                              const newSizes = newItem.sizes.filter((_, i) => i !== index);
                              setNewItem({ ...newItem, sizes: newSizes });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setNewItem({
                          ...newItem,
                          sizes: [...newItem.sizes, { name: '', price: 0 }]
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Size
                    </button>
                  </div>
                  
                  <button
                    onClick={addMenuItem}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">All Menu Items</h3>
                {categories.map(categoryId => (
                  <div key={categoryId} className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3 capitalize">
                      {categoryId.replace(/-/g, ' ')} ({data.menuItems[categoryId]?.length || 0} items)
                    </h4>
                    <div className="grid gap-3">
                      {data.menuItems[categoryId]?.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div>
                              <h5 className="font-medium">{item.name}</h5>
                              <p className="text-sm text-gray-500">{item.description}</p>
                              <p className="text-sm text-gray-400">
                                Prices: {item.sizes?.map(s => `${s.name}: ₹${s.price}`).join(', ')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteItem(categoryId, item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )) || []}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminPanel;