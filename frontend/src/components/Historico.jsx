import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
        '/api/registros',
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
        `/api/registros/periodo/${filtro.dataInicio}/${filtro.dataFim}`,
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
        `/api/registros/${id}`,
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
    if (!horario) return null;
    
    if (horario.includes('Cafe-Tarde')) {
      return cafeTardeImage;
    } else if (horario.includes('Cafe')) {
      return cafeImage;
    } else if (horario.includes('Almoco')) {
      return almocoImage;
    } else if (horario.includes('Janta')) {
      return jantaImage;
    } else {
      // Se não for nenhum dos horários padrão, é um horário personalizado
      return novoImage;
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
        `/api/registros/${horario}`,
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
      
      <div className="meal-carousel">
        <img 
          src={cafeJejumImage} 
          alt="Café da Manhã (Jejum)" 
          className={`meal-image ${filtro.horario === 'Cafe - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe - Antes')}
        />
        <img 
          src={cafeImage} 
          alt="Café da Manhã" 
          className={`meal-image ${filtro.horario === 'Cafe - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe - Depois')}
        />
        <img 
          src={almocoJejumImage} 
          alt="Almoço (Jejum)" 
          className={`meal-image ${filtro.horario === 'Almoco - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Almoco - Antes')}
        />
        <img 
          src={almocoImage} 
          alt="Almoço" 
          className={`meal-image ${filtro.horario === 'Almoco - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Almoco - Depois')}
        />
        <img 
          src={cafeTardeJejumImage} 
          alt="Café da Tarde (Jejum)" 
          className={`meal-image ${filtro.horario === 'Cafe-Tarde - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe-Tarde - Antes')}
        />
        <img 
          src={cafeTardeImage} 
          alt="Café da Tarde" 
          className={`meal-image ${filtro.horario === 'Cafe-Tarde - Depois' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Cafe-Tarde - Depois')}
        />
        <img 
          src={jantaJejumImage} 
          alt="Janta (Jejum)" 
          className={`meal-image ${filtro.horario === 'Janta - Antes' ? 'selected' : ''}`}
          onClick={() => handleImageClick('Janta - Antes')}
        />
        <img 
          src={jantaImage} 
          alt="Janta" 
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