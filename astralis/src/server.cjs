// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const spaceCards = [
  { answer: 'Mars', clues: ['Known as the Red Planet', 'Has the largest volcano in the solar system', 'Two moons named Phobos and Deimos', 'Fourth planet from the Sun'], category: 'planet' },
  { answer: 'Apollo 11', clues: ['First successful manned moon landing', 'Launched in 1969', 'Neil Armstrong was the commander', 'Buzz Aldrin walked on the moon too'], category: 'event' },
  { answer: 'Black Hole', clues: ['Region with extreme gravitational pull', 'Light cannot escape it', 'Can form from massive star collapse', 'Event horizon marks its boundary'], category: 'object' }
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5175',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const games = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createGame', ({ gameId, playerName, timerSeconds }) => {
    console.log(`Creating game ${gameId} for ${playerName} with timer ${timerSeconds}s`);
    const game = {
      players: [{ id: socket.id, name: playerName, score: 0 }],
      currentRound: 1,
      currentCard: 0,
      revealedClues: 0,
      started: false,
      timerSeconds: timerSeconds || 30,
      timeLeft: null,
      timer: null
    };
    games.set(gameId, game);
    socket.join(gameId);
    socket.emit('gameCreated', { gameId, game });
    io.to(gameId).emit('playerUpdate', game.players);
  });

  socket.on('joinGame', ({ gameId, playerName }) => {
    console.log(`Player ${playerName} joining game ${gameId}`);
    const game = games.get(gameId);
    if (game) {
      game.players.push({ id: socket.id, name: playerName, score: 0 });
      socket.join(gameId);
      io.to(gameId).emit('playerUpdate', game.players);
      socket.emit('gameJoined', { gameId, game });
    } else {
      socket.emit('error', 'Game not found');
    }
  });

  const startTimer = (gameId) => {
    const game = games.get(gameId);
    if (!game || game.timer) return;

    game.timeLeft = game.timerSeconds;
    io.to(gameId).emit('timerUpdate', game.timeLeft);

    game.timer = setInterval(() => {
      game.timeLeft--;
      io.to(gameId).emit('timerUpdate', game.timeLeft);
      if (game.timeLeft <= 0) {
        clearInterval(game.timer);
        game.timer = null;
        game.currentCard++;
        game.revealedClues = 0;
        io.to(gameId).emit('gameUpdate', {
          ...game,
          currentCardData: game.currentCard < spaceCards.length ? {
            category: spaceCards[game.currentCard].category,
            clues: spaceCards[game.currentCard].clues
          } : null
        });
        if (game.currentCard < spaceCards.length) startTimer(gameId);
      }
    }, 1000);
  };

  socket.on('startGame', (gameId) => {
    const game = games.get(gameId);
    if (game && !game.started) {
      game.started = true;
      io.to(gameId).emit('gameStarted', {
        ...game,
        currentCardData: {
          category: spaceCards[game.currentCard].category,
          clues: spaceCards[game.currentCard].clues
        }
      });
      startTimer(gameId);
    }
  });

  socket.on('revealClue', (gameId) => {
    const game = games.get(gameId);
    if (game && game.currentCard < spaceCards.length && game.revealedClues < spaceCards[game.currentCard].clues.length - 1) {
      game.revealedClues++;
      console.log(`Revealing clue ${game.revealedClues + 1} for game ${gameId}`);
      io.to(gameId).emit('gameUpdate', {
        ...game,
        currentCardData: {
          category: spaceCards[game.currentCard].category,
          clues: spaceCards[game.currentCard].clues
        }
      });
    }
  });

  socket.on('submitGuess', ({ gameId, guess, playerId }) => {
    const game = games.get(gameId);
    if (game && game.currentCard < spaceCards.length) {
      const currentCard = spaceCards[game.currentCard];
      if (guess.toLowerCase() === currentCard.answer.toLowerCase()) {
        const points = 4 - game.revealedClues;
        game.players = game.players.map(p =>
          p.id === playerId ? { ...p, score: p.score + points } : p
        );
        game.currentCard++;
        game.revealedClues = 0;
        clearInterval(game.timer);
        game.timer = null;
        io.to(gameId).emit('gameUpdate', {
          ...game,
          currentCardData: game.currentCard < spaceCards.length ? {
            category: spaceCards[game.currentCard].category,
            clues: spaceCards[game.currentCard].clues
          } : null
        });
        io.to(gameId).emit('playerUpdate', game.players);
        if (game.currentCard < spaceCards.length) startTimer(gameId);
      } else {
        socket.emit('guessIncorrect', 'Wrong guess!');
      }
    }
  });

  socket.on('nextCard', (gameId) => {
    const game = games.get(gameId);
    if (game) {
      clearInterval(game.timer);
      game.timer = null;
      game.currentCard++;
      game.revealedClues = 0;
      io.to(gameId).emit('gameUpdate', {
        ...game,
        currentCardData: game.currentCard < spaceCards.length ? {
          category: spaceCards[game.currentCard].category,
          clues: spaceCards[game.currentCard].clues
        } : null
      });
      if (game.currentCard < spaceCards.length) startTimer(gameId);
    }
  });

  socket.on('disconnect', () => {
    games.forEach((game, gameId) => {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        io.to(gameId).emit('playerUpdate', game.players);
        if (game.players.length === 0) {
          if (game.timer) clearInterval(game.timer);
          games.delete(gameId);
        }
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});