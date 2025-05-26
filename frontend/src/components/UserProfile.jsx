import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import './UserProfile.css';

const UserProfile = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    idade: '',
    diagnostico: '',
    nome_medico: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.user);
      setFormData({
        nome: response.data.user.nome,
        email: response.data.user.email,
        idade: response.data.user.idade,
        diagnostico: response.data.user.diagnostico || '',
        nome_medico: response.data.user.nome_medico || ''
      });
    } catch (error) {
      setError('Erro ao carregar dados do usuário');
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      // Validar idade
      const idade = parseInt(formData.idade, 10);
      if (isNaN(idade) || idade < 0 || idade > 200) {
        setError('Por favor, insira uma idade válida entre 0 e 200 anos');
        setLoading(false);
        return;
      }

      // Converter idade para número
      const dadosAtualizados = {
        ...formData,
        idade
      };

      await axios.put('http://localhost:5000/api/auth/update', dadosAtualizados, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Dados atualizados com sucesso!');
      setIsEditing(false);
      carregarDadosUsuario();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      console.log('Enviando requisição para excluir conta...');
      const response = await axios.delete('http://localhost:5000/api/auth/delete', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta do servidor:', response.data);

      // Limpar dados locais e redirecionar para login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Erro detalhado:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Erro ao excluir conta'
      );
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (!user) {
    return <div className="loading-message">Carregando dados do usuário...</div>;
  }

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="dashboard-content">
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h3>Perfil do Usuário</h3>
        <p>Gerencie suas informações pessoais</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!isEditing ? (
        <>
          <div className="user-info-section">
            <h4>Informações Pessoais</h4>
            <div className="user-info-grid">
              <div className="info-item">
                <span className="info-label">Nome</span>
                <span className="info-value">{user.nome}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Idade</span>
                <span className="info-value">{user.idade} anos</span>
              </div>
            </div>
          </div>

          <div className="user-info-section">
            <h4>Informações Médicas</h4>
            <div className="user-info-grid">
              <div className="info-item">
                <span className="info-label">Diagnóstico</span>
                <span className="info-value">{user.diagnostico || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Médico</span>
                <span className="info-value">{user.nome_medico || 'Não informado'}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Editar Informações
            </button>
            <button 
              className="delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              Excluir Conta
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="idade">Idade</label>
            <input
              type="number"
              id="idade"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
              required
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
            <label htmlFor="nome_medico">Nome do Médico (opcional)</label>
            <input
              type="text"
              id="nome_medico"
              name="nome_medico"
              value={formData.nome_medico}
              onChange={handleChange}
              placeholder="Nome do seu médico"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  nome: user.nome,
                  email: user.email,
                  idade: user.idade,
                  diagnostico: user.diagnostico || '',
                  nome_medico: user.nome_medico || ''
                });
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button 
                className="confirm-delete-button"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Excluindo...' : 'Excluir Conta'}
              </button>
              <button 
                className="cancel-delete-button"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile; 