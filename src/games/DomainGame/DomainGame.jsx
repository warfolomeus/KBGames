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

  // ФУНКЦИЯ СОХРАНЕНИЯ РЕЗУЛЬТАТА
  const saveResult = (finalTime) => {
  const storageKey = 'kb_results';
  const currentUser = sessionStorage.getItem('current_user') || 'Аноним';
  const currentGameName = "Доменные имена"; 

  let allRecords = [];
  try {
    const savedData = localStorage.getItem(storageKey);
    allRecords = savedData ? JSON.parse(savedData) : [];
  } catch (e) {
    allRecords = [];
  }

  const newRecordData = {
    gameName: currentGameName,
    username: currentUser,
    date: new Date().toLocaleDateString('ru-RU'),
    time: finalTime,
    score: `${finalTime} сек.`
  };

  const existingRecordIndex = allRecords.findIndex(
    (rec) => rec.username === currentUser && rec.gameName === currentGameName
  );

  if (existingRecordIndex !== -1) {
    if (finalTime < allRecords[existingRecordIndex].time) {
      allRecords[existingRecordIndex] = newRecordData;
    }
  } else {
    allRecords.push(newRecordData);
  }

  localStorage.setItem(storageKey, JSON.stringify(allRecords));
};

  useEffect(() => {
    if (currentLevel < levels.length) {
      setUserParts([...levels[currentLevel].parts]);
      setMessage('');
    } else {
      setIsFinished(true);
      saveResult(timer);
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
      <div className="game-container instruction-card">
        <h2 className="game-title">Игра окончена!</h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '24px' }}>Ваше время: <strong>{timer}</strong> сек.</p>
        </div>
        <Link to="/" className="btn-back" style={{ display: 'block', textAlign: 'center' }}>В меню</Link>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <span style={{ color: '#006d5d', fontWeight: 'bold' }}>Уровень {Math.min(currentLevel + 1, levels.length)} / {levels.length}</span>
        <span>Время: <strong>{timer}</strong> сек.</span>
      </div>
      <h2 className="game-title">Собери URL-адрес</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Перетаскивай блоки, чтобы расставить их в правильном порядке</p>
      
      <div className="parts-container">
        {userParts.map((part, index) => (
          <div 
            key={index} 
            className={`part-block ${draggedItemIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(index)}
          >
            <span className="part-text">{part}</span>
          </div>
        ))}
      </div>

      <div className="controls" style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={checkResult} className="btn-start">Проверить</button>
      </div>
      
      {message && (
        <div className={`message ${message === 'Верно!' ? 'success' : 'error'}`} 
             style={{ 
               textAlign: 'center', 
               marginTop: '20px', 
               fontWeight: 'bold',
               color: message === 'Верно!' ? '#006d5d' : '#e03131' 
             }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DomainGame;