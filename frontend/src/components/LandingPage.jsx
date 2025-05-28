import React from 'react';
import './LandingPage.css';
import logo from '../assets/images/ANOTANDO-LOGO.png';
import illustration from '../assets/images/LANDINGPAGE-GIRL.png';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={logo} alt="qiplanta logo" className="landing-logo" />
        <span className="landing-brand">qiplanta</span>
      </header>
      <main className="landing-main">
        <section className="landing-info">
          <h1 className="landing-title">Anotando</h1>
          <p className="landing-subtitle">Te ajudando no controle</p>
          <button className="landing-btn">EXPERIMENTE</button>
        </section>
        <section className="landing-illustration">
          <img src={illustration} alt="Ilustração anotando" />
        </section>
      </main>
    </div>
  );
};

export default LandingPage; 