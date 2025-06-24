import React, { useState, useEffect } from 'react';
import { Save, X, Palette, Tag, Hash, Eye } from 'lucide-react';

const EditCategoryForm = ({ category, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    icon: '🍕',
    color: 'from-orange-500 to-red-500',
    order: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && isEditing) {
      setFormData({
        categoryId: category.categoryId || '',
        name: category.name || '',
        icon: category.icon || '🍕',
        color: category.color || 'from-orange-500 to-red-500',
        order: category.order || 1
      });
    }
  }, [category, isEditing]);

  const colorOptions = [
    { name: 'Orange-Red', value: 'from-orange-500 to-red-500' },
    { name: 'Green-Emerald', value: 'from-green-500 to-emerald-500' },
    { name: 'Purple-Pink', value: 'from-purple-500 to-pink-500' },
    { name: 'Yellow-Orange', value: 'from-yellow-500 to-orange-500' },
    { name: 'Blue-Cyan', value: 'from-blue-500 to-cyan-500' },
    { name: 'Red-Pink', value: 'from-red-500 to-pink-500' },
    { name: 'Amber-Yellow', value: 'from-amber-500 to-yellow-500' },
    { name: 'Indigo-Purple', value: 'from-indigo-500 to-purple-500' },
    { name: 'Green-Teal', value: 'from-green-500 to-teal-500' },
    { name: 'Blue-Purple', value: 'from-blue-500 to-purple-500' }
  ];

  const iconOptions = ['🍕', '🔥', '🥬', '👑', '⭐', '🙏', '🍟', '🥗', '🥤', '🍔', '🍝', '🍞', '🍽️', '🌶️', '🧀', '🥘'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.categoryId.trim()) {
      newErrors.categoryId = 'Category ID is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.categoryId)) {
      newErrors.categoryId = 'Category ID must contain only lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!formData.icon.trim()) {
      newErrors.icon = 'Icon is required';
    }
    
    if (formData.order < 1) {
      newErrors.order = 'Order must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const url = isEditing 
        ? `http://localhost:3001/api/menu/categories/${category._id}`
        : 'http://localhost:3001/api/menu/categories';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        onSave(data.category);
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'create'} category: ` + data.message);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} category:`, error);
      alert(`Error ${isEditing ? 'updating' : 'creating'} category`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 1 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600" />
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${formData.color} text-white shadow-lg`}>
              <span className="text-xl">{formData.icon}</span>
              <span className="font-semibold">{formData.name || 'Category Name'}</span>
            </div>
          </div>

          {/* Category ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Category ID
            </label>
            <input
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isEditing}
              placeholder="e.g., featured, classic-veg"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              } ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            {isEditing && <p className="text-gray-500 text-sm mt-1">Category ID cannot be changed after creation</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Featured Pizzas, Classic Veg"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-2 text-xl rounded-lg border-2 hover:border-blue-500 transition-colors ${
                    formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Or enter custom emoji"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.icon ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Gradient
            </label>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 hover:border-blue-500 transition-colors ${
                    formData.color === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${option.value}`}></div>
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.order ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order}</p>}
            <p className="text-gray-500 text-sm mt-1">Lower numbers appear first</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryForm;