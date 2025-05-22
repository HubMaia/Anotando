import React from 'react';
import './Homepage.css';

const Homepage = () => (
  <div className="homepage-container">
    <header className="homepage-header">
      <h1>Anotando</h1>
      <h2>Controle Inteligente de Glicemia</h2>
      <p className="homepage-desc">
        O Anotando é um sistema gratuito para monitoramento, registro e análise de glicemia, feito para facilitar a vida de quem convive com diabetes.
      </p>
      <a href="/login" className="homepage-login-btn">Entrar</a>
      <a href="/register" className="homepage-register-btn">Criar Conta</a>
    </header>
    <main className="homepage-main">
      <section className="homepage-about">
        <h3>Sobre o Projeto</h3>
        <p>
          O Anotando foi criado para ajudar pessoas com diabetes a registrar, acompanhar e entender melhor seus níveis de glicemia ao longo do tempo. Com gráficos, relatórios e lembretes, você tem mais autonomia e segurança no seu tratamento.
        </p>
      </section>
      <section className="homepage-blog">
        <h3>Blog: Dicas para Viver Bem com Diabetes</h3>
        <article>
          <h4>Como o registro diário pode salvar sua saúde</h4>
          <p>Registrar sua glicemia diariamente ajuda a identificar padrões, evitar crises e compartilhar informações precisas com seu médico.</p>
        </article>
        <article>
          <h4>Alimentação: o que observar?</h4>
          <p>Manter uma alimentação equilibrada e registrar refeições no Anotando pode ajudar a entender como cada alimento afeta sua glicemia.</p>
        </article>
        <article>
          <h4>Exercícios e Diabetes</h4>
          <p>Atividades físicas regulares ajudam no controle glicêmico. Use o Anotando para acompanhar como o exercício impacta seus resultados.</p>
        </article>
      </section>
    </main>
    <footer className="homepage-footer">
      <p>&copy; {new Date().getFullYear()} Anotando - Controle de Glicemia</p>
    </footer>
  </div>
);

export default Homepage;
