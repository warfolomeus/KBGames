import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicesGame.css';

const INITIAL_ELEMENTS = [
  { id: 'person', name: 'Человек', icon: '👤' },
  { id: 'rest', name: 'Отдых', icon: '🏖️' },
  { id: 'book', name: 'Книга', icon: '📖' },
  { id: 'camera', name: 'Видеокамера', icon: '📹' },
  { id: 'pc', name: 'Компьютер', icon: '💻' },
  { id: 'net', name: 'Интернет', icon: '🌐' },
  { id: 'photo_cam', name: 'Фотоаппарат', icon: '📷' },
];

const FINAL_GOALS = [
  { id: 'video_host', name: 'YouTube', icon: '📺' },
  { id: 'img_host', name: 'Google Photos', icon: '☁️' },
  { id: 'wiki', name: 'Wikipedia', icon: '🌍' },
  { id: 'docs', name: 'Google Docs', icon: '📄' },
  { id: 'soc_net', name: 'Соц. сеть', icon: '📱' },
  { id: 'blog', name: 'Блоги', icon: '✍️' },
  { id: 'maps', name: 'Карты', icon: '🗺️' }
];

const RECIPES = {
  'person+rest': { id: 'trip', name: 'Путешествие', icon: '✈️' },
  'trip+camera': { id: 'video', name: 'Видео', icon: '🎬' },
  'trip+photo_cam': { id: 'photo', name: 'Фотография', icon: '🖼️' },
  'person+book': { id: 'knowledge', name: 'Знания', icon: '💡' },
  'person+knowledge': { id: 'encyclopedia', name: 'Энциклопедия', icon: '📚' },
  'pc+photo': { id: 'presentation', name: 'Презентация', icon: '📊' },
  'person+person': { id: 'people', name: 'Люди', icon: '👥' },
  'person+people': { id: 'friends', name: 'Друзья', icon: '🤝' },
  'trip+pc': { id: 'story', name: 'Рассказ', icon: '📝' },
  'photo+trip': { id: 'coords', name: 'Координаты', icon: '📍' },
  // Финальные сервисы
  'video+net': { id: 'video_host', name: 'YouTube', icon: '📺', final: true },
  'photo+net': { id: 'img_host', name: 'Google Photos', icon: '☁️', final: true },
  'net+encyclopedia': { id: 'wiki', name: 'Wikipedia', icon: '🌍', final: true },
  'net+presentation': { id: 'docs', name: 'Google Docs', icon: '📄', final: true },
  'friends+net': { id: 'soc_net', name: 'Соц. сеть', icon: '📱', final: true },
  'photo+story': { id: 'blog', name: 'Блоги', icon: '✍️', final: true },
  'coords+net': { id: 'maps', name: 'Карты', icon: '🗺️', final: true },
};

const ServicesGame = () => {
  const [inventory, setInventory] = useState(INITIAL_ELEMENTS);
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [resultSlot, setResultSlot] = useState(null);
  const [status, setStatus] = useState('idle');
  const [foundFinals, setFoundFinals] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Функция сохранения в общий список рекордов
  const saveResult = (finalTime) => {
  const storageKey = 'kb_results';
  const currentUser = sessionStorage.getItem('current_user') || 'Аноним';
  const currentGameName = "Сетевые сервисы"; 

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
    let interval;
    if (!isFinished && foundFinals.length < FINAL_GOALS.length) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isFinished, foundFinals.length]);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e, slot) => {
    const item = JSON.parse(e.dataTransfer.getData('item'));
    if (slot === 1) setSlot1(item);
    if (slot === 2) setSlot2(item);
    setResultSlot(null);
    setStatus('idle');
  };

  const combine = () => {
    if (!slot1 || !slot2) return;

    const key1 = `${slot1.id}+${slot2.id}`;
    const key2 = `${slot2.id}+${slot1.id}`;
    const result = RECIPES[key1] || RECIPES[key2];

    if (result) {
      setResultSlot(result);
      setStatus('success');
      
      if (result.final) {
        if (!foundFinals.find(f => f.id === result.id)) {
          const updatedFinals = [...foundFinals, result];
          setFoundFinals(updatedFinals);
          
          if (updatedFinals.length === FINAL_GOALS.length) {
            setTimeout(() => {
              setIsFinished(true);
              saveResult(timer); // Сохраняем в localStorage
            }, 1000);
          }
        }
      } else {
        if (!inventory.find(i => i.id === result.id)) {
          setInventory([...inventory, result]);
        }
      }
    } else {
      setStatus('error');
      setResultSlot({ name: '?', icon: '❌' });
    }
  };

  if (isFinished) {
    return (
      <div className="game-container">
        <h2 style={{fontSize: '48px', color: '#006d5d'}}>Отличная работа!</h2>
        <p style={{fontSize: '20px'}}>Вы воссоздали цифровую среду за {timer} секунд.</p>
        <Link to="/" className="btn-back" style={{marginTop: '30px', display: 'inline-block'}}>В меню</Link>
      </div>
    );
  }

  return (
    <div className="services-layout">
      <div className="finals-sidebar">
        <h3>Цели (Сервисы)</h3>
        <div className="finals-grid">
          {FINAL_GOALS.map((goal) => {
            const isOpened = foundFinals.find(f => f.id === goal.id);
            return (
              <div key={goal.id} className={`final-slot ${isOpened ? 'active' : 'locked'}`}>
                <div className="icon">{isOpened ? goal.icon : '🔒'}</div>
                <div className="name">{goal.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="main-game-area">
        <div className="game-header">
          <span>Прогресс: {foundFinals.length} / {FINAL_GOALS.length}</span>
          <span>Время: <strong>{timer}</strong> сек.</span>
        </div>

        <div className="work-area">
          <div className="slot" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 1)}>
            {slot1 ? <div><div className="icon">{slot1.icon}</div>{slot1.name}</div> : <span className="placeholder">Слот 1</span>}
          </div>
          <div className="plus">+</div>
          <div className="slot" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 2)}>
            {slot2 ? <div><div className="icon">{slot2.icon}</div>{slot2.name}</div> : <span className="placeholder">Слот 2</span>}
          </div>
          <div className="equal">=</div>
          <div className={`slot result ${status}`}>
            {resultSlot ? <div><div className="icon">{resultSlot.icon}</div>{resultSlot.name}</div> : "?"}
          </div>
        </div>

        <button className="btn-combine" onClick={combine}>Скомбинировать</button>

        <div className="inventory-section">
          <h4>Ваш инвентарь (перетащите в слоты):</h4>
          <div className="inventory">
            {inventory.map((item, idx) => (
              <div key={idx} className="inv-item" draggable onDragStart={(e) => handleDragStart(e, item)}>
                <div className="icon">{item.icon}</div>
                <div className="name">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesGame;