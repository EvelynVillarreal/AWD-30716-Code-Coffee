import crudClient from '../../shared/http/crud.client';

export const shippingService = {
  getAllConfigs: async () => {
    const response = await crudClient.get('/api/shipping-config');
    return response.data.data;
  },

  createConfig: async (data: unknown) => {
    const response = await crudClient.post('/api/shipping-config', data);
    return response.data.data;
  },

  updateConfig: async (id: number, data: unknown) => {
    const response = await crudClient.put(`/api/shipping-config/${id}`, data);
    return response.data.data;
  },

  deleteConfig: async (id: number) => {
    await crudClient.delete(`/api/shipping-config/${id}`);
  },

  calculateCost: async (destinationProvince: string) => {
    const response = await crudClient.get('/api/shipping-config');
    const configs = response.data.data as Array<{ baseProvince: string; destinationProvince: string; additionalCost: number }>;
    
    // We are hardcoding Pichincha as the base province per user request
    const baseProvince = 'Pichincha';
    
    const config = configs.find(
      (c) => c.baseProvince.toLowerCase() === baseProvince.toLowerCase() && 
             c.destinationProvince.toLowerCase() === destinationProvince.toLowerCase()
    );

    if (config) {
      return config.additionalCost;
    }

    // Default cost if no specific rule is found (let's use 5 as a fallback, or 0. 0 is safer to avoid blocks)
    return 0;
  }
};
