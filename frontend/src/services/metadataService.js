import api from './api';

export const metadataService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  getTestimonials: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },

  getSiteSettings: async () => {
    const response = await api.get('/site_settings');
    return response.data;
  }
};
