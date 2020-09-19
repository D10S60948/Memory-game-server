const io = require('socket.io')(process.env.PORT || 3000);

var {
    joinGame,
    leaveGame,
    getGameId,
    setGameCards,
    getNicknames
} = require('./utils/game');

io.on("connection", (socket) => {
    console.log(socket.id, 'connected');
    socket.on('join', (nickname, category, numberOfPairs) => {
        const { newGame, playerNumber } = joinGame(socket.id, nickname, category, numberOfPairs);
        socket.join(newGame.id);
        socket.emit('setSettings', newGame.id, playerNumber === 1);
        if (playerNumber === 2) {
            socket.emit('setGameSettings', newGame.gameCards, newGame.category, newGame.numberOfPairs);
        }
    })

    socket.on('setGameCards', cards => setGameCards(cards));
    socket.on('readyToStart', (gameId) => {
        io.in(gameId).emit('startGame', getNicknames(gameId))
    });

    socket.on('selectCard', (selectedIndex, gameId) => {
        socket.to(gameId).emit('cardSelect', selectedIndex);
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        const gameId = leaveGame(socket.id);
        socket.to(gameId).emit('gameEnd');
    });
});

