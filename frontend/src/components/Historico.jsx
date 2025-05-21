import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const getStatusGlicemia = (valor) => {
    if (valor < 70) return 'baixo';
    if (valor > 180) return 'alto';
    return 'normal';
  };

  const getMediaDiaria = () => {
    // Agrupa os registros por data e calcula a média de cada dia
    const medias = {};
    registros.forEach(registro => {
      const data = registro.data;
      if (!medias[data]) {
        medias[data] = { soma: 0, count: 0 };
      }
      medias[data].soma += registro.valor_glicemia;
      medias[data].count += 1;
    });
    // Retorna array de objetos { data, media }
    return Object.entries(medias).map(([data, { soma, count }]) => ({
      data,
      media: soma / count
    }));
  };

  // Função para calcular médias agrupadas por período
  const agruparMedias = (periodo) => {
    const grupos = {};
    registros.forEach(registro => {
      let chave;
      const dataObj = new Date(registro.data);
      if (periodo === 'mensal') {
        chave = `${dataObj.getFullYear()}-${String(dataObj.getMonth() + 1).padStart(2, '0')}`;
      } else if (periodo === 'semanal') {
        const ano = dataObj.getFullYear();
        const primeira = new Date(dataObj.getFullYear(), 0, 1);
        const dias = Math.floor((dataObj - primeira) / (24 * 60 * 60 * 1000));
        const semana = Math.ceil((dias + primeira.getDay() + 1) / 7);
        chave = `${ano}-S${semana}`;
      } else {
        chave = registro.data;
      }
      if (!grupos[chave]) grupos[chave] = { soma: 0, count: 0 };
      grupos[chave].soma += registro.valor_glicemia;
      grupos[chave].count += 1;
    });
    return Object.entries(grupos).map(([chave, { soma, count }]) => ({
      chave,
      media: soma / count
    }));
  };

  const gerarPDFPersonalizado = (periodo) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    let titulo = 'Relatório Diário da Média de Glicemia';
    if (periodo === 'mensal') titulo = 'Relatório Mensal da Média de Glicemia';
    if (periodo === 'semanal') titulo = 'Relatório Semanal da Média de Glicemia';
    doc.text(titulo, 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Gerado em: ${(new Date()).toLocaleDateString('pt-BR')}`, 14, 28);
    const medias = agruparMedias(periodo);
    const tableData = medias.map(({ chave, media }) => [
      periodo === 'diario' ? formatarData(chave) : chave,
      media.toFixed(2) + ' mg/dL'
    ]);
    autoTable(doc, {
      head: [[periodo === 'diario' ? 'Data' : (periodo === 'mensal' ? 'Mês' : 'Semana'), 'Média (mg/dL)']],
      body: tableData,
      startY: 35,
      styles: { halign: 'center', fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 250] },
      margin: { left: 14, right: 14 }
    });
    doc.save(`relatorio-media-glicemia-${periodo}.pdf`);
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
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button onClick={() => gerarPDFPersonalizado('diario')} className="filtro-button">
            PDF Média Diária
          </button>
          <button onClick={() => gerarPDFPersonalizado('semanal')} className="filtro-button" style={{ background: '#27ae60' }}>
            PDF Média Semanal
          </button>
          <button onClick={() => gerarPDFPersonalizado('mensal')} className="filtro-button" style={{ background: '#f39c12' }}>
            PDF Média Mensal
          </button>
        </div>
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
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(registro => (
                <tr key={registro.id}>
                  <td>{formatarData(registro.data)}</td>
                  <td>{registro.horario}</td>
                  <td className={`valor-glicemia ${getStatusGlicemia(registro.valor_glicemia)}`}>
                    {registro.valor_glicemia}
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
    </div>
  );
};

export default Historico;