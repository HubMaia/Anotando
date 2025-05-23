import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cafeImage from '../assets/images/CAFE-DA-MANHA.png';
import cafeTardeImage from '../assets/images/CAFE-DA-TARDE.png';
import almocoImage from '../assets/images/ALMOÇO.png';
import jantaImage from '../assets/images/JANTA.png';
import './Historico.css';

const Historico = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({
    dataInicio: '',
    dataFim: ''
  });
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Carregar registros ao montar o componente
  useEffect(() => {
    carregarRegistros();
    // Remove a classe de animação após 1 segundo
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const carregarRegistros = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        'http://localhost:5000/api/registros',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRegistros(response.data.registros);
      setError('');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao carregar registros'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value
    });
  };

  const aplicarFiltro = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      // Se não tiver datas de filtro, carrega todos os registros
      if (!filtro.dataInicio || !filtro.dataFim) {
        await carregarRegistros();
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/registros/periodo/${filtro.dataInicio}/${filtro.dataFim}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRegistros(response.data.registros);
      setError('');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao filtrar registros'
      );
    } finally {
      setLoading(false);
    }
  };

  const excluirRegistro = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }
      
      await axios.delete(
        `http://localhost:5000/api/registros/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Atualizar a lista após exclusão
      carregarRegistros();
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Erro ao excluir registro'
      );
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusGlicemia = (valor, horario) => {
    // Verifica se é uma medição em jejum (Antes)
    const isJejum = horario.includes('Antes');
    
    if (valor < 70) return 'hipoglicemia';
    
    if (isJejum) {
      // Critérios para medição em jejum
      if (valor >= 70 && valor <= 99) return 'normal';
      if (valor >= 100 && valor <= 125) return 'pre-diabetes';
      return 'diabetes';
    } else {
      // Critérios para medição pós-refeição
      if (valor < 200) return 'normal';
      return 'diabetes';
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
  };

  const closeModal = () => {
    setSelectedDescription(null);
  };

  const getMealImage = (horario) => {
    if (horario.includes('Cafe-Tarde')) {
      return cafeTardeImage;
    } else if (horario.includes('Cafe')) {
      return cafeImage;
    } else if (horario.includes('Almoco')) {
      return almocoImage;
    } else if (horario.includes('Janta')) {
      return jantaImage;
    }
    return null;
  };

  return (
    <div className="historico-container">
      <h3>Histórico de Registros</h3>
      
      <div className={`meal-carousel ${isInitialLoad ? 'initial-load' : ''}`}>
        <img src={cafeImage} alt="Café da Manhã" className="meal-image" />
        <img src={almocoImage} alt="Almoço" className="meal-image" />
        <img src={cafeTardeImage} alt="Café da Tarde" className="meal-image" />
        <img src={jantaImage} alt="Janta" className="meal-image" />
      </div>
      
      <div className="filtro-container">
        <form onSubmit={aplicarFiltro}>
          <div className="filtro-campos">
            <div className="form-group">
              <label htmlFor="dataInicio">Data inicial</label>
              <input
                type="date"
                id="dataInicio"
                name="dataInicio"
                value={filtro.dataInicio}
                onChange={handleFiltroChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dataFim">Data final</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={filtro.dataFim}
                onChange={handleFiltroChange}
              />
            </div>
            
            <button type="submit" className="filtro-button">
              Filtrar
            </button>
            
            <button 
              type="button" 
              className="limpar-button"
              onClick={() => {
                setFiltro({ dataInicio: '', dataFim: '' });
                carregarRegistros();
              }}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-message">Carregando registros...</div>
      ) : registros.length === 0 ? (
        <div className="no-data-message">Nenhum registro encontrado</div>
      ) : (
        <div className="tabela-container">
          <table className="registros-tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Glicemia (mg/dL)</th>
                <th>Descrição da Refeição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(registro => (
                <tr key={registro.id}>
                  <td>{formatarData(registro.data)}</td>
                  <td>{registro.horario}</td>
                  <td className={`valor-glicemia ${getStatusGlicemia(registro.valor_glicemia, registro.horario)}`}>
                    {registro.valor_glicemia}
                  </td>
                  <td className="description-cell">
                    {registro.descricao_refeicao ? (
                      <span 
                        className="description-content"
                        onClick={() => handleDescriptionClick(registro.descricao_refeicao)}
                      >
                        {truncateText(registro.descricao_refeicao)}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <button 
                      className="excluir-button"
                      onClick={() => excluirRegistro(registro.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedDescription && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-image-container">
              <img 
                src={getMealImage(registros.find(r => r.descricao_refeicao === selectedDescription)?.horario)} 
                alt="Ícone da refeição" 
                className="modal-icon"
              />
            </div>
            <div className="modal-title">
              <h4>Nessa hora eu comi...</h4>
            </div>
            <div className="modal-body">
              {selectedDescription}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historico; 