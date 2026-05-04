import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecordsPage.css';

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const currentUser = sessionStorage.getItem('current_user');

  useEffect(() => {
    const loadRecords = () => {
      const savedData = localStorage.getItem('kb_results');
      if (savedData && currentUser) {
        try {
          const parsedData = JSON.parse(savedData);
          
          // Фильтруем записи только для вошедшего пользователя
          const myRecords = parsedData.filter(rec => rec.username === currentUser);
          
          // Сортируем по названию, чтобы список не прыгал
          const sorted = myRecords.sort((a, b) => a.gameName.localeCompare(b.gameName));
          setRecords(sorted);
        } catch (e) {
          console.error("Ошибка загрузки рекордов:", e);
        }
      }
    };

    loadRecords();
  }, [currentUser]);

  const clearMyRecords = () => {
    if (window.confirm("Удалить ваши лучшие результаты? Рекорды других игроков не пострадают.")) {
      const savedData = localStorage.getItem('kb_results');
      if (savedData) {
        const allRecords = JSON.parse(savedData);
        const filteredRecords = allRecords.filter(rec => rec.username !== currentUser);
        localStorage.setItem('kb_results', JSON.stringify(filteredRecords));
        setRecords([]);
      }
    }
  };

  return (
    <div className="records-container">
      <div className="records-card">
        <h2 className="records-title">Ваши лучшие результаты</h2>
        <div className="user-info">
          Игрок: <strong>{currentUser}</strong>
        </div>
        
        {records.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Модуль</th>
                    <th>Рекорд</th>
                    <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, index) => (
                    <tr key={index}>
                      <td className="game-name-cell">{rec.gameName}</td>
                      <td className="score-cell">{rec.score}</td>
                      <td className="date-cell">{rec.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button onClick={clearMyRecords} className="btn-clear-data">
              🗑️ Сбросить мои рекорды
            </button>
          </>
        ) : (
          <div className="no-records">
            <p>Вы еще не установили ни одного рекорда под этим именем.</p>
          </div>
        )}

        <Link to="/" className="btn-return">
          Вернуться в меню
        </Link>
      </div>
    </div>
  );
};

export default RecordsPage;