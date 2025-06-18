import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const MenuItemEditModal = ({ item, category, isOpen, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState({
    name: '',
    description: '',
    image: '',
    badge: '',
    rating: '',
    sizes: [{ name: 'Small', price: 0 }]
  });

  useEffect(() => {
    if (item) {
      setEditedItem({
        ...item,
        sizes: item.sizes ? [...item.sizes] : [{ name: 'Small', price: 0 }]
      });
    }
  }, [item]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setEditedItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...editedItem.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'price' ? Number(value) || 0 : value
    };
    setEditedItem(prev => ({
      ...prev,
      sizes: newSizes
    }));
  };

  const addSize = () => {
    setEditedItem(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: 0 }]
    }));
  };

  const removeSize = (index) => {
    if (editedItem.sizes.length > 1) {
      setEditedItem(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    if (!editedItem.name.trim() || !editedItem.description.trim()) {
      alert('Please fill in name and description');
      return;
    }

    if (editedItem.sizes.some(size => !size.name.trim() || size.price <= 0)) {
      alert('Please fill in all size names and set valid prices');
      return;
    }

    onSave(editedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Edit Menu Item
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={editedItem.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                disabled
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={editedItem.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter item description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={editedItem.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Badge (Optional)
              </label>
              <input
                type="text"
                value={editedItem.badge}
                onChange={(e) => handleInputChange('badge', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 🍕 Popular"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating (Optional)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={editedItem.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="4.5"
            />
          </div>

          {/* Sizes and Prices */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sizes & Prices *
              </label>
              <button
                type="button"
                onClick={addSize}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Plus size={16} />
                Add Size
              </button>
            </div>

            <div className="space-y-3">
              {editedItem.sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Size name (e.g., Small, Medium, Large)"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={size.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                  {editedItem.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {editedItem.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Preview
              </label>
              <div className="relative">
                <img
                  src={editedItem.image}
                  alt={editedItem.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemEditModal;