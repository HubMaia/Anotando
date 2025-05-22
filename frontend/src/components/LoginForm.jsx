import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    idade: '',
    diagnostico: '',
    nome_medico: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [messageType, setMessageType] = useState('error');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessageType('error');

    try {
      if (isRegister) {
        // Cadastro
        const { nome, email, senha, idade, diagnostico, nome_medico } = formData;
        if (!nome || !email || !senha || !idade) {
          setError('Preencha todos os campos obrigatórios.');
          setMessageType('error');
          setLoading(false);
          return;
        }
        await axios.post('http://localhost:5000/api/auth/register', {
          nome,
          email,
          senha,
          idade,
          diagnostico,
          nome_medico
        });
        setIsRegister(false);
        setError('Cadastro realizado com sucesso! Faça login.');
        setMessageType('success');
        setFormData({
          email: '', senha: '', nome: '', idade: '', diagnostico: '', nome_medico: ''
        });
        setLoading(false);
        return;
      } else {
        // Login
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          senha: formData.senha
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        (isRegister ? 'Erro ao cadastrar. Verifique os dados.' : 'Erro ao fazer login. Verifique suas credenciais.')
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? 'Cadastro' : 'Login'}</h2>
        <h3>Anotando - Controle de Glicemia</h3>
        
        {error && <div className={messageType === 'success' ? 'success-message' : 'error-message'}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label htmlFor="nome">Nome completo <span style={{color:'#e74c3c'}}>*</span></label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required={isRegister}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="idade">Idade <span style={{color:'#e74c3c'}}>*</span></label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  required={isRegister}
                  placeholder="Sua idade"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="diagnostico">Diagnóstico (opcional)</label>
                <input
                  type="text"
                  id="diagnostico"
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  placeholder="Ex: Diabetes Tipo 1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nome_medico">Nome do médico (opcional)</label>
                <input
                  type="text"
                  id="nome_medico"
                  name="nome_medico"
                  value={formData.nome_medico}
                  onChange={handleChange}
                  placeholder="Nome do seu médico"
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
          
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (isRegister ? 'Cadastrando...' : 'Entrando...') : (isRegister ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>
        
        <div className="register-link">
          {isRegister ? (
            <>
              <p>Já tem uma conta?</p>
              <button 
                className="register-button" 
                onClick={() => { setIsRegister(false); setError(''); }}
              >
                Fazer login
              </button>
            </>
          ) : (
            <>
              <p>Não tem uma conta?</p>
              <button 
                className="register-button" 
                onClick={() => { setIsRegister(true); setError(''); }}
              >
                Cadastre-se
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 