// User Service - API calls for user-related operations
import api from './api';

const userService = {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} - User data with token
   */
  loginUser: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User full name
   * @param {string} userData.role - User role (STUDENT/INSTRUCTOR/ADMIN)
   * @returns {Promise} - Registered user data
   */
  registerUser: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} - User data
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Get all users
   * @returns {Promise} - List of all users
   */
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Updated user data
   */
  updateUser: async (userId, userData) => {
    try {
      console.log('Updating user:', userId, userData);
      const response = await api.put(`/users/${userId}`, userData);
      console.log('Update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error details:', {
        message: error.message,
        userId,
        endpoint: `/users/${userId}`
      });
      throw error;
    }
  },
};

export default userService;
