import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/ANOTANDO-LOGO.png';
import './styles.css';

const LoginHeader = ({ buttonText = 'Criar conta', buttonLink = '/register' }) => {
  return (
    <header className="login-header">
      <div className="header-left">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Anotando Logo" className="app-logo" />
        </Link>
      </div>
      <div className="header-right">
        <Link to={buttonLink} className="register-link">
          {buttonText}
        </Link>
      </div>
    </header>
  );
};

export default LoginHeader; 