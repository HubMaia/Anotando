import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import novoRegistroImage from '../assets/images/NOVOREGISTRO-IMAGE.png';
import solImage from '../assets/images/SOL.png';
import luaImage from '../assets/images/LUA.png';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const horarios = [
    { value: 'Cafe - Antes', label: 'Café - Antes', icon: solImage },
    { value: 'Cafe - Depois', label: 'Café - Depois', icon: solImage },
    { value: 'Almoco - Antes', label: 'Almoço - Antes', icon: solImage },
    { value: 'Almoco - Depois', label: 'Almoço - Depois', icon: solImage },
    { value: 'Janta - Antes', label: 'Janta - Antes', icon: luaImage },
    { value: 'Janta - Depois', label: 'Janta - Depois', icon: luaImage }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleHorarioSelect = (horario) => {
    setFormData({
      ...formData,
      horario: horario.value
    });
    setIsDropdownOpen(false);
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

      setSuccess('Registro salvo com sucesso!');
      
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
        'Erro ao salvar o registro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedHorario = horarios.find(h => h.value === formData.horario);

  return (
    <div className="registro-form-container">
      <div className="registro-header">
        <img src={novoRegistroImage} alt="Novo Registro" className="novo-registro-image" />
        <h3>Novo Registro</h3>
      </div>
      
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
          <div className="custom-select" ref={dropdownRef}>
            <div 
              className="select-selected"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedHorario ? (
                <div className="selected-option">
                  <img src={selectedHorario.icon} alt="" className="time-icon" />
                  <span>{selectedHorario.label}</span>
                </div>
              ) : (
                'Selecione o horário'
              )}
            </div>
            {isDropdownOpen && (
              <div className="select-items">
                {horarios.map(horario => (
                  <div
                    key={horario.value}
                    className="select-item"
                    onClick={() => handleHorarioSelect(horario)}
                  >
                    <img src={horario.icon} alt="" className="time-icon" />
                    <span>{horario.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
};

export default RegistroForm; 