import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          KB<span className="accent">Games</span>
        </Link>
      </div>

      <nav className="header-nav">
        {user && (
          <>
            <Link to="/" className="nav-btn">Главное меню</Link>
            <Link to="/records" className="nav-btn">Ваши рекорды</Link>
          </>
        )}
      </nav>

      <div className="header-user-zone">
        {user ? (
          <div className="user-profile">
            <span className="user-name">Игрок: <strong>{user}</strong></span>
            <button onClick={handleLogoutClick} className="btn-logout">
              Выйти
            </button>
          </div>
        ) : (
          <span className="status-offline">Вход не выполнен</span>
        )}
      </div>
    </header>
  );
};

export default Header;