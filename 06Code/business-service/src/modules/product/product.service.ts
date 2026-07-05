import crudClient from '../../shared/http/crud.client';

export const productService = {
  getAllProducts: async (categoryId?: number) => {
    const response = await crudClient.get('/api/product', {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data.data;
  },

  getProductById: async (id: number) => {
    const response = await crudClient.get(`/api/product/${id}`);
    return response.data.data;
  },

  createProduct: async (data: unknown) => {
    const response = await crudClient.post('/api/product', data);
    return response.data.data;
  },

  updateProduct: async (id: number, data: unknown) => {
    const response = await crudClient.put(`/api/product/${id}`, data);
    return response.data.data;
  },

  updateStock: async (id: number, stock: number) => {
    const response = await crudClient.patch(`/api/product/${id}/stock`, { stock });
    return response.data.data;
  },

  deleteProduct: async (id: number) => {
    await crudClient.delete(`/api/product/${id}`);
  },

  getAllCategories: async () => {
    const response = await crudClient.get('/api/category');
    return response.data.data;
  },

  createCategory: async (data: unknown) => {
    const response = await crudClient.post('/api/category', data);
    return response.data.data;
  },

  updateCategory: async (id: number, data: unknown) => {
    const response = await crudClient.put(`/api/category/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: number) => {
    await crudClient.delete(`/api/category/${id}`);
  },
};
