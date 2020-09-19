const io = require('socket.io')(3000);

var {
    joinGame,
    leaveGame,
    getGameId,
    setGameCards,
    getNicknames
} = require('./utils/game');


io.on("connection", (socket) => {
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
        const gameId = getGameId(socket.id);
        leaveGame(gameId);
        socket.to(gameId).emit('gameEnd');
    });
});

