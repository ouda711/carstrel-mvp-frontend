import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({
      message,
      errors: error.response?.data?.errors,
      status: error.response?.status,
    });
  }
);

// Auth API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    dealership_name: string;
    phone_number: string;
    location?: string;
  }) => {
    return api.post('/auth/register', data);
  },

  login: async (data: { email: string; password: string }) => {
    return api.post('/auth/login', data);
  },

  logout: async () => {
    return api.post('/auth/logout');
  },

  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};

// Cars API
export const carsAPI = {
  // Public endpoints
  getAll: async (params?: {
    page?: number;
    limit?: number;
    make?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    transmission?: string;
    fuel_type?: string;
    search?: string;
  }) => {
    return api.get('/public/cars', { params });
  },

  getBySlug: async (slug: string) => {
    return api.get(`/public/cars/${slug}`);
  },

  getFeatured: async (limit: number = 6) => {
    return api.get('/public/cars/featured', { params: { limit } });
  },

  getLatest: async (limit: number = 6) => {
    return api.get('/public/cars/latest', { params: { limit } });
  },

  getMakes: async () => {
    return api.get('/public/cars/makes');
  },

  getPriceRange: async () => {
    return api.get('/public/cars/price-range');
  },

  // Protected endpoints (dealer)
  getMyCars: async () => {
    return api.get('/cars/my-cars');
  },

  create: async (data: FormData) => {
    return api.post('/cars', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: async (id: string, data: Partial<{
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    transmission: string;
    fuel_type: string;
    body_type?: string;
    color?: string;
    description?: string;
    status?: string;
  }>) => {
    return api.put(`/cars/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/cars/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return api.patch(`/cars/${id}/status`, { status });
  },
};

// Leads API
export const leadsAPI = {
  // Public endpoint
  create: async (data: {
    car_id: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_email?: string;
    message?: string;
  }) => {
    return api.post('/public/leads', data);
  },

  // Protected endpoints (dealer)
  getMyLeads: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get('/leads', { params });
  },

  getStats: async () => {
    return api.get('/leads/stats');
  },

  updateStatus: async (id: string, status: string) => {
    return api.patch(`/leads/${id}/status`, { status });
  },

  delete: async (id: string) => {
    return api.delete(`/leads/${id}`);
  },
};

// Dealers API (placeholder)
export const dealersAPI = {
  getStats: async () => {
    return api.get('/dealers/stats');
  },

  getMyCars: async () => {
    return api.get('/dealers/cars');
  },

  updateProfile: async (data: {
    dealership_name?: string;
    phone_number?: string;
    location?: string;
  }) => {
    return api.put('/dealers/profile', data);
  },
};

export default api;