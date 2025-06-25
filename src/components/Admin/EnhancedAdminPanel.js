import React, { useState, useEffect } from 'react';
import { Settings, X, Save, Upload, Trash2, Download, RefreshCw, AlertTriangle, Wifi, WifiOff, Plus, Minus, Edit3 } from 'lucide-react';
import api from '../../config/api';

const EnhancedAdminPanel = ({ isOpen, onClose }) => {
  const [data, setData] = useState({ menuItems: {}, categories: [], offers: [], franchiseApplications: [], galleryItems: [] });
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [hasLocalChanges] = useState(false); // Always false since we work directly with MongoDB
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('menu');
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

  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    image: '',
    discount: '',
    badge: '',
    validUntil: '',
    terms: ['']
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    image: '',
    category: 'pizzas',
    tags: []
  });
  
  const [newMenuCategory, setNewMenuCategory] = useState({
    categoryId: '',
    name: '',
    icon: '🍕',
    color: 'from-orange-500 to-red-500',
    order: 0
  });
  
  const [showMenuCategoryForm, setShowMenuCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, itemsRes, offersRes, galleryRes] = await Promise.all([
        api.get('/menu/categories'),
        api.get('/menu/items/grouped'),
        api.get('/offers/all'),
        api.get('/gallery/all')
      ]);
      
      setData({
        categories: categoriesRes.categories || [],
        menuItems: itemsRes.menuItems || {},
        offers: offersRes.offers || [],
        galleryItems: galleryRes.items || []
      });
      setLastSync(new Date());
      setIsOnline(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsOnline(false);
    }
    setLoading(false);
  };

  const handleAddMenuItem = async () => {
    if (newItem.name && newItem.description && newItem.image) {
      setLoading(true);
      try {
        await api.post('/menu/items', newItem);
        await fetchData();
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
      } catch (error) {
        console.error('Error adding menu item:', error);
        alert('Failed to add menu item. Please try again.');
      }
      setLoading(false);
    } else {
      alert('Please fill in all required fields (name, description, image)');
    }
  };

  const handleUpdateMenuItem = async (itemId, updatedItem) => {
    setLoading(true);
    try {
      await api.put(`/menu/items/${itemId}`, updatedItem);
      await fetchData();
      setEditingItem(null);
      alert('Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Failed to update menu item. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        await api.delete(`/menu/items/${itemId}`);
        await fetchData();
        alert('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleAddOffer = async () => {
    if (newOffer.title && newOffer.description && newOffer.validUntil) {
      setLoading(true);
      try {
        await api.post('/offers', newOffer);
        await fetchData();
        setNewOffer({
          title: '',
          description: '',
          image: '',
          discount: '',
          badge: '',
          validUntil: '',
          terms: ['']
        });
        setShowOfferForm(false);
        alert('Offer added successfully!');
      } catch (error) {
        console.error('Error adding offer:', error);
        alert('Failed to add offer. Please try again.');
      }
      setLoading(false);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setLoading(true);
      try {
        await api.delete(`/offers/${offerId}`);
        await fetchData();
        alert('Offer deleted successfully!');
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Failed to delete offer. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const dataToExport = {
        categories: data.categories,
        menuItems: data.menuItems,
        offers: data.offers,
        exportDate: new Date().toISOString()
      };
      
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pizza-diet-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    } catch (error) {
      alert('Export failed: ' + error.message);
    }
  };

  const handleAddCategory = async () => {
    if (newMenuCategory.categoryId && newMenuCategory.name) {
      setLoading(true);
      try {
        await api.post('/menu/categories', newMenuCategory);
        await fetchData();
        setNewMenuCategory({
          categoryId: '',
          name: '',
          icon: '🍕',
          color: 'from-orange-500 to-red-500',
          order: 0
        });
        setShowMenuCategoryForm(false);
        alert('Category added successfully!');
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category. Please try again.');
      }
      setLoading(false);
    } else {
      alert('Please fill in Category ID and Name fields');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also remove all items in this category.')) {
      setLoading(true);
      try {
        await api.delete(`/menu/categories/${categoryId}`);
        await fetchData();
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleAddGalleryItem = async () => {
    if (newGalleryItem.title && newGalleryItem.image) {
      setLoading(true);
      try {
        await api.post('/gallery', newGalleryItem);
        await fetchData();
        setNewGalleryItem({
          title: '',
          description: '',
          image: '',
          category: 'pizzas',
          tags: []
        });
        setShowGalleryForm(false);
        alert('Gallery item added successfully!');
      } catch (error) {
        console.error('Error adding gallery item:', error);
        alert('Failed to add gallery item. Please try again.');
      }
      setLoading(false);
    } else {
      alert('Please fill in title and image URL');
    }
  };


  const handleDeleteGalleryItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      setLoading(true);
      try {
        await api.delete(`/gallery/${itemId}`);
        await fetchData();
        alert('Gallery item deleted successfully!');
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        alert('Failed to delete gallery item. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleSync = async () => {
    await fetchData();
    alert('Data synced successfully!');
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          JSON.parse(e.target.result); // Validate JSON format
          if (window.confirm('This will replace all current data. Are you sure?')) {
            alert('Import feature will be implemented for MongoDB');
          }
        } catch (error) {
          alert('Error reading file: ' + error.message);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid JSON file.');
    }
    event.target.value = '';
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

  // Edit Item Modal
  const EditItemModal = ({ item, onClose, onSave }) => {
    const [editData, setEditData] = useState(item);

    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Menu Item</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="input-field h-24 resize-none"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={editData.image}
                onChange={(e) => setEditData({...editData, image: e.target.value})}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Badge"
                value={editData.badge || ''}
                onChange={(e) => setEditData({...editData, badge: e.target.value})}
                className="input-field"
              />
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                placeholder="Rating"
                value={editData.rating}
                onChange={(e) => setEditData({...editData, rating: parseFloat(e.target.value)})}
                className="input-field"
              />
              <select
                value={editData.category}
                onChange={(e) => setEditData({...editData, category: e.target.value})}
                className="input-field"
              >
                {data.categories?.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                ))}
              </select>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sizes & Prices</label>
                {editData.sizes?.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Size name"
                      value={size.name}
                      onChange={(e) => {
                        const newSizes = [...editData.sizes];
                        newSizes[index].name = e.target.value;
                        setEditData({...editData, sizes: newSizes});
                      }}
                      className="input-field flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) => {
                        const newSizes = [...editData.sizes];
                        newSizes[index].price = Number(e.target.value);
                        setEditData({...editData, sizes: newSizes});
                      }}
                      className="input-field w-24"
                    />
                    <button
                      onClick={() => {
                        const newSizes = editData.sizes.filter((_, i) => i !== index);
                        setEditData({...editData, sizes: newSizes});
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditData({
                      ...editData,
                      sizes: [...(editData.sizes || []), { name: '', price: 0 }]
                    });
                  }}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Size
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(item._id, editData)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
            onClick={() => setActiveTab('offers')}
            className={`px-8 py-4 font-semibold transition-colors ${
              activeTab === 'offers' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Offers Management
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
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-4 font-semibold transition-colors ${
              activeTab === 'applications' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Franchise Applications
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner w-8 h-8"></div>
              <span className="ml-3">Loading...</span>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Franchise Applications</h3>
              
              <div className="bg-white rounded-xl shadow">
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Manage franchise applications submitted through the website.</p>
                  
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.get('/franchise/applications');
                        setData(prev => ({ ...prev, franchiseApplications: res.applications || [] }));
                      } catch (error) {
                        console.error('Error fetching applications:', error);
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4"
                  >
                    <RefreshCw size={16} className="inline mr-2" />
                    Load Applications
                  </button>
                  
                  <div className="space-y-4">
                    {data.franchiseApplications?.map(app => (
                      <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{app.fullName}</h4>
                            <p className="text-gray-600">{app.email}</p>
                            <p className="text-gray-600">{app.phone}</p>
                            <p className="text-sm text-gray-500">Applied: {new Date(app.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p><strong>Location Interest:</strong> {app.locationInterest}</p>
                            <p><strong>Investment:</strong> {app.investmentAmount}</p>
                            <p><strong>Status:</strong> 
                              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          {['pending', 'approved', 'rejected', 'in-review'].map(status => (
                            <button
                              key={status}
                              onClick={async () => {
                                try {
                                  await api.patch(`/franchise/applications/${app._id}/status`, { status });
                                  setData(prev => ({
                                    ...prev,
                                    franchiseApplications: prev.franchiseApplications.map(a => 
                                      a._id === app._id ? { ...a, status } : a
                                    )
                                  }));
                                } catch (error) {
                                  console.error('Error updating status:', error);
                                }
                              }}
                              className={`px-3 py-1 rounded text-sm ${
                                app.status === status 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    )) || []}
                  </div>
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
                        value={newMenuCategory.categoryId}
                        onChange={(e) => setNewMenuCategory({...newMenuCategory, categoryId: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
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
                      <input
                        type="number"
                        placeholder="Display Order"
                        value={newMenuCategory.order}
                        onChange={(e) => setNewMenuCategory({...newMenuCategory, order: parseInt(e.target.value) || 0})}
                        className="input-field"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleAddCategory}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {data.categories?.map((category) => (
                    <div key={category._id} className="bg-white rounded-xl p-4 shadow border border-gray-100 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{category.icon || '🍕'}</span>
                          <h5 className="font-semibold text-gray-800">{category.name}</h5>
                        </div>
                        <p className="text-sm text-gray-500">ID: {category.categoryId}</p>
                        <div className={`mt-2 px-3 py-1 text-xs text-white inline-block rounded-full bg-gradient-to-r ${category.color}`}>
                          Color Preview
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
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
                    {data.categories?.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
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
                {Object.entries(data.menuItems || {}).map(([category, items]) => {
                  const categoryInfo = data.categories?.find(cat => cat.categoryId === category);
                  return (
                    <div key={category} className="mb-8">
                      <h4 className="text-xl font-semibold mb-4 text-purple-600 capitalize flex items-center gap-2">
                        <span>{categoryInfo?.icon || '🍕'}</span>
                        {categoryInfo?.name || category.replace('-', ' ')} ({items?.length || 0} items)
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items?.map(item => (
                          <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                            )}
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-gray-800 flex-1">{item.name}</h5>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="text-blue-500 hover:bg-blue-50 p-1 rounded transition-colors"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item._id)}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                            <div className="text-sm text-gray-500">
                              <p>Badge: {item.badge || 'None'}</p>
                              <p>Rating: {item.rating}/5</p>
                              <p>Prices: {item.sizes?.map(size => `${size.name}: ₹${size.price}`).join(', ')}</p>
                            </div>
                          </div>
                        )) || []
                      }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-8">
              {/* Offers Management */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Offers & Deals</h3>
                  <button
                    onClick={() => setShowOfferForm(!showOfferForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {showOfferForm ? 'Cancel' : 'Add New Offer'}
                  </button>
                </div>
                
                {showOfferForm && (
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">Create New Offer</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Offer Title *"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Discount (e.g., '50% OFF', '₹199 Only') *"
                        value={newOffer.discount}
                        onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                        className="input-field"
                      />
                      <textarea
                        placeholder="Description *"
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                        className="input-field col-span-2 h-24 resize-none"
                      />
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newOffer.image}
                        onChange={(e) => setNewOffer({...newOffer, image: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Badge (e.g., '🔥 Hot Deal')"
                        value={newOffer.badge}
                        onChange={(e) => setNewOffer({...newOffer, badge: e.target.value})}
                        className="input-field"
                      />
                      <input
                        type="datetime-local"
                        placeholder="Valid Until *"
                        value={newOffer.validUntil}
                        onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                        className="input-field col-span-2"
                      />
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                        {newOffer.terms.map((term, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder={`Term ${index + 1}`}
                              value={term}
                              onChange={(e) => {
                                const newTerms = [...newOffer.terms];
                                newTerms[index] = e.target.value;
                                setNewOffer({...newOffer, terms: newTerms});
                              }}
                              className="input-field flex-1"
                            />
                            <button
                              onClick={() => {
                                const newTerms = newOffer.terms.filter((_, i) => i !== index);
                                setNewOffer({...newOffer, terms: newTerms});
                              }}
                              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setNewOffer({...newOffer, terms: [...newOffer.terms, '']})}
                          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center gap-1"
                        >
                          <Plus size={16} /> Add Term
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleAddOffer}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add Offer
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.offers?.map(offer => (
                    <div key={offer._id} className="bg-white rounded-xl p-4 shadow border border-gray-100">
                      {offer.image && (
                        <img src={offer.image} alt={offer.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-800 flex-1">{offer.title}</h5>
                        <button
                          onClick={() => handleDeleteOffer(offer._id)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                      <div className="text-sm text-gray-500">
                        <p>Discount: {offer.discount}</p>
                        <p>Valid Until: {new Date(offer.validUntil).toLocaleDateString()}</p>
                        <p>Terms: {offer.terms?.length || 0} conditions</p>
                      </div>
                    </div>
                  )) || []}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Add New Gallery Item */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Gallery Management</h3>
                  <button
                    onClick={() => setShowGalleryForm(!showGalleryForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {showGalleryForm ? 'Cancel' : 'Add New Gallery Item'}
                  </button>
                </div>
                
                {showGalleryForm && (
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-700">Add New Gallery Item</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Image Title *"
                          value={newGalleryItem.title}
                          onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})}
                          className="input-field"
                        />
                        <textarea
                          placeholder="Description"
                          value={newGalleryItem.description}
                          onChange={(e) => setNewGalleryItem({...newGalleryItem, description: e.target.value})}
                          className="input-field h-24 resize-none"
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
                          <option value="restaurant">Restaurant</option>
                          <option value="events">Events</option>
                          <option value="team">Team</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Tags (comma separated)"
                          value={newGalleryItem.tags?.join(', ') || ''}
                          onChange={(e) => setNewGalleryItem({
                            ...newGalleryItem, 
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          })}
                          className="input-field"
                        />
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
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleAddGalleryItem}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add Gallery Item
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.galleryItems?.map(item => (
                    <div key={item._id} className="relative group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-white/80 text-sm capitalize">{item.category}</p>
                        {item.description && (
                          <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.description}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )) || []}
                </div>
                
                {(!data.galleryItems || data.galleryItems.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No gallery items found. Add your first gallery item above!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Item Modal */}
      <EditItemModal 
        item={editingItem} 
        onClose={() => setEditingItem(null)} 
        onSave={handleUpdateMenuItem} 
      />
      
      <style>{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .input-field:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .loading-spinner {
          border: 2px solid #f3f4f6;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedAdminPanel;