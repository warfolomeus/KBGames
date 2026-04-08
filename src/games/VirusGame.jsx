import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VirusGame.css';

const NETWORK_NODES = [
  { id: 0, x: 100, y: 100 }, { id: 1, x: 220, y: 70 }, { id: 2, x: 260, y: 200 }, 
  { id: 3, x: 150, y: 250 }, { id: 4, x: 70, y: 180 },
  { id: 5, x: 480, y: 70 }, { id: 6, x: 630, y: 70 }, { id: 7, x: 650, y: 220 }, 
  { id: 8, x: 530, y: 300 }, { id: 9, x: 420, y: 180 },
  { id: 10, x: 300, y: 420 }, { id: 11, x: 480, y: 420 }, { id: 12, x: 520, y: 560 }, 
  { id: 13, x: 350, y: 620 }, { id: 14, x: 230, y: 540 },
  { id: 15, x: 360, y: 100 }, { id: 16, x: 220, y: 360 }, { id: 17, x: 560, y: 380 }
];

const NETWORK_EDGES = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [3, 4],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 5], [5, 7],
  [10, 11], [11, 12], [12, 13], [13, 14], [14, 10], [10, 12], [11, 14],
  [1, 15], [15, 5], [3, 16], [16, 14], [8, 17], [17, 12]
];

