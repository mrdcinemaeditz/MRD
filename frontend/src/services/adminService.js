import api from './api';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Videos
  getVideos: async (params = {}) => {
    const response = await api.get('/admin/videos', { params });
    return response.data;
  },

  createVideo: async (videoData) => {
    const response = await api.post('/admin/videos', videoData);
    return response.data;
  },

  updateVideo: async (id, videoData) => {
    const response = await api.put(`/admin/videos/${id}`, videoData);
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/admin/videos/${id}`);
    return response.data;
  },

  toggleFeatured: async (id) => {
    const response = await api.patch(`/admin/videos/${id}/toggle_featured`);
    return response.data;
  },

  reorderVideos: async (orderedIds) => {
    const response = await api.patch('/admin/videos/reorder', { ordered_ids: orderedIds });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/admin/categories', { category: data });
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, { category: data });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Comments & Moderation
  getComments: async (params = {}) => {
    const response = await api.get('/admin/comments', { params });
    return response.data;
  },

  approveComment: async (id) => {
    const response = await api.patch(`/admin/comments/${id}/approve`);
    return response.data;
  },

  flagComment: async (id) => {
    const response = await api.patch(`/admin/comments/${id}/flag`);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  },

  blockUser: async (commentId) => {
    const response = await api.post(`/admin/comments/${commentId}/block_user`);
    return response.data;
  },

  getReports: async (params = {}) => {
    const response = await api.get('/admin/comments/reports', { params });
    return response.data;
  },

  // Enquiries
  getEnquiries: async (params = {}) => {
    const response = await api.get('/admin/enquiries', { params });
    return response.data;
  },

  getUnreadEnquiriesCount: async () => {
    const response = await api.get('/admin/enquiries/unread_count');
    return response.data;
  },

  markEnquiryRead: async (id) => {
    const response = await api.patch(`/admin/enquiries/${id}/mark_read`);
    return response.data;
  },

  markAllEnquiriesRead: async () => {
    const response = await api.patch('/admin/enquiries/mark_all_read');
    return response.data;
  },

  getEnquiry: async (id) => {
    const response = await api.get(`/admin/enquiries/${id}`);
    return response.data;
  },

  updateEnquiryStatus: async (id, status) => {
    const response = await api.put(`/admin/enquiries/${id}`, { enquiry: { status } });
    return response.data;
  },

  deleteEnquiry: async (id) => {
    const response = await api.delete(`/admin/enquiries/${id}`);
    return response.data;
  },

  // Brands
  getBrands: async () => {
    const response = await api.get('/admin/brands');
    return response.data;
  },

  createBrand: async (data) => {
    const response = await api.post('/admin/brands', { brand: data });
    return response.data;
  },

  updateBrand: async (id, data) => {
    const response = await api.put(`/admin/brands/${id}`, { brand: data });
    return response.data;
  },

  deleteBrand: async (id) => {
    const response = await api.delete(`/admin/brands/${id}`);
    return response.data;
  },

  // Testimonials
  getTestimonials: async () => {
    const response = await api.get('/admin/testimonials');
    return response.data;
  },

  createTestimonial: async (data) => {
    const response = await api.post('/admin/testimonials', { testimonial: data });
    return response.data;
  },

  updateTestimonial: async (id, data) => {
    const response = await api.put(`/admin/testimonials/${id}`, { testimonial: data });
    return response.data;
  },

  deleteTestimonial: async (id) => {
    const response = await api.delete(`/admin/testimonials/${id}`);
    return response.data;
  },

  // Site Settings
  getSiteSettings: async () => {
    const response = await api.get('/admin/site_settings');
    return response.data;
  },

  updateSiteSettings: async (settings) => {
    const response = await api.put('/admin/site_settings', { settings });
    return response.data;
  },

  // Push Notifications
  registerPushDevice: async (data) => {
    const response = await api.post('/admin/push/register', data);
    return response.data;
  },

  unregisterPushDevice: async (data = {}) => {
    const response = await api.delete('/admin/push/unregister', { data });
    return response.data;
  },

  sendTestPushNotification: async () => {
    const response = await api.post('/admin/push/test');
    return response.data;
  }
};
