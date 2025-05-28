import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/ANOTANDO-LOGO.png';
import './styles.css';

const Header = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Aqui você pode implementar a lógica de busca
      console.log('Buscando:', searchQuery);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <Link to="/dashboard" className="logo-container">
          <img src={logo} alt="Anotando Logo" className="app-logo" />
        </Link>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar registros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg viewBox="0 0 24 24" className="search-icon">
              <path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            </svg>
          </button>
        </form>
      </div>

      {user && (
        <div className="header-right">
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-menu-button" onClick={toggleDropdown}>
              <div className="user-avatar">
                {user.nome.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.nome}</span>
            </button>
            {isDropdownOpen && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                  <svg viewBox="0 0 24 24" className="dropdown-icon">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Meu Perfil
                </Link>
                <button onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }} className="dropdown-item">
                  <svg viewBox="0 0 24 24" className="dropdown-icon">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 