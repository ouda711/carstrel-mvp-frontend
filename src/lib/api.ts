import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface CarsQueryParams {
  page?: number;
  limit?: number;
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  fuel_type?: string;
  body_type?: string;
  search?: string;
}

interface CarUpdateData {
  make?: string;
  model?: string;
  year?: number;
  price?: string;
  mileage?: number;
  transmission?: string;
  fuel_type?: string;
  body_type?: string;
  color?: string;
  description?: string;
}

interface LeadsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

interface ProfileUpdateData {
  dealership_name?: string;
  phone_number?: string;
  location?: string;
  email?: string;
}

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
  (error: AxiosError<ErrorResponse>) => {
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
  getAll: async (params?: CarsQueryParams) => {
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

  update: async (id: string, data: CarUpdateData) => {
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
  getMyLeads: async (params?: LeadsQueryParams) => {
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

// Dealers API (protected)
export const dealersAPI = {
  getStats: async () => {
    return api.get('/dealers/stats');
  },

  getRecentCars: async (limit: number = 5) => {
    return api.get('/dealers/recent-cars', { params: { limit } });
  },

  updateProfile: async (data: ProfileUpdateData) => {
    return api.put('/dealers/profile', data);
  },
};

export default api;