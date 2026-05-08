import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './HangmanGame.css';

const INITIAL_WORDS = [
  { word: 'ФИШИНГ', hint: 'Вид интернет-мошенничества, цель которого - выманить у вас логины, пароли или личные данные.' },
  { word: 'ШИФРОВАНИЕ', hint: 'Превращение понятной информации в набор непонятных символов с помощью специального ключа.' },
  { word: 'ХАКЕР', hint: 'Специалист, использующий свои знания для поиска уязвимостей или обхода систем защиты.' },
  { word: 'ТРОЯН', hint: 'Вредоносная программа, маскирующаяся под легитимное ПО.' },
  { word: 'БРАНДМАУЭР', hint: 'Защитный «фильтр» между вашим компьютером и интернетом.' },
  { word: 'БЭКДОР', hint: 'Лазейка в программе, которую хакер оставляет себе для тайного входа.' },
  { word: 'КРИПТОГРАФИЯ', hint: 'Наука о защите информации путем ее преобразования в нечитаемый вид.' },
  { word: 'СНИФФЕР', hint: 'Программа-перехватчик, которая «подслушивает» ваши данные в сети.' },
  { word: 'КУКИ', hint: 'Файлы в браузере, хранящие данные о ваших действиях на сайтах.' },
  { word: 'СПАМ', hint: 'Массовая рассылка рекламных или опасных сообщений без согласия получателя.' },
];

const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

const HangmanGame = () => {
  const shuffledWords = useMemo(() => {
    return [...INITIAL_WORDS].sort(() => Math.random() - 0.5);
  }, []);

  const [currentLevel, setCurrentLevel] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  
  const maxMistakes = 5;
  const currentWordData = shuffledWords[currentLevel];
  const targetWord = currentWordData.word;

  useEffect(() => {
    let interval;
    if (!isGameFinished) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isGameFinished]);

  useEffect(() => {
  const isWon = targetWord.split('').every(letter => guessedLetters.includes(letter));

  if (isWon && !isGameFinished) {
    if (currentLevel < shuffledWords.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setGuessedLetters([]);
        setMistakes(0);
      }, 1000); 
      return () => clearTimeout(timer);
    } else {
      setIsGameFinished(true);
      saveResult(time);
    }
  } 

  if (mistakes >= maxMistakes && !isGameFinished) {
    setIsGameFinished(true);
  }

}, [guessedLetters, mistakes, targetWord, isGameFinished]);

  const saveResult = (finalTime) => {
    const storageKey = 'kb_results';
    const currentUser = sessionStorage.getItem('current_user') || 'Аноним';
    const currentGameName = "Виселица";

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

  const handleLetterClick = (letter) => {
    if (guessedLetters.includes(letter) || mistakes >= maxMistakes || isGameFinished) return;
    setGuessedLetters(prev => [...prev, letter]);
    if (!targetWord.includes(letter)) {
      setMistakes(prev => prev + 1);
    }
  };

  const infectionPercent = mistakes * 20;

  if (isGameFinished) {
    const isWin = mistakes < maxMistakes;
    return (
      <div className="game-container instruction-card">
        <h2 className="game-title" style={{ textAlign: 'center', width: '100%', marginBottom: '20px' }}>
          {isWin ? 'Система спасена!' : 'Система заражена!'}
        </h2>
        <p style={{ fontSize: '20px', textAlign: 'center' }}>
          {isWin ? `Вы очистили сеть за ${time} сек.` : `Вирус захватил данные. Слово было: ${targetWord}`}
        </p>    
        <Link 
          to="/" 
          className="btn-back" 
          style={{ display: 'block', textAlign: 'center', marginTop: '30px', marginLeft: 'auto', marginRight: 'auto', width: 'fit-content' }}
        >
          В меню
        </Link>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <span>Загадка {currentLevel + 1} / {shuffledWords.length}</span>
        <span>Время: <strong>{time}</strong> сек.</span>
      </div>

      <div className="infection-display">
  <div className="computer-icon">
    <span className="pc-emoji" role="img" aria-label="PC">💻</span>
    <div 
      className="pc-label" 
      style={{ 
        color: infectionPercent > 60 ? '#e03131' : infectionPercent >= 40 ? '#ca9c05' : '#006d5d',
        fontWeight: 'bold' 
      }}
    >
      Заражён на {infectionPercent}%
    </div>
  </div>
  
  <div className="progress-vertical-bar">
    <div 
      className="progress-fill" 
      style={{ 
        height: `${infectionPercent}%`, 
        backgroundColor: infectionPercent > 60 ? '#e03131' : infectionPercent >= 40 ? '#fcc419' : '#006d5d',
      }}
    ></div>
  </div>

  <div className="hint-box">
    <strong>Определение:</strong>
    <p>{currentWordData.hint}</p>
  </div>
</div>

      <div className="word-slots-container">
        {targetWord.split('').map((letter, index) => (
          <div key={index} className="word-segment">
            {guessedLetters.includes(letter) ? letter : ''}
          </div>
        ))}
      </div>

      <div className="modern-keyboard">
        {ALPHABET.map(letter => {
          const isGuessed = guessedLetters.includes(letter);
          const isWrong = isGuessed && !targetWord.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`modern-key ${isGuessed ? 'used' : ''} ${isWrong ? 'wrong' : ''}`}
              disabled={isGuessed}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HangmanGame;