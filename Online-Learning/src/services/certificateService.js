// Certificate Service - API calls for certificate-related operations
import api from './api';

const certificateService = {
  /**
   * Generate a certificate for a user after completing a course
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise} - Generated certificate data
   */
  generateCertificate: async (userId, courseId) => {
    try {
      const response = await api.post(`/certificates/${userId}/${courseId}`, {});
      return response;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  },

  /**
   * Get certificates by user
   * @param {number} userId - User ID
   * @returns {Promise} - List of user's certificates
   */
  getCertificatesByUser: async (userId) => {
    try {
      const response = await api.get(`/certificates/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  },
};

export default certificateService;
