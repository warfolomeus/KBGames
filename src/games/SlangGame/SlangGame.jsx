import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SlangGame.css';

const SlangGame = () => {
  const wordsToFind = [
    { id: 1, word: 'ПАРОЛЬ', def: '1. Секретное слово для подтверждения личности. (6)' },
    { id: 2, word: 'ФАЙЕРВОЛ', def: '2. Межсетевой экран для фильтрации трафика. (8)' },
    { id: 3, word: 'КАПЧА', def: '3. Тест Тьюринга для отличия человека от робота. (5)' },
    { id: 4, word: 'АНТИВИРУС', def: '4. Программа для поиска вредоносного кода. (9)' },
    { id: 5, word: 'БЭКАП', def: '5. Резервная копия данных на носителе. (5)' },
    { id: 6, word: 'ЛОГ', def: '6. Файл с записями о работе системы. (3)' },
    { id: 7, word: 'ПАТЧ', def: '7. Обновление для исправления ошибок. (4)' },
    { id: 8, word: 'АПДЕЙТ', def: '8. Процесс обновления продукта. (6)' },
    { id: 9, word: 'АВТОРИЗАЦИЯ', def: '9. Процедура подтверждения подлинности пользователя при входе в систему. (11)' },
    { id: 10, word: 'КРИПТОГРАФИЯ', def: '10. Наука о конфиденциальности. (12)' },
    { id: 11, word: 'КЛЮЧ', def: '11. Секретная информация, используемая криптографическим алгоритмом при шифровании/расшифровке сообщений. (4)' },
  ];

  const gridData = [
    ['Ф', 'А', 'Л', 'Ю', 'Ч', 'А', 'А', 'В', 'Т', 'О', 'Р'],
    ['Е', 'Й', 'К', 'И', 'Т', 'Н', 'С', 'Ц', 'А', 'З', 'И'],
    ['Р', 'Р', 'И', 'В', 'Л', 'П', 'А', 'И', 'Ь', 'П', 'А'],
    ['В', 'У', 'С', 'М', 'Ч', 'Д', 'Т', 'Я', 'Л', 'О', 'Р'],
    ['О', 'Л', 'П', 'А', 'Т', 'Е', 'Й', 'А', 'Ф', 'П', 'Ч'],
    ['Э', 'К', 'К', 'Р', 'Г', 'О', 'Л', 'Р', 'И', 'А', 'А'],
    ['Б', 'А', 'П', 'И', 'П', 'Т', 'О', 'Г', 'Я', 'К', 'В']
  ];

  const [selectedCells, setSelectedCells] = useState([]);
  const [allFoundCells, setAllFoundCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);
  
  const currentUser = sessionStorage.getItem('current_user') || 'Аноним';

  useEffect(() => {
    if (isGameActive) {
      timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isGameActive]);

  const toggleCell = (r, c) => {
    if (!isGameActive || gridData[r][c] === ' ') return;
    const key = `${r}-${c}`;
    
    if (allFoundCells.includes(key)) return;

    if (selectedCells.length === 0) {
      setSelectedCells([key]);
      return;
    }

    if (selectedCells.includes(key)) {
      setSelectedCells(prev => prev.filter(k => k !== key));
      return;
    }

    const hasNeighborInSelection = selectedCells.some(selectedKey => {
      const [sR, sC] = selectedKey.split('-').map(Number);
      return (Math.abs(sR - r) === 1 && sC === c) || (sR === r && Math.abs(sC - c) === 1);
    });

    if (hasNeighborInSelection) {
      setSelectedCells(prev => [...prev, key]);
    } else {
      setSelectedCells([key]);
    }
  };

  const handleCheck = () => {
    const selectedWordChars = selectedCells.map(k => {
      const [r, c] = k.split('-').map(Number);
      return gridData[r][c];
    });

    const wordString = selectedWordChars.join('');

    const match = wordsToFind.find(w => {
      if (w.word.length !== wordString.length) return false;

      const sortedTarget = [...w.word].sort().join('');
      const sortedSelected = [...selectedWordChars].sort().join('');

      return sortedTarget === sortedSelected;
    });

    if (match && !foundWords.includes(match.word)) {
      const newFound = [...foundWords, match.word];
      setFoundWords(newFound);
      setAllFoundCells(prev => [...prev, ...selectedCells]);
      setSelectedCells([]);
      
      if (newFound.length === wordsToFind.length) {
        setIsGameActive(false);
        setIsFinished(true);
        saveResult(time);
      }
    } else {
      setSelectedCells([]);
    }
  };

  const saveResult = (finalTime) => {
    const storageKey = 'kb_results';
    const currentGameName = "Сленг-кроссворд";
    let allRecords = JSON.parse(localStorage.getItem(storageKey) || '[]');

    const newRecord = {
      gameName: currentGameName,
      username: currentUser,
      date: new Date().toLocaleDateString('ru-RU'),
      time: finalTime,
      score: `${finalTime} сек.`
    };

    const idx = allRecords.findIndex(r => r.username === currentUser && r.gameName === currentGameName);
    if (idx !== -1) {
      if (finalTime < allRecords[idx].time) allRecords[idx] = newRecord;
    } else {
      allRecords.push(newRecord);
    }
    localStorage.setItem(storageKey, JSON.stringify(allRecords));
  };

  // Победный экран
  if (isFinished) {
    return (
      <div className="game-page-container">
        <div className="game-card-wide instruction-card">
          <h2 className="game-title">Кроссворд разгадан!</h2>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '24px' }}>Ваше время: <strong>{time}</strong> сек.</p>
          </div>
          <Link to="/" className="btn-back" style={{ display: 'block', textAlign: 'center' }}>В меню</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page-container">
      <div className="game-card-wide">
        <div className="game-header-line">
          <h2>Сленг-кроссворд</h2>
          <div className="game-timer">Время: <strong>{time}</strong> сек.</div>
        </div>

        <div className="game-content-layout">
          <div className="grid-wrapper">
            <div className="slang-grid">
              {gridData.map((row, rIdx) => (
                <div key={rIdx} className="slang-row">
                  {row.map((char, cIdx) => {
                    const key = `${rIdx}-${cIdx}`;
                    const isSelected = selectedCells.includes(key);
                    const isFound = allFoundCells.includes(key);
                    return (
                      <div 
                        key={key} 
                        className={`slang-cell ${isSelected ? 'active' : ''} ${isFound ? 'found' : ''} ${char === ' ' ? 'empty' : ''}`}
                        onClick={() => toggleCell(rIdx, cIdx)}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="game-actions">
              {isGameActive ? (
                <>
                  <button onClick={handleCheck} className="btn-primary">Проверить</button>
                  <button onClick={() => setSelectedCells([])} className="btn-outline">Сброс</button>
                </>
              ) : (
                <Link to="/" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  На главную
                </Link>
              )}
            </div>
          </div>

          <div className="definitions-list">
            <h3>Определения:</h3>
            <ul>
              {wordsToFind.map(w => (
                <li key={w.id} className={foundWords.includes(w.word) ? 'strikethrough' : ''}>
                  {w.def} {foundWords.includes(w.word) && '✓'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlangGame;