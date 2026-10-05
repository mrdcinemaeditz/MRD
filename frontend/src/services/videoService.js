import api from './api';

export const videoService = {
  getVideos: async (params = {}) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  getFeaturedVideos: async (limit = 6) => {
    const response = await api.get('/videos/featured', { params: { limit } });
    return response.data;
  },

  getVideo: async (idOrSlug) => {
    const response = await api.get(`/videos/${idOrSlug}`);
    return response.data;
  },

  toggleLike: async (videoId) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  },

  getComments: async (videoId, page = 1) => {
    const response = await api.get(`/videos/${videoId}/comments`, { params: { page } });
    return response.data;
  },

  postComment: async (videoId, body) => {
    const response = await api.post(`/videos/${videoId}/comments`, { body });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  reportComment: async (commentId, reason) => {
    const response = await api.post(`/comments/${commentId}/report`, { reason });
    return response.data;
  }
};
