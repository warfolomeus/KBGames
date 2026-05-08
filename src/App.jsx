import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Header from './components/Header/Header';
import Auth from './components/Auth/Auth';
import RecordsPage from './pages/RecordsPage';

import VirusGame from './games/VirusGame/VirusGame';
import ServicesGame from './games/ServicesGame/ServicesGame';
import DomainGame from './games/DomainGame/DomainGame';
import SlangGame from './games/SlangGame/SlangGame';
import HangmanGame from './games/HangmanGame/HangmanGame';


import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('current_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (username) => setUser(username);
  
  const handleLogout = () => {
    sessionStorage.removeItem('current_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          {!user ? (
            <Auth onLoginSuccess={handleLogin} />
          ) : (
            <Routes>
              <Route path="/" element={
                <div className="main-menu">
                  <header className="menu-header">
                    <h1 className="welcome-title">Выберите учебный модуль, {user}</h1>
                  </header>
                  
                  <div className="game-grid">
                    <Link to="/virus" className="game-card">
                      <h3>Защити сеть от вирусов</h3>
                      <p>Необходимо предотвратить распространение вирусов по сети и вылечить все компьютеры.</p>
                    </Link>
                    
                    <Link to="/services" className="game-card">
                      <h3>Сетевые сервисы</h3>
                      <p>Собери популярные сетевые сервисы, используя базовые объекты.</p>
                    </Link>
                    
                    <Link to="/domain" className="game-card">
                      <h3>Составь доменное имя</h3>
                      <p>Составь доменное имя по описанию.</p>
                    </Link>

                    {/* КАРТОЧКА НОВОЙ ИГРЫ */}
                    <Link to="/slang" className="game-card highlight">
                      <h3>Сленг-кроссворд</h3>
                      <p>Найди ключевые термины информационной безопасности в сетке букв.</p>
                    </Link>
                    <Link to="/hangman" className="game-card">
                      <h3>Виселица</h3>
                      <p>Угадай секретное слово, пока не стало поздно</p>
                    </Link>
                  </div>
                </div>
              } />
              
              <Route path="/virus" element={<VirusGame />} />
              <Route path="/services" element={<ServicesGame />} />
              <Route path="/domain" element={<DomainGame />} />
              <Route path="/slang" element={<SlangGame />} />
              <Route path="/hangman" element={<HangmanGame />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </main>     
      </div>
    </Router>
  );
}

export default App;