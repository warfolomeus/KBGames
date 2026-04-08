import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Header from './components/Header';
import DomainGame from './games/DomainGame';
import ServicesGame from './games/ServicesGame';
import VirusGame from './games/VirusGame';
import './App.css';

// Компонент-обертка для отрисовки выбранной игры
const GamePage = () => {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);

  const renderGame = () => {
    switch (decodedTitle) {
      case 'Составь доменное имя':
        return <DomainGame />;
      case 'Сетевые сервисы':
        return <ServicesGame />;
      case 'Защити сеть от вирусов':
        return <VirusGame />;
      default:
        return (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Игра в разработке</h1>
            <Link to="/" className="btn-back">← Назад в меню</Link>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="game-wrapper">
        <h2 className="game-title-display">{decodedTitle}</h2>
        {renderGame()}
      </main>
    </div>
  );
};

// Главная страница со списком игр
const HomePage = () => {
  const games = [
    { 
      id: 1, 
      title: 'Составь доменное имя', 
      desc: 'Расставьте в необходимом порядке все фрагменты доменного имени, используя в качестве основы предложенные элементы.' 
    },
    { 
      id: 2, 
      title: 'Сетевые сервисы', 
      desc: 'Собери популярные сетевые сервисы, используя базовые объекты.' 
    },
    { 
      id: 3, 
      title: 'Защити сеть от вирусов', 
      desc: 'Необходимо предотвратить распростронение вирусов по сети и вылечить все компьютеры.' 
    },
  ];

  return (
    <div className="app">
      <Header />
      <main>
        <section className="hero">
          <h1>Игры <span style={{color: 'var(--k-green)'}}>KBGames</span></h1>
          <p>Интерактивная среда для изучения основ информационной безопасности.</p>
        </section>

        <div className="games-grid">
          {games.map(game => (
            <Link 
              key={game.id} 
              to={`/game/${encodeURIComponent(game.title)}`} 
              className="game-card"
            >
              <div className="card-content">
                <h3>{game.title}</h3>
                <p>{game.desc}</p>
              </div>
              <span className="btn-play">ИГРАТЬ →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

// Страница результатов
const ResultsPage = () => {
  const domainRecords = JSON.parse(sessionStorage.getItem('domainRecords') || '[]');
  const servicesRecords = JSON.parse(sessionStorage.getItem('servicesRecords') || '[]');
  const virusRecords = JSON.parse(sessionStorage.getItem('virusRecords') || '[]');

  const RecordTable = ({ title, data, unit = 'сек' }) => (
    <div className="record-section">
      <h3>{title}</h3>
      {data.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Результат ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rec, i) => (
              <tr key={i}>
                <td>{rec.date}</td>
                <td><strong>{rec.time}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">Результатов пока нет</p>
      )}
    </div>
  );

  return (
    <div className="app">
      <Header />
      <main className="results-container">
        <h1>Таблица ваших рекордов</h1>
        <div className="results-card">
          <RecordTable title="🧩 Сборка домена" data={domainRecords} />
          <RecordTable title="🧪 Сетевые сервисы" data={servicesRecords} />
          <RecordTable title="🛡️ Защита от вирусов" data={virusRecords} unit="ходов" />
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/" className="btn-back">На главную</Link>
        </div>
      </main>
    </div>
  );
};

function App() {
  // Очистка всех рекордов при обновлении страницы (далее можно реализовать регистрацию на сайте и перманентное сохранение результатов)
  useEffect(() => {
    sessionStorage.removeItem('domainRecords');
    sessionStorage.removeItem('servicesRecords');
    sessionStorage.removeItem('virusRecords');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:title" element={<GamePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;