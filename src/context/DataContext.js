import React, { createContext, useContext, useState } from 'react';
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
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('pizzaDietData');
    return saved ? JSON.parse(saved) : initialData;
  });

  const updateData = (newData) => {
    setData(newData);
    localStorage.setItem('pizzaDietData', JSON.stringify(newData));
  };

  const addMenuItem = (category, item) => {
    const newData = { ...data };
    const newId = Math.max(...Object.values(data.menuItems).flat().map(item => item.id)) + 1;
    newData.menuItems[category] = [...(newData.menuItems[category] || []), { ...item, id: newId }];
    updateData(newData);
  };

  const updateMenuItem = (category, itemId, updatedItem) => {
    const newData = { ...data };
    newData.menuItems[category] = newData.menuItems[category].map(item =>
      item.id === itemId ? { ...item, ...updatedItem } : item
    );
    updateData(newData);
  };

  const deleteMenuItem = (category, itemId) => {
    const newData = { ...data };
    newData.menuItems[category] = newData.menuItems[category].filter(item => item.id !== itemId);
    updateData(newData);
  };

  const addGalleryItem = (item) => {
    const newData = { ...data };
    const newId = Math.max(...data.galleryItems.map(item => item.id)) + 1;
    newData.galleryItems = [...newData.galleryItems, { ...item, id: newId }];
    updateData(newData);
  };

  const deleteGalleryItem = (itemId) => {
    const newData = { ...data };
    newData.galleryItems = newData.galleryItems.filter(item => item.id !== itemId);
    updateData(newData);
  };

  return (
    <DataContext.Provider value={{
      data,
      updateData,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addGalleryItem,
      deleteGalleryItem
    }}>
      {children}
    </DataContext.Provider>
  );
};