import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

//Шапка сайта
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <span to="/" className="logo">
          <span>KBGames</span>
        </span>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link">Главная</Link>
          <a href="#" className="nav-link">Все Игры</a>
          <Link to="/results" className="nav-link">Ваши результаты</Link>
        </nav>

        <div className="actions">
          <button className="btn-login">Войти</button>
        </div>
      </div>
    </header>
  );
};

export default Header;