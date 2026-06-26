// API Client Configuration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://44.198.174.193:8083/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      // Handle 204/205 and other empty successful responses.
      if (response.status === 204 || response.status === 205) {
        return null;
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return null;
      }

      const text = await response.text();
      if (!text) {
        return null;
      }

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();
