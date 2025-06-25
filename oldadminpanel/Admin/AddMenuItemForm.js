import React, { useState } from 'react';
import { Save, Upload, X, Plus, Minus } from 'lucide-react';
import { buildApiUrl, API_ENDPOINTS } from '../../config/api';

const AddMenuItemForm = ({ categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    badge: '',
    rating: '',
    category: categories.length > 0 ? categories[0].categoryId : 'featured',
    sizes: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 0 }
    ],
    addOns: []
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: 0 }]
    }));
  };

  const removeSize = (index) => {
    if (formData.sizes.length > 1) {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  // Add-ons management functions
  const handleAddOnChange = (index, field, value) => {
    const newAddOns = [...formData.addOns];
    newAddOns[index] = { ...newAddOns[index], [field]: field === 'price' ? Number(value) : value };
    setFormData(prev => ({ ...prev, addOns: newAddOns }));
  };

  const addAddOn = () => {
    setFormData(prev => ({
      ...prev,
      addOns: [...prev.addOns, { name: '', price: 0, category: 'Extra', isActive: true }]
    }));
  };

  const removeAddOn = (index) => {
    const newAddOns = formData.addOns.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, addOns: newAddOns }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.image) {
      alert('Please fill in all required fields (name, description, image)');
      return;
    }

    if (formData.sizes.some(size => !size.name || size.price <= 0)) {
      alert('Please fill in all size names and prices');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_ITEMS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Menu item added successfully!');
        onSave();
      } else {
        alert('Failed to add menu item: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Error adding menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Add New Menu Item</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pizza Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pizza name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter pizza description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Badge (Optional)
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="🏆 Signature, 🔥 Popular, etc."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.icon} {category.name}
                  </option>
                ))}
                {categories.length === 0 && (
                  <>
                    <option value="featured">Featured</option>
                    <option value="simply-veg">Simply Veg</option>
                    <option value="deluxe">Deluxe</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating (Optional)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                step="0.1"
                placeholder="Leave empty if no rating"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Sizes & Prices (₹) *
                </label>
                <button
                  type="button"
                  onClick={addSize}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Size
                </button>
              </div>
              <div className="space-y-2">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Size name"
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Add-ons (Optional)
                </label>
                <button
                  type="button"
                  onClick={addAddOn}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Add-on
                </button>
              </div>
              
              {formData.addOns.length > 0 && (
                <div className="space-y-2">
                  {formData.addOns.map((addOn, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add-on name (e.g., Extra Cheese)"
                        value={addOn.name}
                        onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={addOn.category}
                        onChange={(e) => handleAddOnChange(index, 'category', e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Extra">Extra</option>
                        <option value="Toppings">Toppings</option>
                        <option value="Sides">Sides</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Price"
                        value={addOn.price}
                        onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                        min="0"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeAddOn(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {formData.addOns.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p>No add-ons yet. Click "Add Add-on" to create customizable options.</p>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preview
                </label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Upload className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Add Menu Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenuItemForm;