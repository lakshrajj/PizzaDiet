import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Users, Menu, FileText, RefreshCw, Plus, Trash2, Eye, CheckCircle, XCircle, Clock, Search, Upload, Edit, Tag, Gift } from 'lucide-react';
import AddMenuItemForm from '../components/Admin/AddMenuItemForm';
import EditMenuItemForm from '../components/Admin/EditMenuItemForm';
import EditCategoryForm from '../components/Admin/EditCategoryForm';
import EditOfferForm from '../components/Admin/EditOfferForm';
import { apiRequest, API_ENDPOINTS, buildApiUrl } from '../config/api';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [franchiseApplications, setFranchiseApplications] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalMenuItems: 0
  });

  // Fetch franchise applications
  const fetchFranchiseApplications = useCallback(async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.FRANCHISE_APPLICATIONS);
      if (data.success) {
        setFranchiseApplications(data.applications);
        
        // Update stats
        const pending = data.applications.filter(app => app.status === 'pending').length;
        const approved = data.applications.filter(app => app.status === 'approved').length;
        
        setStats(prev => ({
          ...prev,
          totalApplications: data.applications.length,
          pendingApplications: pending,
          approvedApplications: approved
        }));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, []);

  // Fetch menu data
  const fetchMenuData = useCallback(async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.MENU_ITEMS_GROUPED);
      if (data.success) {
        setMenuItems(data.menuItems);
        setCategories(data.categories);
        
        // Calculate total menu items
        const total = Object.values(data.menuItems).reduce((sum, items) => sum + items.length, 0);
        setStats(prev => ({
          ...prev,
          totalMenuItems: total
        }));
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  }, []);

  // Fetch offers data
  const fetchOffers = useCallback(async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.OFFERS_ALL);
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFranchiseApplications(),
        fetchMenuData(),
        fetchOffers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFranchiseApplications, fetchMenuData, fetchOffers]);

  // Update franchise application status
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
        fetchFranchiseApplications(); // Refresh stats
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating application status');
    }
  };

  // Delete menu item
  const deleteMenuItem = async (itemId, itemName) => {
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

  // Save menu item (create or update)
  const handleMenuItemSave = async (formData) => {
    try {
      const url = editingMenuItem 
        ? buildApiUrl(API_ENDPOINTS.MENU_ITEM_BY_ID(editingMenuItem._id))
        : buildApiUrl(API_ENDPOINTS.MENU_ITEMS);
      
      const method = editingMenuItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert(editingMenuItem ? 'Menu item updated successfully!' : 'Menu item created successfully!');
        setShowMenuItemForm(false);
        setEditingMenuItem(null);
        fetchMenuData();
      } else {
        throw new Error(data.message || 'Failed to save menu item');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      throw error;
    }
  };

  // Open edit form for menu item
  const editMenuItem = (item) => {
    setEditingMenuItem(item);
    setShowMenuItemForm(true);
  };

  // Open create form for new menu item
  const createMenuItem = () => {
    setEditingMenuItem(null);
    setShowMenuItemForm(true);
  };

  // Seed database with comprehensive data
  const clearAndSeedDatabase = async () => {
    if (window.confirm('This will clear ALL existing menu data and replace it with the new comprehensive menu. Are you sure?')) {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_CLEAR_AND_SEED), {
          method: 'POST',
        });
        
        const data = await response.json();
        if (data.success) {
          alert(`Database cleared and seeded successfully!\n\nStats:\n- Categories: ${data.stats.categories}\n- Menu Items: ${data.stats.menuItems}`);
          fetchMenuData();
        } else {
          alert('Failed to clear and seed database: ' + data.message);
        }
      } catch (error) {
        console.error('Error clearing and seeding database:', error);
        alert('Error clearing and seeding database');
      }
    }
  };

  // Seed database (legacy function)
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

  // Category management functions
  const deleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"? This will also deactivate all menu items in this category.`)) {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.MENU_CATEGORY_BY_ID(categoryId)), {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          alert('Category deleted successfully!');
          fetchMenuData();
        } else {
          alert('Failed to delete category: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      }
    }
  };

  const handleCategorySave = (savedCategory) => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    fetchMenuData();
    alert(`Category ${editingCategory ? 'updated' : 'created'} successfully!`);
  };

  // Offer management functions
  const deleteOffer = async (offerId, offerTitle) => {
    if (window.confirm(`Are you sure you want to delete "${offerTitle}"?`)) {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.OFFER_BY_ID(offerId)), {
          method: 'DELETE',
        });
        
        const data = await response.json();
        if (data.success) {
          alert('Offer deleted successfully!');
          fetchOffers();
        } else {
          alert('Failed to delete offer: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Error deleting offer');
      }
    }
  };

  const handleOfferSave = (savedOffer) => {
    setShowOfferForm(false);
    setEditingOffer(null);
    fetchOffers();
    alert(`Offer ${editingOffer ? 'updated' : 'created'} successfully!`);
  };

  const seedOffers = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.OFFERS_SEED), {
        method: 'POST',
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Offers seeded successfully!');
        fetchOffers();
      } else {
        alert('Failed to seed offers: ' + data.message);
      }
    } catch (error) {
      console.error('Error seeding offers:', error);
      alert('Error seeding offers');
    }
  };

  // Get status styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'in-review': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Filter applications based on search
  const filteredApplications = franchiseApplications.filter(app =>
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.locationInterest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <nav className="p-6 space-y-2">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveSection('franchise')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'franchise' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Franchise Applications
              {stats.pendingApplications > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingApplications}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveSection('menu')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'menu' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Menu className="w-5 h-5" />
              Menu Management
            </button>
            
            <button
              onClick={() => setActiveSection('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'categories' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Tag className="w-5 h-5" />
              Categories
            </button>
            
            <button
              onClick={() => setActiveSection('offers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'offers' 
                  ? 'bg-blue-100 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Gift className="w-5 h-5" />
              Offers & Deals
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Applications</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Approved</p>
                      <p className="text-3xl font-bold text-green-600">{stats.approvedApplications}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Menu Items</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.totalMenuItems}</p>
                    </div>
                    <Menu className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveSection('franchise')}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Users className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-blue-700">Review Applications</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('menu')}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Menu className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-green-700">Manage Menu</span>
                  </button>
                  
                  <button
                    onClick={clearAndSeedDatabase}
                    className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-purple-600" />
                    <span className="font-medium text-purple-700">Load New Menu</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'franchise' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Franchise Applications</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No franchise applications found</p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <div key={application._id} className="bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{application.fullName}</h3>
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
                            <h4 className="font-semibold text-gray-700 mb-1">Location Interest</h4>
                            <p className="text-gray-600">{application.locationInterest}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Investment Amount</h4>
                            <p className="text-gray-600">{application.investmentAmount}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-1">Why Franchise?</h4>
                          <p className="text-gray-600 line-clamp-2">{application.whyFranchise}</p>
                        </div>

                        {application.businessName && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-1">Current Business</h4>
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

          {activeSection === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
                <div className="flex gap-4">
                  <button
                    onClick={clearAndSeedDatabase}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Load New Menu Data
                  </button>
                  <button
                    onClick={seedDatabase}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Add Sample Data
                  </button>
                  <button
                    onClick={createMenuItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Menu Item
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.keys(menuItems).length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                      <Menu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-4">No menu items found in database</p>
                      <button
                        onClick={seedDatabase}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        🌱 Seed Database with Initial Data
                      </button>
                    </div>
                  ) : (
                    Object.entries(menuItems).map(([categoryId, items]) => {
                      const category = categories.find(cat => cat.categoryId === categoryId);
                      return (
                        <div key={categoryId} className="bg-white rounded-xl shadow-lg border p-6">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span>{category?.icon || '🍕'}</span>
                            {category?.name || categoryId.replace('-', ' ')}
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {items.length} items
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map(item => (
                              <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                {item.image && (
                                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-gray-800 flex-1">{item.name}</h4>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => editMenuItem(item)}
                                      className="text-blue-500 hover:bg-blue-50 p-1 rounded transition-colors"
                                      title="Edit menu item"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteMenuItem(item._id, item.name)}
                                      className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                      title="Delete menu item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
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
                </div>
              )}
            </div>
          )}

          {activeSection === 'add-menu' && (
            <div className="space-y-6">
              <AddMenuItemForm
                categories={categories}
                onSave={() => {
                  setActiveSection('menu');
                  fetchMenuData();
                }}
                onCancel={() => setActiveSection('menu')}
              />
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Category Management</h2>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category._id} className="bg-white rounded-xl shadow-lg border p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setShowCategoryForm(true);
                            }}
                            className="text-blue-500 hover:bg-blue-50 p-1 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category._id, category.name)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>ID:</strong> {category.categoryId}</p>
                        <p><strong>Order:</strong> {category.order}</p>
                        <p><strong>Items:</strong> {menuItems[category.categoryId]?.length || 0}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'offers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Offers & Deals Management</h2>
                <div className="flex gap-3">
                  <button
                    onClick={seedOffers}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Seed Sample Offers
                  </button>
                  <button
                    onClick={() => {
                      setEditingOffer(null);
                      setShowOfferForm(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Offer
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                      <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-4">No offers found</p>
                      <button
                        onClick={seedOffers}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        🎁 Create Sample Offers
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {offers.map((offer) => (
                        <div key={offer._id} className="bg-white rounded-xl shadow-lg border overflow-hidden">
                          {offer.image && (
                            <img 
                              src={offer.image} 
                              alt={offer.title} 
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900 flex-1">{offer.title}</h3>
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={() => {
                                    setEditingOffer(offer);
                                    setShowOfferForm(true);
                                  }}
                                  className="text-blue-500 hover:bg-blue-50 p-1 rounded transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteOffer(offer._id, offer.title)}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                {offer.discount}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                offer.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {offer.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{offer.description}</p>
                            {offer.badge && (
                              <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-2">
                                {offer.badge}
                              </span>
                            )}
                            <div className="text-xs text-gray-500">
                              <p>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</p>
                              <p>Terms: {offer.terms.length} conditions</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Created: {new Date(offer.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Category Form Modal */}
          {showCategoryForm && (
            <EditCategoryForm
              category={editingCategory}
              onSave={handleCategorySave}
              onCancel={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
              }}
              isEditing={!!editingCategory}
            />
          )}

          {/* Offer Form Modal */}
          {showOfferForm && (
            <EditOfferForm
              offer={editingOffer}
              onSave={handleOfferSave}
              onCancel={() => {
                setShowOfferForm(false);
                setEditingOffer(null);
              }}
              isEditing={!!editingOffer}
            />
          )}

          {/* Menu Item Form Modal */}
          {showMenuItemForm && (
            <EditMenuItemForm
              item={editingMenuItem}
              categories={categories}
              onSave={handleMenuItemSave}
              onClose={() => {
                setShowMenuItemForm(false);
                setEditingMenuItem(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;