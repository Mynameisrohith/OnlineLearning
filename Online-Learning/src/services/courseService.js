// Course Service - API calls for course-related operations
import api from './api';

const courseService = {
  /**
   * Get all courses with filters, pagination, and sorting
   * @param {Object} params - Filter parameters
   * @param {string} params.search - Search query
   * @param {string} params.category - Category filter
   * @param {string} params.level - Level filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {number} params.page - Page number (0-indexed for backend)
   * @param {number} params.size - Page size
   * @param {string} params.sort - Sort field (default: 'id')
   * @returns {Promise} - Paginated course data
   */
  getAllCourses: async (params = {}) => {
    try {
      const {
        search = '',
        category = '',
        level = '',
        maxPrice = null,
        page = 0,
        size = 6,
        sort = 'id'
      } = params;

      // Build query parameters
      const queryParams = {
        page,
        size,
        sort
      };

      if (search) queryParams.search = search;
      if (category) queryParams.category = category;
      if (level) queryParams.level = level;
      if (maxPrice !== null) queryParams.maxPrice = maxPrice;

      const response = await api.get('/courses', queryParams);
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Get a single course by ID
   * @param {number} id - Course ID
   * @returns {Promise} - Course data
   */
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      // Backend returns an array, so we take the first element
      return Array.isArray(response) && response.length > 0 ? response[0] : response;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @returns {Promise} - Created course
   */
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  /**
   * Update an existing course
   * @param {number} id - Course ID
   * @param {Object} courseData - Updated course data
   * @returns {Promise} - Updated course
   */
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return Array.isArray(response) && response.length > 0 ? response[0] : response;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a course
   * @param {number} id - Course ID
   * @returns {Promise} - Deleted course
   */
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }
};

export default courseService;
