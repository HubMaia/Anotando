import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import novoRegistroImage from '../assets/images/NOVOREGISTRO-IMAGE.png';
import cafeManhaImage from '../assets/images/CAFE-DA-MANHA.png';
import cafeManhaJejumImage from '../assets/images/CAFE-DA-MANHA-JEJUM.png';
import almocoImage from '../assets/images/ALMOÇO.png';
import almocoJejumImage from '../assets/images/ALMOÇO-JEJUM.png';
import cafeTardeImage from '../assets/images/CAFE-DA-TARDE.png';
import cafeTardeJejumImage from '../assets/images/CAFE-DA-TARDE-JEJUM.png';
import jantaImage from '../assets/images/JANTA.png';
import jantaJejumImage from '../assets/images/JANTA-JEJUM.png';
import novoImage from '../assets/images/NOVO.png';
import './RegistroForm.css';

const RegistroForm = ({ onRegistroAdded }) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0], // Data atual como padrão
    horario: '',
    valor_glicemia: '',
    descricao_refeicao: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [glicemiaWarning, setGlicemiaWarning] = useState('');
  const [isCustomHorario, setIsCustomHorario] = useState(false);
  const [customHorarioText, setCustomHorarioText] = useState('');
  const [customHorarioTipo, setCustomHorarioTipo] = useState('');
  const dropdownRef = useRef(null);

  const horarios = [
    { value: 'Cafe - Antes', label: 'Antes do Café (Em jejum)', icon: cafeManhaJejumImage },
    { value: 'Cafe - Depois', label: 'Depois do Café (Após comer)', icon: cafeManhaImage },
    { value: 'Almoco - Antes', label: 'Antes do Almoço (Em jejum)', icon: almocoJejumImage },
    { value: 'Almoco - Depois', label: 'Depois do Almoço (Após comer)', icon: almocoImage },
    { value: 'Cafe-Tarde - Antes', label: 'Antes do Café da Tarde (Em jejum)', icon: cafeTardeJejumImage },
    { value: 'Cafe-Tarde - Depois', label: 'Depois do Café da Tarde (Após comer)', icon: cafeTardeImage },
    { value: 'Janta - Antes', label: 'Antes da Janta (Em jejum)', icon: jantaJejumImage },
    { value: 'Janta - Depois', label: 'Depois da Janta (Após comer)', icon: jantaImage },
    { value: 'custom', label: 'Horário Personalizado', icon: novoImage }
  ];

  const tiposHorario = [
    { value: 'Antes', label: 'Antes (Em jejum)' },
    { value: 'Depois', label: 'Depois (Após comer)' }
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
    const { name, value } = e.target;
    
    if (name === 'data') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (selectedDate > today) {
        toast.error('Não é possível registrar glicemia para datas futuras');
        return;
      }
    }
    
    if (name === 'valor_glicemia') {
      const valor = parseInt(value);
      if (valor > 600) {
        toast.error('O valor glicêmico não pode ser maior que 600 mg/dL');
        return;
      }
      if (valor >= 300) {
        toast.warning('Atenção: Valor glicêmico muito alto. Recomendamos procurar ajuda médica.');
      } else {
        setGlicemiaWarning('');
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
  };

  const handleHorarioSelect = (horario) => {
    if (horario.value === 'custom') {
      setIsCustomHorario(true);
      setFormData({
        ...formData,
        horario: ''
      });
    } else {
      setIsCustomHorario(false);
      setFormData({
        ...formData,
        horario: horario.value
      });
    }
    setIsDropdownOpen(false);
    setError('');
    setSuccess('');
  };

  const handleCustomHorarioChange = (e) => {
    const { value } = e.target;
    setCustomHorarioText(value);
    if (customHorarioTipo) {
      setFormData({
        ...formData,
        horario: `${value} - ${customHorarioTipo}`
      });
    }
  };

  const handleCustomHorarioTipoChange = (e) => {
    const { value } = e.target;
    setCustomHorarioTipo(value);
    if (customHorarioText) {
      setFormData({
        ...formData,
        horario: `${customHorarioText} - ${value}`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.data || !formData.horario || !formData.valor_glicemia) {
      toast.error('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Usuário não autenticado');
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

      toast.success('Registro salvo com sucesso!');
      
      // Limpar o formulário, mas manter a data atual
      setFormData({
        data: formData.data,
        horario: '',
        valor_glicemia: '',
        descricao_refeicao: ''
      });
      
      // Notificar o componente pai (para atualizar a lista de registros)
      if (onRegistroAdded) {
        onRegistroAdded();
      }
    } catch (error) {
      toast.error(
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
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="horario">Horário</label>
          {isCustomHorario ? (
            <div className="custom-horario-input">
              <input
                type="text"
                id="horario"
                name="horario"
                value={customHorarioText}
                onChange={handleCustomHorarioChange}
                placeholder="Digite seu horário personalizado"
                maxLength={50}
                required
              />
              <select
                value={customHorarioTipo}
                onChange={handleCustomHorarioTipoChange}
                className="horario-tipo-select"
                required
              >
                <option value="">Selecione</option>
                {tiposHorario.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setIsCustomHorario(false);
                  setCustomHorarioText('');
                  setCustomHorarioTipo('');
                  setFormData({
                    ...formData,
                    horario: ''
                  });
                }}
              >
                Voltar
              </button>
            </div>
          ) : (
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
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="valor_glicemia">Em quanto está sua glicemia? (mg/dL)</label>
          <input
            type="number"
            id="valor_glicemia"
            name="valor_glicemia"
            value={formData.valor_glicemia}
            onChange={handleChange}
            min="0"
            max="600"
            required
            placeholder="Ex: 120"
          />
          {glicemiaWarning && (
            <div className="warning-message">
              {glicemiaWarning}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao_refeicao">
            {(formData.horario.includes('Antes') || customHorarioTipo === 'Antes')
              ? 'Você está em jejum, não é possível anotar refeição'
              : 'Quer anotar o que comeu?'}
          </label>
          <textarea
            id="descricao_refeicao"
            name="descricao_refeicao"
            value={formData.descricao_refeicao}
            onChange={handleChange}
            placeholder={(formData.horario.includes('Antes') || customHorarioTipo === 'Antes')
              ? 'Ooops!'
              : 'Escreva aqui sua refeição'}
            rows="3"
            disabled={formData.horario.includes('Antes') || customHorarioTipo === 'Antes'}
            className={(formData.horario.includes('Antes') || customHorarioTipo === 'Antes') ? 'disabled-textarea' : ''}
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