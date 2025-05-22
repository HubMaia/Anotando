import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Historico.css';

const Historico = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({
    dataInicio: '',
    dataFim: ''
  });

  // Carregar registros ao montar o componente
  useEffect(() => {
    carregarRegistros();
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
        '❌Erro ao carregar registros'
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

  const getStatusGlicemia = (valor) => {
    if (valor < 70) return 'baixo';
    if (valor > 180) return 'alto';
    return 'normal';
  };

  return (
    <div className="historico-container">
      <h3>Histórico de Registros</h3>
      
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
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
                <th>período</th>
                <th>Data</th>
                <th>Glicemia (mg/dL)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(registro => (
                <tr key={registro.id}>
                  <td>{registro.horario}</td>
                  <td>{formatarData(registro.data)}</td>
                  <td className={`valor-glicemia ${getStatusGlicemia(registro.valor_glicemia)}`}>
                    {registro.valor_glicemia} mg/dL
                  </td>
                  <td>
                    <button 
                      className="excluir-button"
                      onClick={() => excluirRegistro(registro.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Historico; 