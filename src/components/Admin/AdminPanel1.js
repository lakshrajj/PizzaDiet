import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Settings, X, Save, Upload, Trash2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiRequest, API_ENDPOINTS, buildApiUrl } from '../../config/api';

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

  const [franchiseApplications, setFranchiseApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  
  // MongoDB state
  const [mongoMenuItems, setMongoMenuItems] = useState({});
  const [mongoCategories, setMongoCategories] = useState([]);
  const [loadingMenuData, setLoadingMenuData] = useState(false);

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

  const fetchFranchiseApplications = async () => {
    setLoadingApplications(true);
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.FRANCHISE_APPLICATIONS));
      const data = await response.json();
      if (data.success) {
        setFranchiseApplications(data.applications);
      } else {
        console.error('Failed to fetch applications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(buildApiUrl(`/api/franchise/applications/${applicationId}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      if (data.success) {
        setFranchiseApplications(prev => 
          prev.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        alert(`Application status updated to ${newStatus}`);
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating application status');
    }
  };

  // MongoDB menu functions
  const fetchMenuData = async () => {
    setLoadingMenuData(true);
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_ITEMS_GROUPED));
      const data = await response.json();
      if (data.success) {
        setMongoMenuItems(data.menuItems);
        setMongoCategories(data.categories);
      } else {
        console.error('Failed to fetch menu data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoadingMenuData(false);
    }
  };

  const handleAddMenuItemMongo = async () => {
    if (newItem.name && newItem.description && newItem.image) {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_ITEMS), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
        
        const data = await response.json();
        if (data.success) {
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
          fetchMenuData();
        } else {
          alert('Failed to add menu item: ' + data.message);
        }
      } catch (error) {
        console.error('Error adding menu item:', error);
        alert('Error adding menu item');
      }
    } else {
      alert('Please fill in all required fields (name, description, image)');
    }
  };

  const handleDeleteMenuItemMongo = async (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_ITEM_BY_ID(itemId)), {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          alert('Menu item deleted successfully!');
          fetchMenuData();
        } else {
          alert('Failed to delete menu item: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item');
      }
    }
  };

  const seedDatabase = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_SEED), {
        method: 'POST',
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Database seeded successfully!');
        fetchMenuData();
      } else {
        alert('Failed to seed database: ' + data.message);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Error seeding database');
    }
  };

  useEffect(() => {
    if (activeTab === 'franchise') {
      fetchFranchiseApplications();
    } else if (activeTab === 'menu') {
      fetchMenuData();
    }
  }, [activeTab]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in-review': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <button
            onClick={() => setActiveTab('franchise')}
            className={`px-8 py-4 font-semibold transition-colors ${
              activeTab === 'franchise' 
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Franchise Applications
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
                      {mongoCategories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                      {mongoCategories.length === 0 && (
                        <>
                          <option value="featured">Featured</option>
                          <option value="simply-veg">Simply Veg</option>
                          <option value="deluxe">Deluxe</option>
                        </>
                      )}
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
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleAddMenuItemMongo}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <Save size={20} />
                    Add to Database
                  </button>
                  <button
                    onClick={seedDatabase}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    🌱 Seed Database
                  </button>
                </div>
              </div>

              {/* Existing Menu Items from MongoDB */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Menu Items from Database</h3>
                  <button
                    onClick={fetchMenuData}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                
                {loadingMenuData ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <>
                    {Object.keys(mongoMenuItems).length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg mb-4">No menu items found in database</p>
                        <button
                          onClick={seedDatabase}
                          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          🌱 Seed Database with Initial Data
                        </button>
                      </div>
                    ) : (
                      Object.entries(mongoMenuItems).map(([categoryId, items]) => {
                        const category = mongoCategories.find(cat => cat.categoryId === categoryId);
                        return (
                          <div key={categoryId} className="mb-8">
                            <h4 className="text-xl font-semibold mb-4 text-purple-600 flex items-center gap-2">
                              <span>{category?.icon || '🍕'}</span>
                              {category?.name || categoryId.replace('-', ' ')}
                              <span className="text-sm text-gray-500">({items.length} items)</span>
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {items.map(item => (
                                <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                                  )}
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold text-gray-800 flex-1">{item.name}</h5>
                                    <button
                                      onClick={() => handleDeleteMenuItemMongo(item._id, item.name)}
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
                                    <p className="text-xs text-gray-400 mt-1">
                                      Created: {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}
              </div>
              
              {/* Legacy Local Data (Keep for backup) */}
              <div className="mt-12 border-t pt-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Legacy Local Data (Backup)</h3>
                {Object.entries(data.menuItems).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h4 className="text-xl font-semibold mb-4 text-gray-600 capitalize">{category.replace('-', ' ')}</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map(item => (
                        <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-75">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-3" />
                          )}
                          <h5 className="font-semibold text-gray-700">{item.name}</h5>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <div className="text-sm text-gray-500">
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

          {activeTab === 'franchise' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Franchise Applications</h3>
                <button
                  onClick={fetchFranchiseApplications}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {loadingApplications ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {franchiseApplications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <p className="text-gray-500 text-lg">No franchise applications found</p>
                    </div>
                  ) : (
                    franchiseApplications.map((application) => (
                      <div key={application._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800">{application.fullName}</h4>
                            <p className="text-gray-600">{application.email}</p>
                            <p className="text-gray-600">{application.phone}</p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span className="ml-2 capitalize">{application.status}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-2">Location Interest</h5>
                            <p className="text-gray-600">{application.locationInterest}</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-2">Investment Amount</h5>
                            <p className="text-gray-600">{application.investmentAmount}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Why Franchise?</h5>
                          <p className="text-gray-600 line-clamp-3">{application.whyFranchise}</p>
                        </div>

                        {application.businessName && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-gray-700 mb-2">Current Business</h5>
                            <p className="text-gray-600">{application.businessName}</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex gap-2">
                            {application.status !== 'approved' && (
                              <button
                                onClick={() => updateApplicationStatus(application._id, 'approved')}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                            )}
                            {application.status !== 'rejected' && (
                              <button
                                onClick={() => updateApplicationStatus(application._id, 'rejected')}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            )}
                            {application.status !== 'in-review' && (
                              <button
                                onClick={() => updateApplicationStatus(application._id, 'in-review')}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                Review
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              alert(`Full Application Details:\n\nName: ${application.fullName}\nEmail: ${application.email}\nPhone: ${application.phone}\nAddress: ${application.address}\nLocation Interest: ${application.locationInterest}\nInvestment: ${application.investmentAmount}\nWhy Franchise: ${application.whyFranchise}\n\nBusiness Name: ${application.businessName || 'None'}\nBusiness Address: ${application.businessAddress || 'None'}\nOwns Franchise: ${application.ownsFranchise || 'Not specified'}\nIndustry Experience: ${application.industryExperience || 'Not specified'}\nBusiness Experience: ${application.businessExperience || 'Not specified'}\n\nSubmitted: ${new Date(application.submittedAt).toLocaleString()}`);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;