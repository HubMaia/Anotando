import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RegistroForm from './components/RegistroForm';
import Historico from './components/Historico';
import UserProfile from './components/UserProfile';
import Header from './components/header';
import Footer from './components/Footer';
import logo from './assets/images/ANOTANDO-LOGO.png';
import LandingPage from './components/LandingPage';
import './App.css';

// Componente para a página de dashboard
const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [registrosAtualizados, setRegistrosAtualizados] = useState(false);
  
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };
  
  const handleRegistroAdded = () => {
    setRegistrosAtualizados(!registrosAtualizados);
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="form-section">
            <RegistroForm onRegistroAdded={handleRegistroAdded} />
          </div>
          
          <div className="historico-section">
            <Historico key={registrosAtualizados} />
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente principal
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <Router>
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <RegisterForm setIsAuthenticated={setIsAuthenticated} />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                isAuthenticated={isAuthenticated} 
                setIsAuthenticated={setIsAuthenticated} 
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? (
                <UserProfile setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App; 