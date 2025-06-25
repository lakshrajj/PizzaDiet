// API Configuration for different environments
const getBaseURL = () => {
  // In production, use the same domain for API calls (VPS server)
  if (process.env.NODE_ENV === 'production') {
    return ''; // Relative URLs will use the same domain
  }
  
  // In development, use localhost backend
  return 'http://localhost:5003';
};

export const API_BASE_URL = getBaseURL();

// API endpoints
export const API_ENDPOINTS = {
  // Health check
  HEALTH: '/api/health',
  
  // Franchise endpoints
  FRANCHISE_APPLY: '/api/franchise/apply',
  FRANCHISE_APPLICATIONS: '/api/franchise/applications',
  FRANCHISE_APPLICATION_BY_ID: (id) => `/api/franchise/${id}`,
  
  // Menu endpoints
  MENU_CATEGORIES: '/api/menu/categories',
  MENU_ITEMS: '/api/menu/items',
  MENU_ITEMS_GROUPED: '/api/menu/items/grouped',
  MENU_ITEM_BY_ID: (id) => `/api/menu/items/${id}`,
  MENU_CATEGORY_BY_ID: (id) => `/api/menu/categories/${id}`,
  
  // Offers endpoints
  OFFERS: '/api/offers',
  OFFERS_ALL: '/api/offers/all',
  OFFER_BY_ID: (id) => `/api/offers/${id}`,
  OFFERS_SEED: '/api/offers/seed',
  
  // Menu management endpoints
  MENU_CLEAR_AND_SEED: '/api/menu/clear-and-seed',
  MENU_SEED: '/api/menu/seed'
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// API utility functions
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Enhanced API helper with convenient methods
const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
  
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
  
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};

export { api };
export default api;