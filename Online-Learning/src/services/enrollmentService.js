// Enrollment Service - API calls for enrollment-related operations
import api from './api';

const enrollmentService = {
  /**
   * Enroll a student in a course
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise} - Enrollment data
   */
  enrollStudent: async (userId, courseId) => {
    try {
      const response = await api.post(`/enrollments/${userId}/${courseId}`, {});
      return response;
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw error;
    }
  },

  /**
   * Unregister (unenroll) a student from a course
   * Tries common backend endpoint variants for compatibility.
   * @param {number} userId - User ID
   * @param {number} courseId - Course ID
   * @returns {Promise} - API response
   */
  unenrollStudent: async (userId, courseId) => {
    const endpoints = [
      `/enrollments/${userId}/${courseId}`,
      `/enrollments/user/${userId}/course/${courseId}`,
      `/enrollments/unenroll/${userId}/${courseId}`,
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const response = await api.delete(endpoint);
        return response;
      } catch (error) {
        lastError = error;

        // Continue trying other endpoint formats only for missing routes.
        if (!error.message?.includes('404')) {
          console.error('Error unenrolling student:', error);
          throw error;
        }
      }
    }

    console.error('Error unenrolling student:', lastError);
    throw lastError;
  },

  /**
   * Get enrollments by user
   * @param {number} userId - User ID
   * @returns {Promise} - List of user's enrollments
   */
  getEnrollmentsByUser: async (userId) => {
    try {
      const response = await api.get(`/enrollments/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  },
};

export default enrollmentService;
