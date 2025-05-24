import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/ANOTANDO-LOGO.png';
import './styles.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="app-title">
        <img src={logo} alt="Anotando Logo" className="app-logo" />
      </div>
      
      {user && (
        <div className="user-info">
          <span>Olá, {user.nome}</span>
          <Link to="/profile" className="profile-link">Meu Perfil</Link>
          <button onClick={onLogout} className="logout-button">
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default Header; 