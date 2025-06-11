const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`
  },
  REGISTROS: {
    BASE: `${API_URL}/api/registros`,
    PERIODO: (inicio, fim) => `${API_URL}/api/registros/periodo/${inicio}/${fim}`
  }
}; 