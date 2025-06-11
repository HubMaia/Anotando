import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import cafeImage from '../assets/images/CAFE-DA-MANHA.png';
import cafeTardeImage from '../assets/images/CAFE-DA-TARDE.png';
import almocoImage from '../assets/images/ALMOÇO.png';
import jantaImage from '../assets/images/JANTA.png';
import novoImage from '../assets/images/NOVO.png';
import cafeJejumImage from '../assets/images/CAFE-DA-MANHA-JEJUM.png';
import almocoJejumImage from '../assets/images/ALMOÇO-JEJUM.png';
import cafeTardeJejumImage from '../assets/images/CAFE-DA-TARDE-JEJUM.png';
import jantaJejumImage from '../assets/images/JANTA-JEJUM.png';
import './Historico.css';
import { API_ENDPOINTS } from '../config';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Historico = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({
    dataInicio: '',
    dataFim: '',
    horario: ''
  });
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [showGraphs, setShowGraphs] = useState(false);

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
        API_ENDPOINTS.REGISTROS.BASE,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRegistros(response.data.registros);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
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
        API_ENDPOINTS.REGISTROS.PERIODO(filtro.dataInicio, filtro.dataFim),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRegistros(response.data.registros);
      setError('');
    } catch (error) {
      console.error('Erro ao filtrar registros:', error);
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
        `${API_ENDPOINTS.REGISTROS.BASE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Atualizar a lista após exclusão
      carregarRegistros();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
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

  const formatarHorario = (horario) => {
    if (!horario) return '';
    
    const [refeicao, tipo] = horario.split(' - ');
    
    if (refeicao === 'custom') return horario;
    
    const refeicaoFormatada = refeicao
      .replace('Cafe', 'Café')
      .replace('Almoco', 'Almoço')
      .replace('Cafe-Tarde', 'Café da Tarde');
    
    if (tipo === 'Antes') {
      return `Antes do ${refeicaoFormatada} (Em jejum)`;
    } else {
      return `Depois do ${refeicaoFormatada} (Após comer)`;
    }
  };

  const handleImageClick = (horario) => {
    setFiltro(prev => ({
      ...prev,
      horario: horario
    }));
    filtrarPorHorario(horario);
  };

  const filtrarPorHorario = async (horario) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        API_ENDPOINTS.REGISTROS.HORARIO(horario),
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

  const limparFiltroHorario = () => {
    setFiltro(prev => ({
      ...prev,
      horario: ''
    }));
    carregarRegistros();
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
  };

  const closeModal = () => {
    setSelectedDescription(null);
  };

  const getMealImage = (horario) => {
    if (!horario) return novoImage;
    
    const [refeicao] = horario.split(' - ');
    
    switch (refeicao) {
      case 'Cafe':
        return cafeImage;
      case 'Almoco':
        return almocoImage;
      case 'Cafe-Tarde':
        return cafeTardeImage;
      case 'Janta':
        return jantaImage;
      default:
        return novoImage;
    }
  };

  const truncateText = (text) => {
    if (!text) return '';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  const getStatusGlicemia = (valor, horario) => {
    if (!horario) return '';
    
    const [refeicao, tipo] = horario.split(' - ');
    
    if (tipo === 'Antes') {
      if (valor < 70) return 'hipoglicemia';
      if (valor >= 70 && valor <= 99) return 'normal';
      if (valor >= 100 && valor <= 125) return 'pre-diabetes';
      return 'diabetes';
    } else {
      if (valor < 70) return 'hipoglicemia';
      if (valor < 200) return 'normal';
      return 'diabetes';
    }
  };

  const gerarPDF = () => {
    // Obter dados do usuário do localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Criar novo documento PDF
    const doc = new jsPDF();
    
    // Adicionar título
    doc.setFontSize(20);
    doc.text('Histórico de Registros', 14, 22);
    
    // Adicionar informações do usuário
    doc.setFontSize(12);
    doc.text('Informações do Paciente:', 14, 35);
    doc.setFontSize(10);
    
    let yPosition = 42;
    doc.text(`Nome: ${userData.nome || '-'}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Idade: ${userData.idade || '-'} anos`, 14, yPosition);
    yPosition += 7;
    doc.text(`Diagnóstico: ${userData.diagnostico || '-'}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Médico: ${userData.nome_medico || '-'}`, 14, yPosition);
    
    // Adicionar data de geração
    yPosition += 10;
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Relatório gerado em: ${dataAtual}`, 14, yPosition);
    
    // Preparar dados para a tabela
    const dadosTabela = registros.map(registro => [
      formatarData(registro.data),
      formatarHorario(registro.horario),
      registro.valor_glicemia.toString(),
      registro.descricao_refeicao || '-'
    ]);
    
    // Configurar e gerar a tabela
    autoTable(doc, {
      head: [['Data', 'Horário', 'Glicemia (mg/dL)', 'Descrição da Refeição']],
      body: dadosTabela,
      startY: yPosition + 10,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [3, 197, 150], // Cor verde do tema
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Data
        1: { cellWidth: 40 }, // Horário
        2: { cellWidth: 30 }, // Glicemia
        3: { cellWidth: 'auto' }, // Descrição
      },
    });
    
    // Adicionar legenda de status
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(10);
    doc.text('Legenda de Status:', 14, finalY + 10);
    doc.setFontSize(8);
    doc.text('• Normal: 70-99 mg/dL (jejum) ou < 200 mg/dL (pós-refeição)', 14, finalY + 17);
    doc.text('• Pré-diabetes: 100-125 mg/dL (jejum)', 14, finalY + 24);
    doc.text('• Diabetes: > 125 mg/dL (jejum) ou > 200 mg/dL (pós-refeição)', 14, finalY + 31);
    doc.text('• Hipoglicemia: < 70 mg/dL', 14, finalY + 38);
    
    // Adicionar rodapé
    doc.setFontSize(8);
    doc.text('Este relatório foi gerado automaticamente pelo sistema Anotando.', 14, finalY + 50);
    
    // Salvar o PDF
    doc.save('historico_registros.pdf');
  };

  const prepareChartData = () => {
    // Ordenar registros por data e horário
    const sortedRegistros = [...registros].sort((a, b) => {
      const dateA = new Date(a.data + 'T' + a.horario);
      const dateB = new Date(b.data + 'T' + b.horario);
      return dateA - dateB;
    });

    const labels = sortedRegistros.map(registro => 
      `${formatarData(registro.data)} ${formatarHorario(registro.horario)}`
    );
    
    const glicemiaData = sortedRegistros.map(registro => registro.valor_glicemia);

    // Criar datasets para diferentes tipos de medição
    const datasets = [
      {
        label: 'Glicemia (mg/dL)',
        data: glicemiaData,
        borderColor: '#03c596',
        backgroundColor: 'rgba(3, 197, 150, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ];

    return {
      labels,
      datasets,
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Histórico de Glicemia',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Glicemia (mg/dL)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Data e Horário',
        },
      },
    },
  };

  const prepareBarChartData = () => {
    // Agrupar registros por horário
    const horarios = {};
    registros.forEach(registro => {
      const horario = registro.horario;
      if (!horarios[horario]) {
        horarios[horario] = {
          total: 0,
          count: 0,
        };
      }
      horarios[horario].total += registro.valor_glicemia;
      horarios[horario].count += 1;
    });

    const labels = Object.keys(horarios).map(formatarHorario);
    const data = Object.values(horarios).map(h => h.total / h.count);

    return {
      labels,
      datasets: [
        {
          label: 'Média de Glicemia por Horário',
          data,
          backgroundColor: 'rgba(3, 197, 150, 0.6)',
          borderColor: '#03c596',
          borderWidth: 1,
        },
      ],
    };
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Média de Glicemia por Horário',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Glicemia (mg/dL)',
        },
      },
    },
  };

  return (
    <div className="historico-container">
      <div className="historico-header">
        <h3>Histórico de Registros</h3>
        <div className="header-buttons">
          {filtro.horario && (
            <button 
              className="limpar-filtro-button"
              onClick={limparFiltroHorario}
            >
              Limpar Filtro
            </button>
          )}
          <button 
            className="pdf-button"
            onClick={gerarPDF}
            disabled={loading || registros.length === 0}
          >
            Gerar PDF
          </button>
        </div>
      </div>
      
      {showGraphs && registros.length > 0 && (
        <div className="graphs-container">
          <div className="graph-wrapper">
            <Line data={prepareChartData()} options={chartOptions} />
          </div>
          <div className="graph-wrapper">
            <Bar data={prepareBarChartData()} options={barChartOptions} />
          </div>
        </div>
      )}
      
      <div className="meal-carousel">
        <img 
          src={cafeImage} 
          alt="Café da Manhã" 
          className={`meal-image ${filtro.horario === 'Cafe - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe - Antes')}
        />
        <img 
          src={cafeJejumImage} 
          alt="Café da Manhã (Jejum)" 
          className={`meal-image ${filtro.horario === 'Cafe - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe - Depois')}
        />
        <img 
          src={almocoImage} 
          alt="Almoço" 
          className={`meal-image ${filtro.horario === 'Almoco - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Almoco - Antes')}
        />
        <img 
          src={almocoJejumImage} 
          alt="Almoço (Jejum)" 
          className={`meal-image ${filtro.horario === 'Almoco - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Almoco - Depois')}
        />
        <img 
          src={cafeTardeImage} 
          alt="Café da Tarde" 
          className={`meal-image ${filtro.horario === 'Cafe-Tarde - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe-Tarde - Antes')}
        />
        <img 
          src={cafeTardeJejumImage} 
          alt="Café da Tarde (Jejum)" 
          className={`meal-image ${filtro.horario === 'Cafe-Tarde - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe-Tarde - Depois')}
        />
        <img 
          src={jantaImage} 
          alt="Janta" 
          className={`meal-image ${filtro.horario === 'Janta - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Janta - Antes')}
        />
        <img 
          src={jantaJejumImage} 
          alt="Janta (Jejum)" 
          className={`meal-image ${filtro.horario === 'Janta - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Janta - Depois')}
        />
        <img 
          src={novoImage} 
          alt="Horário Personalizado" 
          className={`meal-image ${filtro.horario === 'custom' ? 'selected' : ''}`}
          onClick={() => handleImageClick('custom')}
        />
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
            
            <div className="filtro-botoes">
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
                  <td>{formatarHorario(registro.horario)}</td>
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
                  <td className="acoes-cell">
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