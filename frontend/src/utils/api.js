const BASE_URL = 'http://localhost:8000/api';

const api = {
    async makeRequest(endpoint, options = {}) {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
          };
      
          console.log(`Request URL: ${BASE_URL}${endpoint}`);
          console.log('Request Options:', { ...options, headers });
      
          const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
      
          const data = await response.json();
          console.log('Response Data:', data);
      
          if (!response.ok) {
            throw new Error(data.message || 'Request failed');
          }
      
          return data;
        } catch (error) {
          console.error('API Request failed:', error);
          throw error;
        }
      }
      ,

  get(endpoint) {
    return this.makeRequest(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return this.makeRequest(endpoint, { method: 'POST', body: JSON.stringify(data) });
  },
};

export default api;
