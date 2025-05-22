import React, { useEffect, useState } from 'react';
import './RelatoriosGerados.css';

const getRelatorios = () => {
  const data = localStorage.getItem('relatoriosGerados');
  if (!data) return [];
  return JSON.parse(data);
};

const RelatoriosGerados = () => {
  const [relatorios, setRelatorios] = useState([]);

  useEffect(() => {
    setRelatorios(getRelatorios());
  }, []);

  const handleVisualizar = (relatorio) => {
    const blob = new Blob([Uint8Array.from(relatorio.pdf)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownload = (relatorio) => {
    const blob = new Blob([Uint8Array.from(relatorio.pdf)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = relatorio.nome;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relatorios-gerados-container">
      <h2>Relatórios Gerados</h2>
      {relatorios.length === 0 ? (
        <div className="no-relatorios">Nenhum relatório gerado ainda.</div>
      ) : (
        <table className="relatorios-tabela">
          <thead>
            <tr>
              <th>Nome do Relatório</th>
              <th>Data de Geração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {relatorios.map((rel, idx) => (
              <tr key={idx}>
                <td>{rel.nome}</td>
                <td>{new Date(rel.data).toLocaleString('pt-BR')}</td>
                <td>
                  <button onClick={() => handleVisualizar(rel)} className="relatorio-btn">Visualizar</button>
                  <button onClick={() => handleDownload(rel)} className="relatorio-btn">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RelatoriosGerados;
