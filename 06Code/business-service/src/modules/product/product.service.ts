import crudClient from '../../shared/http/crud.client';

export const productService = {
  getAllProducts: async (categoryId?: number) => {
    const response = await crudClient.get('/api/products', {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data.data;
  },

  getProductById: async (id: number) => {
    const response = await crudClient.get(`/api/products/${id}`);
    return response.data.data;
  },

  createProduct: async (data: unknown) => {
    const response = await crudClient.post('/api/products', data);
    return response.data.data;
  },

  updateProduct: async (id: number, data: unknown) => {
    const response = await crudClient.put(`/api/products/${id}`, data);
    return response.data.data;
  },

  updateStock: async (id: number, stock: number) => {
    const response = await crudClient.patch(`/api/products/${id}/stock`, { stock });
    return response.data.data;
  },

  deleteProduct: async (id: number) => {
    await crudClient.delete(`/api/products/${id}`);
  },

  getAllCategories: async () => {
    const response = await crudClient.get('/api/categories');
    return response.data.data;
  },
};
