// Configuração da API baseada no ambiente
const getApiUrl = () => {
  // Em produção (quando servido pelo nginx), usa rotas relativas
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin; // Usa o mesmo domínio/porta
  }
  // Em desenvolvimento, usa localhost:3000
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const API_URL = getApiUrl();

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