// src/SpaceCardGame.tsx
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './SpaceCardGame.css';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface CardData {
  category: string;
  clues: string[];
}

const SpaceCardGame: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<any>(null);
  const [guess, setGuess] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentCardData, setCurrentCardData] = useState<CardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
    });

    newSocket.on('gameCreated', ({ gameId, game }) => {
      console.log('Game created:', gameId);
      setGameId(gameId);
      setGameState(game);
      setIsHost(true);
    });

    newSocket.on('gameJoined', ({ gameId, game }) => {
      console.log('Joined game:', gameId);
      setGameId(gameId);
      setGameState(game);
    });

    newSocket.on('playerUpdate', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    newSocket.on('gameStarted', (game) => {
      setGameState(game);
      setCurrentCardData(game.currentCardData);
    });

    newSocket.on('gameUpdate', (game) => {
      setGameState(game);
      setCurrentCardData(game.currentCardData);
    });

    newSocket.on('timerUpdate', (time) => {
      setTimeLeft(time);
    });

    newSocket.on('guessIncorrect', (message) => {
      alert(message);
    });

    newSocket.on('error', (message) => {
      alert(message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createGame = () => {
    if (!socket || !playerName) {
      console.log('Cannot create game: socket or playerName missing');
      return;
    }
    const newGameId = Math.random().toString(36).substr(2, 9);
    console.log('Creating game with ID:', newGameId);
    socket.emit('createGame', { gameId: newGameId, playerName, timerSeconds });
  };

  const joinGame = () => {
    if (!socket || !playerName || !gameId) {
      console.log('Cannot join game: socket, playerName, or gameId missing');
      return;
    }
    socket.emit('joinGame', { gameId, playerName });
  };

  const startGame = () => {
    if (!socket || !gameId) return;
    socket.emit('startGame', gameId);
  };

  const revealNextClue = () => {
    if (!socket || !gameId || !gameState) return;
    socket.emit('revealClue', gameId);
  };

  const submitGuess = () => {
    if (!socket || !gameId || !guess) return;
    socket.emit('submitGuess', { gameId, guess, playerId: socket.id });
    setGuess('');
  };

  const goHome = () => {
    if (socket) socket.disconnect();
    navigate('/home');
  };

  if (!socket) return <div className="loading">Connecting...</div>;

  if (!gameState) {
    return (
      <div className="setup-container">
        <h1 className="title">Space Card Game</h1>
        <div className="setup-form">
          <input
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <div className="form-group">
            <input
              type="number"
              placeholder="Timer (seconds)"
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(Math.max(10, parseInt(e.target.value) || 30))}
              min="10"
            />
            <button onClick={createGame} disabled={!playerName}>Create Game</button>
          </div>
          <div className="form-group">
            <input
              placeholder="Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
            />
            <button onClick={joinGame} disabled={!playerName || !gameId}>Join Game</button>
          </div>
          <button className="home-btn" onClick={goHome}>Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="title">Round {gameState.currentRound}</h1>
      <button className="home-btn" onClick={goHome}>Home</button>
      <div className="players-container">
        {players.map(player => (
          <div key={player.id} className="player-card">
            {player.name}: {player.score} pts
          </div>
        ))}
      </div>
      {gameState.started ? (
        <>
          <div className="timer">
            Time Left: {timeLeft !== null ? timeLeft : gameState.timerSeconds} s
          </div>
          {currentCardData ? (
            <div className="card-container">
              <div className="game-card">
                <h2>{currentCardData.category.toUpperCase()}</h2>
                <div className="clues">
                  {currentCardData.clues.slice(0, gameState.revealedClues + 1).map((clue, index) => (
                    <p key={index} className="clue-item">{clue}</p>
                  ))}
                </div>
                {gameState.revealedClues < currentCardData.clues.length - 1 && (
                  <button className="clue-btn" onClick={revealNextClue}>Next Clue</button>
                )}
              </div>
            </div>
          ) : (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>Final Scores:</p>
              {players.map(player => (
                <p key={player.id}>{player.name}: {player.score} pts</p>
              ))}
            </div>
          )}
          {currentCardData && (
            <div className="guess-container">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Your guess..."
                className="guess-input"
              />
              <button className="guess-btn" onClick={submitGuess}>Guess</button>
            </div>
          )}
        </>
      ) : (
        <div className="waiting">
          <p>Waiting for players... Game ID: {gameId}</p>
          <p>Timer set to: {gameState.timerSeconds} seconds</p>
          {isHost && <button className="start-btn" onClick={startGame}>Start Game</button>}
        </div>
      )}
    </div>
  );
};

export default SpaceCardGame;