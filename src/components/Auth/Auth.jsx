import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clearFields = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleAction = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('kb_users') || '[]');

    if (isRegistering) {
      if (users.find(u => u.username === username)) {
        setError('Пользователь с таким логином уже существует');
        return;
      }
      users.push({ username, password });
      localStorage.setItem('kb_users', JSON.stringify(users));
      
      alert('Регистрация успешна! Теперь войдите.');
      
      clearFields();
      setIsRegistering(false);
    } else {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        sessionStorage.setItem('current_user', username);
        clearFields();
        onLoginSuccess(username);
      } else {
        setError('Неверный логин или пароль');
        setPassword(''); 
      }
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    clearFields();
  };

  return (
    <div className="auth-container">
      <form 
        key={isRegistering ? 'reg' : 'login'} 
        className="auth-form" 
        onSubmit={handleAction}
      >
        <h2>{isRegistering ? 'Регистрация' : 'Вход в систему'}</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <input 
          type="text" 
          placeholder="Логин" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          autoComplete="off"
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="btn-main">
          {isRegistering ? 'Создать аккаунт' : 'Войти'}
        </button>

        <p onClick={toggleAuthMode} className="toggle-auth">
          {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </p>
      </form>
    </div>
  );
};

export default Auth;