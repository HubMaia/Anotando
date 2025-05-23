import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import RegistroForm from './components/RegistroForm';
import Historico from './components/Historico';
import UserProfile from './components/UserProfile';
import logo from './assets/images/ANOTANDO-LOGO.png';
import './App.css';

// Componente para a página de registro de usuário
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    
    // Validações básicas
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não conferem');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });
      
      setSuccess('Conta criada com sucesso! Você já pode fazer login.');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
      });
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Criar Conta</h2>
        <h3>Anotando - Controle de Glicemia</h3>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Seu nome"
            />
          </div>
          
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
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              placeholder="Confirme sua senha"
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="register-submit-button"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>
        
        <div className="login-link">
          <p>Já tem uma conta?</p>
          <a href="/login">Fazer login</a>
        </div>
      </div>
    </div>
  );
};

// Componente para a página de dashboard
const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [registrosAtualizados, setRegistrosAtualizados] = useState(false);
  
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };
  
  const handleRegistroAdded = () => {
    setRegistrosAtualizados(!registrosAtualizados);
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="app-title">
          <img src={logo} alt="Anotando Logo" className="app-logo" />
        </div>
        
        {user && (
          <div className="user-info">
            <span>Olá, {user.nome}</span>
            <Link to="/profile" className="profile-link">Meu Perfil</Link>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        )}
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="form-section">
            <RegistroForm onRegistroAdded={handleRegistroAdded} />
          </div>
          
          <div className="historico-section">
            <Historico key={registrosAtualizados} />
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente principal
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <RegisterPage />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard 
              isAuthenticated={isAuthenticated} 
              setIsAuthenticated={setIsAuthenticated} 
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? (
              <UserProfile setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

export default App; 