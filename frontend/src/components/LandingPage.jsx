import React from 'react';
import './LandingPage.css';
import illustration from '../assets/images/LANDINGPAGE-GIRL.png';
import qiplantaLogo from '../assets/images/LOGO-QIPLANTA.png';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <span className="landing-brand">
          <img src={qiplantaLogo} alt="qiplanta logo" className="qiplanta-logo-inline" /> qiplanta
        </span>
      </header>
      <main className="landing-main">
        <section className="landing-info">
          <h1 className="landing-title">Anotando</h1>
          <p className="landing-subtitle">Te ajudando no controle</p>
          <button onClick={() => window.location.href = '/dashboard'} className="landing-btn">EXPERIMENTE</button>
        </section>
        <section className="landing-illustration">
          <img src={illustration} alt="Ilustração anotando" />
        </section>
      </main>
      <div className="landing-divider">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C480,120 960,0 1440,80 L1440,120 L0,120 Z" fill="#b6f0f7" />
        </svg>
      </div>
      <section className="landing-benefits">
        <div className="benefits-grid">
          <div className="benefit-card">
            <img src={require('../assets/images/SOFTWARECOMPLETO.png')} alt="Software completo" className="benefit-img" />
            <h2>Um sistema completo</h2>
            <p>Precisa ver o que comeu na noite passada? Quer gerar um PDF? Gera aê!</p>
          </div>
          <div className="benefit-card">
            <img src={require('../assets/images/NAOPAGUEPORISSO.png')} alt="Não pague por isso" className="benefit-img" />
            <h2>Totalmente gratuito para todos</h2>
            <p>Não queremos seu dinheiro! Nosso app é totalmente gratuito!</p>
          </div>
          <div className="benefit-card">
            <img src={require('../assets/images/TENHATUDOREGISTRADO.png')} alt="Tenha tudo registrado" className="benefit-img" />
            <h2>Tudo registrado pro seu controle</h2>
            <p>Um serviço detalhado de anotação para suas métricas, com gráficos e tabelas</p>
          </div>
        </div>
        <div className="benefits-cta">
          <Link to="/dashboard" className="landing-btn benefits-btn">EXPERIMENTE</Link>
          
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
