import axios from 'axios';
import { ApiResponse, AuthResponse, PlaceOrderInput, Order, Product, Category, SalesReport } from '@/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BUSINESS_SERVICE_URL ?? 'http://localhost:5017',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    const status = error.response?.status ?? 500;
    const apiError = new Error(message) as Error & { statusCode: number };
    apiError.statusCode = status;
    return Promise.reject(apiError);
  }
);

// Auth endpoints
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string; province?: string }) =>
    apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data).then((r) => r.data.data),

  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password }).then((r) => r.data.data),

  getProfile: () =>
    apiClient.get('/api/auth/profile').then((r) => r.data.data),
};

// Product endpoints
export const productApi = {
  getAll: (categoryId?: number) =>
    apiClient.get<ApiResponse<Product[]>>('/api/product', {
      params: categoryId ? { categoryId } : undefined,
    }).then((r) => r.data.data),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Product>>(`/api/product/${id}`).then((r) => r.data.data),

  getCategories: () =>
    apiClient.get<ApiResponse<Category[]>>('/api/product/categories').then((r) => r.data.data),

  create: (data: Partial<Product>) =>
    apiClient.post<ApiResponse<Product>>('/api/product', data).then((r) => r.data.data),

  update: (id: number, data: Partial<Product>) =>
    apiClient.put<ApiResponse<Product>>(`/api/product/${id}`, data).then((r) => r.data.data),

  updateStock: (id: number, stock: number) =>
    apiClient.patch<ApiResponse<Product>>(`/api/product/${id}/stock`, { stock }).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete(`/api/product/${id}`),
};

// Order endpoints
export const orderApi = {
  placeOrder: (data: PlaceOrderInput) =>
    apiClient.post<ApiResponse<Order>>('/api/order', data).then((r) => r.data.data),

  getMyOrders: () =>
    apiClient.get<ApiResponse<Order[]>>('/api/order/my-orders').then((r) => r.data.data),

  getByReference: (reference: string) =>
    apiClient.get<ApiResponse<Order>>(`/api/order/reference/${reference}`).then((r) => r.data.data),

  getAllOrders: () =>
    apiClient.get<ApiResponse<Order[]>>('/api/order').then((r) => r.data.data),

  changeStatus: (id: number, status: string) =>
    apiClient.patch<ApiResponse<Order>>(`/api/order/${id}/status`, { status }).then((r) => r.data.data),

  approveCustomized: (id: number) =>
    apiClient.patch<ApiResponse<Order>>(`/api/order/${id}/approve-customized`).then((r) => r.data.data),
};

// Report endpoints
export const reportApi = {
  getSalesReport: (startDate?: string, endDate?: string) =>
    apiClient.get<ApiResponse<SalesReport>>('/api/report/sales', {
      params: { startDate, endDate },
    }).then((r) => r.data.data),
};

export default apiClient;