const VirusGame = () => {
  const [nodes, setNodes] = useState([]);
  const [actionsLeft, setActionsLeft] = useState(2);
  const [turns, setTurns] = useState(0); 
  const [selectedTool, setSelectedTool] = useState('heal');
  const [gameState, setGameState] = useState('playing'); 
  const [showInstruction, setShowInstruction] = useState(true);

  const initGame = () => {
    const newNodes = NETWORK_NODES.map(n => ({ ...n, state: 'clean', timer: 0 }));
    const infectedIndices = [];
    while (infectedIndices.length < 3) { // ЕСЛИ ХОТИМ БОЛЬШЕ ЗАРАЖЕННЫХ ПК ПРИ СТАРТЕ, ТО МЕНЯЕМ ЧИСЛО В СКОБКАХ!!!!!!!!!!!!!!!
      const randomIndex = Math.floor(Math.random() * NETWORK_NODES.length);
      if (!infectedIndices.includes(randomIndex)) infectedIndices.push(randomIndex);
    }
    infectedIndices.forEach(idx => { newNodes[idx].state = 'infected'; });
    
    setNodes(newNodes);
    setTurns(0);
    setActionsLeft(2);
    setGameState('playing');
  };

  useEffect(() => {
    initGame();
  }, []);

  // Проверка условий окончания игры
  useEffect(() => {
    if (nodes.length === 0 || showInstruction || gameState !== 'playing') return;

    const allInfected = nodes.every(n => n.state === 'infected');
    const allClean = nodes.every(n => n.state !== 'infected');

    if (allInfected) {
      const timer = setTimeout(() => setGameState('lost'), 1000);
      return () => clearTimeout(timer);
    } else if (allClean) {
    const timer = setTimeout(() => {
    const storageKey = 'virusRecords';
    const dateStr = new Date().toLocaleDateString('ru-RU');
    const newRecord = {
      date: dateStr,
      time: turns
    };

    let currentRecords = [];
    try {
      const savedData = sessionStorage.getItem(storageKey);
      currentRecords = savedData ? JSON.parse(savedData) : [];
      if (!Array.isArray(currentRecords)) currentRecords = [];
    } catch (e) {
      currentRecords = [];
    }
    currentRecords.push(newRecord);
    sessionStorage.setItem(storageKey, JSON.stringify(currentRecords));   
    setGameState('won');
  }, 1000);
  return () => clearTimeout(timer);
}
  }, [nodes, turns, showInstruction, gameState]);

  const getToolCount = (tool) => nodes.filter(n => n.state === tool).length;

  const handleNodeClick = (id) => {
    if (gameState !== 'playing' || showInstruction) return;
    const newNodes = [...nodes];
    const node = newNodes.find(n => n.id === id);

    // Логика отмены действия (в рамках текущего хода)
    if (node.isNewThisTurn) {
      const isCorrectTool = 
        (selectedTool === 'av' && node.state === 'antivirus') ||
        (selectedTool === 'fw' && node.state === 'firewall') ||
        (selectedTool === 'heal' && node.state === 'clean');

      if (isCorrectTool) {
        node.state = node.prevStateBeforeAction || 'clean';
        node.timer = node.prevTimerBeforeAction || 0;
        delete node.isNewThisTurn;
        setActionsLeft(prev => prev + 1);
        setNodes(newNodes);
        return;
      }
    }

    if (actionsLeft <= 0) return;

    let actionTaken = false;

    // Применение инструментов
    if (selectedTool === 'heal' && node.state === 'infected') {
      node.prevStateBeforeAction = 'infected';
      node.state = 'clean';
      node.isNewThisTurn = true;
      actionTaken = true;
    } 
    else if (selectedTool === 'av' && node.state !== 'antivirus') {
      if (getToolCount('antivirus') < 2) {
        node.prevStateBeforeAction = node.state;
        node.prevTimerBeforeAction = node.timer;
        node.state = 'antivirus';
        node.timer = 2;
        node.isNewThisTurn = true;
        actionTaken = true;
      }
    } 
    else if (selectedTool === 'fw' && (node.state === 'clean' || node.state === 'antivirus')) {
      if (getToolCount('firewall') < 2) {
        node.prevStateBeforeAction = node.state;
        node.prevTimerBeforeAction = node.timer;
        node.state = 'firewall';
        node.timer = 4;
        node.isNewThisTurn = true;
        actionTaken = true;
      }
    }

    if (actionTaken) {
      setActionsLeft(prev => prev - 1);
      
      // Победа: Если после этого клика вирусов не осталось
      const willBeAllClean = newNodes.every(n => n.state !== 'infected');
      if (willBeAllClean) {
        setTurns(prev => prev + 1); // Обновляем счетчик в менюшке слева
      }
    }
    
    setNodes(newNodes);
  };

  const endTurn = () => {
    let nextNodes = nodes.map(n => {
      const { isNewThisTurn, prevStateBeforeAction, prevTimerBeforeAction, ...rest } = n;
      return rest;
    });

    nextNodes = nextNodes.map(node => {
      if (node.timer > 0) {
        const nextTimer = node.timer - 1;
        return { ...node, timer: nextTimer, state: nextTimer === 0 ? 'clean' : node.state };
      }
      return node;
    });

    // Логика распространения вируса
    const infectedIds = nextNodes.filter(n => n.state === 'infected').map(n => n.id);
    const toInfect = new Set();
    infectedIds.forEach(idx => {
      NETWORK_EDGES.forEach(([u, v]) => {
        if (u === idx && nextNodes[v].state === 'clean') toInfect.add(v);
        if (v === idx && nextNodes[u].state === 'clean') toInfect.add(u);
      });
    });
    toInfect.forEach(idx => { nextNodes[idx].state = 'infected'; });

    setNodes(nextNodes);
    setTurns(prev => prev + 1);
    setActionsLeft(2);
  };

  if (showInstruction) {
    return (
      <div className="game-container instruction-card">
        <h2 className="game-title">Инструкция</h2>
        <div className="instruction-content">
          <p>Перед вами схема компьютерной сети. Часть компьютеров заражена вирусами.</p>
          <p>Вам требуется, используя имеющиеся средства, предотвратить распространение вирусов и вылечить все компьютеры.</p>
          <p>Игра происходит по ходам, по очереди действуете вы и вирусы.</p>
          <p>За один ход вы можете совершить два действия.</p>
          <p>Для выполнения задачи в вашем распоряжении следующие инструменты:</p>
          <div className="tool-desc-list">
            <p><strong>💊 Лечение</strong> – удаление вирусов (2 раза за ход).</p>
            <p><strong>🛡️ Антивирус</strong> - лечение и защита на 2 хода (макс. 2).</p>
            <p><strong>🧱 Firewall</strong> – защита чистого ПК на 4 хода (макс. 2).</p>
          </div>
          <div className="color-legend">
            <p><span className="box red"></span> Вирус</p>
            <p><span className="box green"></span> Антивирус</p>
            <p><span className="box yellow"></span> Firewall</p>
          </div>
        </div>
        <button className="btn-start" onClick={() => setShowInstruction(false)}>Начать</button>
      </div>
    );
  }

  return (
    <div className="virus-game-layout">
      {gameState === 'won' && (
        <div className="game-container">
          <h2 className="game-title">Победа!</h2>
          <p style={{ fontSize: '24px' }}>Ходов: <strong>{turns}</strong></p>
          <Link to="/" className="btn-back">В меню</Link>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-container">
          <h2 className="game-title" style={{ color: '#fa5252' }}>Вы проиграли!</h2>
          <p style={{ fontSize: '18px', color: '#666' }}>Все компьютеры в сети заражены.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="btn-back" style={{ background: '#006d5d' }} onClick={initGame}>Заново</button>
            <Link to="/" className="btn-back">В меню</Link>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="game-sidebar">
            <div className="stat-block">
              <label>Ход</label>
              <div className="stat-value">{turns}</div>
            </div>
            <div className="stat-block">
              <label>Действия</label>
              <div className="stat-value highlight">{actionsLeft}</div>
            </div>
            <div className="tool-selector">
              <button className={`tool-btn ${selectedTool === 'heal' ? 'active' : ''}`} onClick={() => setSelectedTool('heal')}>💊 Лечение</button>
              <button className={`tool-btn ${selectedTool === 'av' ? 'active' : ''}`} onClick={() => setSelectedTool('av')}>🛡️ Антивирус ({getToolCount('antivirus')}/2)</button>
              <button className={`tool-btn ${selectedTool === 'fw' ? 'active' : ''}`} onClick={() => setSelectedTool('fw')}>🧱 FireWall ({getToolCount('firewall')}/2)</button>
            </div>
            <button className="end-turn-btn" onClick={endTurn} disabled={actionsLeft > 0}>Завершить ход</button>
          </div>

          <div className="network-container">
            <svg width="750" height="650" viewBox="0 0 750 650" className="network-svg">
              {NETWORK_EDGES.map(([u, v], i) => (
                <line key={i} x1={nodes[u].x} y1={nodes[u].y} x2={nodes[v].x} y2={nodes[v].y} className="network-edge" />
              ))}
              {nodes.map(node => (
                <g key={node.id} className="node-group" onClick={() => handleNodeClick(node.id)}>
                  <circle cx={node.x} cy={node.y} className={`node-circle ${node.state} ${node.isNewThisTurn ? 'pending-action' : ''}`} />
                  <text x={node.x} y={node.y + 4} className="node-text">ПК</text>
                  {node.timer > 0 && <text x={node.x} y={node.y - 28} className="timer-text">{node.timer}h</text>}
                </g>
              ))}
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default VirusGame;