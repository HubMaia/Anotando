import React, { useState } from 'react';
import axios from 'axios';
import './RegistroForm.css';

const RegistroForm = ({ onRegistroAdded }) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0], // Data atual como padrão
    horario: '',
    valor_glicemia: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const horarios = [
    'Café - Antes',
    'Café - Depois',
    'Almoço - Antes',
    'Almoço - Depois',
    'Janta - Antes',
    'Janta - Depois'
  ];
  const emojis = [
    '🌥', '🌤',
    '☀️', '🌙',
    '🌛', '🌜'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.data || !formData.horario || !formData.valor_glicemia) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/registros',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('✔️ Registro salvo com sucesso!');
      
      // Limpar o formulário, mas manter a data atual
      setFormData({
        data: formData.data,
        horario: '',
        valor_glicemia: ''
      });
      
      // Notificar o componente pai (para atualizar a lista de registros)
      if (onRegistroAdded) {
        onRegistroAdded();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        '❌Erro ao salvar o registro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-form-container">
      <h3>Novo Registro</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="horario">Horário</label>
          <select
            id="horario"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
          >
        <option value="">Selecione o horário</option>
        {horarios.map((horario, idx) => (
        
        <option key={horario} value={horario}>
          {emojis[idx]} {horario}
        </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="valor_glicemia">Valor Glicêmico (mg/dL)</label>
          <input
            type="number"
            id="valor_glicemia"
            name="valor_glicemia"
            value={formData.valor_glicemia}
            onChange={handleChange}
            min="0"
            required
            placeholder="Ex: 120"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2-plus-fill" viewBox="0 0 16 16">
            <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
            <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M8.5 6.5V8H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V9H6a.5.5 0 0 1 0-1h1.5V6.5a.5.5 0 0 1 1 0"/>
          </svg>
          {loading ? 'Salvando...' : '  Salvar Registro'}
        </button>
      </form>
    </div>
  );
};

export default RegistroForm; 