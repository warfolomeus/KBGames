import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DomainGame.css';

const levels = [
  { id: 1, correct: ['https', '://', 'google', '.', 'com'], parts: ['.', 'https', 'google', '://', 'com'] },
  { id: 2, correct: ['https', '://', 'uniyar', '.', 'ac', '.', 'ru'], parts: ['ru', '.', 'ac', 'uniyar', 'https', '://', '.'] },
  { id: 3, correct: ['http', '://', '192.168.1.1', ':', '8080'], parts: [':', 'http', '192.168.1.1', '8080', '://'] },
  { id: 4, correct: ['https', '://', 'www', '.', 'twitch', '.', 'tv', '/', 'recrent'], parts: ['twitch', '.', '/', 'https', 'tv', 'recrent', '://', 'www', '.'] },
  { id: 5, correct: ['https', '://', 'open', '.', 'spotify', '.', 'com', '/', 'playlist', '/', '2wpKCUaaTeCdcPY2wEbcGP'], parts: ['.', '.', '/', 'open', '2wpKCUaaTeCdcPY2wEbcGP', '://', 'spotify', 'https', '/', 'playlist', 'com'] },
];

const DomainGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userParts, setUserParts] = useState([]);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  useEffect(() => {
    if (currentLevel < levels.length) {
      setUserParts([...levels[currentLevel].parts]);
      setMessage('');
    } else {
      setIsFinished(true);
      const finalTime = timer;
      const records = JSON.parse(sessionStorage.getItem('domainRecords') || '[]');
      records.push({ date: new Date().toLocaleDateString(), time: finalTime });
      records.sort((a, b) => a.time - b.time);
      sessionStorage.setItem('domainRecords', JSON.stringify(records.slice(0, 5)));
    }
  }, [currentLevel]);

  useEffect(() => {
    let interval;
    if (!isFinished) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isFinished]);

  // Drag and Drop
  const onDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (index) => {
    if (draggedItemIndex === null) return;
    
    const newParts = [...userParts];
    const draggedItem = newParts[draggedItemIndex];
    
    // Удаляем элемент с прошлой позиции и вставляем в новую
    newParts.splice(draggedItemIndex, 1);
    newParts.splice(index, 0, draggedItem);
    
    setUserParts(newParts);
    setDraggedItemIndex(null);
  };

  const checkResult = () => {
    const isCorrect = JSON.stringify(userParts) === JSON.stringify(levels[currentLevel].correct);
    if (isCorrect) {
      setMessage('Верно!');
      setTimeout(() => setCurrentLevel(prev => prev + 1), 1000);
    } else {
      setMessage('Подумай ещё');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (isFinished) {
    return (
      <div className="game-container">
        <h2>Игра окончена!</h2>
        <p>Ваше время: {timer} сек.</p>
        <Link to="/" className="btn-back">В меню</Link>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <span>Уровень {Math.min(currentLevel + 1, levels.length)} / {levels.length}</span>
        <span>Время: {timer} сек.</span>
      </div>
      <h2 className="game-title">Перетащи блоки в нужном порядке</h2>
      
      <div className="parts-container">
        {userParts.map((part, index) => (
          <div 
            key={index} 
            className={`part-block drag-item ${draggedItemIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(index)}
          >
            <span className="part-text">{part}</span>
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={checkResult} className="btn-check">Проверить</button>
      </div>
      {message && <div className={`message ${message === 'Верно!' ? 'success' : 'error'}`}>{message}</div>}
    </div>
  );
};

export default DomainGame;