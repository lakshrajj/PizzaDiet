import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Load data from JSON file or localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Try to load from JSON file first
        const response = await fetch('/data/menu.json?v=' + Date.now(), {
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const jsonData = await response.json();
          console.log('✅ Data loaded from JSON file');
          
          // Check if we have local changes
          const localData = localStorage.getItem('pizzaDietData');
          const localChanges = localStorage.getItem('pizzaDietLocalChanges');
          
          if (localChanges && localData) {
            const parsedLocalData = JSON.parse(localData);
            console.log('📝 Found local changes, using local data');
            setData(parsedLocalData);
            setHasLocalChanges(true);
          } else {
            setData(jsonData);
            setHasLocalChanges(false);
          }
          
          setLastSync(new Date().toISOString());
        } else {
          throw new Error('Failed to fetch JSON data');
        }
      } catch (error) {
        console.warn('⚠️ Failed to load from JSON, using localStorage or fallback:', error);
        
        // Fallback to localStorage
        const localData = localStorage.getItem('pizzaDietData');
        if (localData) {
          console.log('📱 Using localStorage data');
          setData(JSON.parse(localData));
          setHasLocalChanges(true);
        } else {
          console.log('🔄 Using initial data');
          setData(initialData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data locally and mark as changed
  const updateData = (newData) => {
    setData(newData);
    localStorage.setItem('pizzaDietData', JSON.stringify(newData));
    localStorage.setItem('pizzaDietLocalChanges', 'true');
    setHasLocalChanges(true);
  };

  // Menu Categories Management
  const addMenuCategory = (categoryId, categoryName, categoryIcon = '🍕', categoryColor = 'from-orange-500 to-red-500') => {
    const newData = { ...data };
    
    // Add to menu categories
    if (!newData.menuCategories) {
      newData.menuCategories = {};
    }
    
    newData.menuCategories[categoryId] = {
      id: categoryId,
      name: categoryName,
      icon: categoryIcon,
      color: categoryColor,
      createdAt: new Date().toISOString()
    };
    
    // Initialize empty menu items array for this category
    if (!newData.menuItems[categoryId]) {
      newData.menuItems[categoryId] = [];
    }
    
    updateData(newData);
  };

  const updateMenuCategory = (categoryId, updates) => {
    const newData = { ...data };
    
    if (newData.menuCategories && newData.menuCategories[categoryId]) {
      newData.menuCategories[categoryId] = {
        ...newData.menuCategories[categoryId],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      updateData(newData);
    }
  };

  const deleteMenuCategory = (categoryId) => {
    const newData = { ...data };
    
    // Remove category definition
    if (newData.menuCategories && newData.menuCategories[categoryId]) {
      delete newData.menuCategories[categoryId];
    }
    
    // Remove all menu items in this category
    if (newData.menuItems && newData.menuItems[categoryId]) {
      delete newData.menuItems[categoryId];
    }
    
    updateData(newData);
  };

  // Gallery Categories Management
  const addGalleryCategory = (categoryId, categoryName, categoryIcon = '📸') => {
    const newData = { ...data };
    
    if (!newData.galleryCategories) {
      newData.galleryCategories = {};
    }
    
    newData.galleryCategories[categoryId] = {
      id: categoryId,
      name: categoryName,
      icon: categoryIcon,
      createdAt: new Date().toISOString()
    };
    
    updateData(newData);
  };

  const updateGalleryCategory = (categoryId, updates) => {
    const newData = { ...data };
    
    if (newData.galleryCategories && newData.galleryCategories[categoryId]) {
      newData.galleryCategories[categoryId] = {
        ...newData.galleryCategories[categoryId],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      updateData(newData);
    }
  };

  const deleteGalleryCategory = (categoryId) => {
    const newData = { ...data };
    
    // Remove category definition
    if (newData.galleryCategories && newData.galleryCategories[categoryId]) {
      delete newData.galleryCategories[categoryId];
    }
    
    // Remove all gallery items in this category or move to 'uncategorized'
    if (newData.galleryItems) {
      newData.galleryItems = newData.galleryItems.filter(item => item.category !== categoryId);
    }
    
    updateData(newData);
  };

  // Get available categories
  const getMenuCategories = () => {
    // Default categories if none exist
    const defaultCategories = {
      'featured': { id: 'featured', name: 'Featured', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
      'simply-veg': { id: 'simply-veg', name: 'Simply Veg', icon: '🥬', color: 'from-green-500 to-emerald-500' },
      'deluxe': { id: 'deluxe', name: 'Deluxe', icon: '👑', color: 'from-purple-500 to-pink-500' }
    };
    
    return data.menuCategories || defaultCategories;
  };

  const getGalleryCategories = () => {
    // Default categories if none exist
    const defaultCategories = {
      'pizzas': { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
      'ingredients': { id: 'ingredients', name: 'Ingredients', icon: '🥬' },
      'specials': { id: 'specials', name: 'Specials', icon: '⭐' }
    };
    
    return data.galleryCategories || defaultCategories;
  };

  // Existing menu item functions
  const addMenuItem = (category, item) => {
    const newData = { ...data };
    const newId = Math.max(
      ...Object.values(data.menuItems).flat().map(item => item.id),
      0
    ) + 1;
    
    if (!newData.menuItems[category]) {
      newData.menuItems[category] = [];
    }
    
    newData.menuItems[category] = [
      ...newData.menuItems[category], 
      { ...item, id: newId }
    ];
    
    updateData(newData);
  };

  const updateMenuItem = (category, itemId, updatedItem) => {
    const newData = { ...data };
    if (newData.menuItems[category]) {
      newData.menuItems[category] = newData.menuItems[category].map(item =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      );
      updateData(newData);
    }
  };

  const deleteMenuItem = (category, itemId) => {
    const newData = { ...data };
    if (newData.menuItems[category]) {
      newData.menuItems[category] = newData.menuItems[category].filter(
        item => item.id !== itemId
      );
      updateData(newData);
    }
  };

  // Existing gallery item functions
  const addGalleryItem = (item) => {
    const newData = { ...data };
    const newId = Math.max(...(data.galleryItems?.map(item => item.id) || [0]), 0) + 1;
    newData.galleryItems = [...(newData.galleryItems || []), { ...item, id: newId }];
    updateData(newData);
  };

  const deleteGalleryItem = (itemId) => {
    const newData = { ...data };
    newData.galleryItems = (newData.galleryItems || []).filter(item => item.id !== itemId);
    updateData(newData);
  };

  // Export current data as JSON file
  const exportData = () => {
    const exportData = {
      ...data,
      lastUpdated: new Date().toISOString(),
      version: "1.0.0"
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pizza-diet-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return dataStr;
  };

  // Reset to original JSON data
  const resetToOriginal = async () => {
    try {
      const response = await fetch('/data/menu.json?v=' + Date.now());
      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
        localStorage.removeItem('pizzaDietData');
        localStorage.removeItem('pizzaDietLocalChanges');
        setHasLocalChanges(false);
        return true;
      }
    } catch (error) {
      console.error('Failed to reset to original data:', error);
    }
    return false;
  };

  // Sync data from server
  const syncData = async () => {
    try {
      const response = await fetch('/data/menu.json?v=' + Date.now());
      if (response.ok) {
        const jsonData = await response.json();
        
        // If no local changes, just update
        if (!hasLocalChanges) {
          setData(jsonData);
          setLastSync(new Date().toISOString());
          return { success: true, conflicts: false };
        }
        
        // If there are local changes, we need to handle conflicts
        return { 
          success: false, 
          conflicts: true, 
          serverData: jsonData,
          localData: data 
        };
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
    
    return { success: false, conflicts: false };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Pizza Diet</h2>
          <p className="text-gray-600">Fetching fresh data...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{
      data,
      loading,
      isOnline,
      lastSync,
      hasLocalChanges,
      updateData,
      // Menu Categories
      addMenuCategory,
      updateMenuCategory,
      deleteMenuCategory,
      getMenuCategories,
      // Gallery Categories  
      addGalleryCategory,
      updateGalleryCategory,
      deleteGalleryCategory,
      getGalleryCategories,
      // Menu Items
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      // Gallery Items
      addGalleryItem,
      deleteGalleryItem,
      // Utilities
      exportData,
      resetToOriginal,
      syncData
    }}>
      {children}
    </DataContext.Provider>
  );
};