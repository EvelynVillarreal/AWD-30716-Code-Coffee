// Shared TypeScript interfaces for the Artisan Shop frontend

export type UserRole = 'customer' | 'admin';

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  province?: string;
  role: UserRole;
};

export type Category = {
  id: number;
  name: string;
};

export type ProductPhoto = {
  id: number;
  productId: number;
  url: string;
  order: number;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  allowsCustomization: boolean;
  categoryId: number;
  category?: Category;
  photos?: ProductPhoto[];
};

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderDetail = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  customizationDetails?: string;
  product?: Product;
};

export type OrderStatusHistory = {
  id: number;
  orderId: number;
  status: OrderStatus;
  date: string;
};

export type Order = {
  id: number;
  referenceNumber: string;
  userId?: number;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  isCustomized: boolean;
  createdAt: string;
  details?: OrderDetail[];
  statusHistory?: OrderStatusHistory[];
  user?: User;
};

export type CartItem = {
  product: Product;
  quantity: number;
  customizationDetails?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type PlaceOrderInput = {
  contactName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  items: {
    productId: number;
    quantity: number;
    customizationDetails?: string;
  }[];
};

export type SalesReport = {
  period: { startDate: string; endDate: string };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    statusBreakdown: Record<string, number>;
  };
  orders: Order[];
};
