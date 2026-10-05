import api from './api';

export const enquiryService = {
  submitEnquiry: async (data) => {
    const response = await api.post('/enquiries', { enquiry: data });
    return response.data;
  }
};
