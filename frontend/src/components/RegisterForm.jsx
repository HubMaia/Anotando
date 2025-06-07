import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginForm.css';

const RegisterForm = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    idade: '',
    diagnostico: '',
    nome_medico: ''
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
      // Validações para registro
      if (formData.senha !== formData.confirmarSenha) {
        toast.error('As senhas não coincidem');
        setLoading(false);
        return;
      }

      if (formData.senha.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/auth/register', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        idade: parseInt(formData.idade),
        diagnostico: formData.diagnostico || null,
        nome_medico: formData.nome_medico || null
      });

      if (response.data.userId) {
        toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        'Erro ao cadastrar. Verifique os dados.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Cadastro</h2>
        <h3>Anotando - Controle de Glicemia</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo <span style={{color:'#e74c3c'}}>*</span></label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
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
              required
              placeholder="Sua idade"
              min="0"
              max="200"
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
          <div className="form-group">
            <label htmlFor="email">Email <span style={{color:'#e74c3c'}}>*</span></label>
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
            <label htmlFor="senha">Senha <span style={{color:'#e74c3c'}}>*</span></label>
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
          
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirme sua senha <span style={{color:'#e74c3c'}}>*</span></label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              placeholder="Confirme sua senha"
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="register-link">
          <p>Já tem uma conta?</p>
          <button 
            className="register-button" 
            onClick={() => navigate('/login')}
          >
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 