import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginHeader from './header/LoginHeader';
import './LoginForm.css';

const LoginForm = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        senha: formData.senha
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LoginHeader />
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <h3>Anotando - Controle de Glicemia</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="form-group full-width">
                <label htmlFor="email">Email <span style={{ color: '#e74c3c' }}>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Seu email"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="senha">Senha <span style={{ color: '#e74c3c' }}>*</span></label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  placeholder="Sua senha"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-button full-width"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="register-link">
            <p>Não tem uma conta?</p>
            <button
              className="register-button"
              onClick={() => navigate('/register')}
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 