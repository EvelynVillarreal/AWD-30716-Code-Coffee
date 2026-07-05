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

  createProduct: async (data: any) => {
    const { photoUrl, ...productData } = data;
    const response = await crudClient.post('/api/product', productData);
    const product = response.data.data;

    if (photoUrl) {
      await crudClient.post('/api/product-photo', {
        productId: product.id,
        url: photoUrl,
        order: 0,
      });
      // Fetch the updated product with the photo attached
      const updatedResponse = await crudClient.get(`/api/product/${product.id}`);
      return updatedResponse.data.data;
    }
    return product;
  },

  updateProduct: async (id: number, data: any) => {
    const { photoUrl, ...productData } = data;
    const response = await crudClient.put(`/api/product/${id}`, productData);
    const product = response.data.data;

    if (photoUrl) {
      // For simplicity, just add the new photo. In a full system, you might delete old ones first.
      await crudClient.post('/api/product-photo', {
        productId: product.id,
        url: photoUrl,
        order: 0,
      });
      const updatedResponse = await crudClient.get(`/api/product/${product.id}`);
      return updatedResponse.data.data;
    }
    return product;
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
