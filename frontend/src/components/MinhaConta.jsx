import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MinhaConta.css';

const MinhaConta = () => {
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ email: '', senha: '', novaSenha: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const u = JSON.parse(userJson);
      setUser(u);
      setForm(f => ({ ...f, email: u.email }));
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/auth/atualizar',
        {
          email: form.email,
          senha: form.senha,
          novaSenha: form.novaSenha
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Dados atualizados com sucesso!');
      setEditando(false);
      // Atualiza localStorage
      setUser(u => ({ ...u, email: form.email }));
      localStorage.setItem('user', JSON.stringify({ ...user, email: form.email }));
      setForm(f => ({ ...f, senha: '', novaSenha: '' }));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erro ao atualizar dados. Verifique sua senha.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="minha-conta-page">
      <header className="dashboard-header">
        <div className="app-title">
          <h1>Anotando</h1>
          <p>Controle de Glicemia</p>
        </div>
        <nav className="navbar">
          <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
            ☰
          </button>
          <ul className={`navbar-menu${menuAberto ? ' open' : ''}`}>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/minha-conta">Minha conta</a></li>
            <li><button type="button" className="navbar-link-btn" onClick={handleLogout}>Sair</button></li>
          </ul>
        </nav>
      </header>
      <main className="minha-conta-main">
        <div className="minha-conta-loading">Carregando...</div>
      </main>
    </div>
  );

  return (
    <div className="minha-conta-page">
      <header className="dashboard-header">
        <div className="app-title">
          <h1>Anotando</h1>
          <p>Controle de Glicemia</p>
        </div>
        <nav className="navbar">
          <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
            ☰
          </button>
          <ul className={`navbar-menu${menuAberto ? ' open' : ''}`}>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/minha-conta">Minha conta</a></li>
            <li><button type="button" className="navbar-link-btn" onClick={handleLogout}>Sair</button></li>
          </ul>
        </nav>
        <div className="user-info">
          <span>Olá, {user.nome}</span>
        </div>
      </header>
      <main className="minha-conta-main">
        <h2 style={{marginTop: 24}}>Minha Conta</h2>
        <div className="minha-conta-card">
          <div><strong>Nome:</strong> {user.nome}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {!editando ? (
            <button className="editar-btn" onClick={() => setEditando(true)}>
              Editar Email/Senha
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="minha-conta-form">
              <div className="form-group">
                <label>Novo Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Senha Atual</label>
                <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nova Senha</label>
                <input type="password" name="novaSenha" value={form.novaSenha} onChange={handleChange} minLength={6} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="salvar-btn" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" className="cancelar-btn" onClick={() => { setEditando(false); setError(''); setSuccess(''); }}>
                  Cancelar
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhaConta;
