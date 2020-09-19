var gamesPool = [];
var thereIsOpenGame = false;
var newGame = {
    id: 0,
    nicknamePlayer_1: '',
    nicknamePlayer_2: '',
    users: [],
    gameCards: [],
    numberOfPairs: 10,
    category: 'animals'
};
var counter = 0;

function joinGame(id, userNickname, category, numberOfPairs) {
    var playerNumber = 1;
    if (thereIsOpenGame) {
        startGame(id, userNickname);
        playerNumber = 2;
    }
    else {
        setNewGame(id, userNickname, category, numberOfPairs);
    }
    return { newGame, playerNumber };

}

function setGameCards(cards) {
    newGame.gameCards = cards;
}

function setNewGame(id, nicknamePlayer_1, category, numberOfPairs) {
    newGame = {
        id: ++counter,
        nicknamePlayer_1,
        nicknamePlayer_2: '',
        users: [id],
        gameCards: [],
        numberOfPairs,
        category
    };
    thereIsOpenGame = true;
}

function startGame(id, nicknamePlayer_2) {
    newGame.nicknamePlayer_2 = nicknamePlayer_2;
    newGame.users.push(id);
    gamesPool.push(newGame);
    thereIsOpenGame = false;
}

function getGameId(userId) {
    const game = gamesPool.find(game => game.users.includes(userId));
    return game.id;
}

function leaveGame(userId) {
    thereIsOpenGame = false;
    const gameToRemove = gamesPool.find(game => game.users.includes(userId));
    if (gameToRemove) {
        gamesPool = gamesPool.filter(game => game.id !== gameToRemove.id);
    }
    return gameToRemove ? gameToRemove.id : newGame.id;
}

function getNicknames(gameId) {
    const { nicknamePlayer_1, nicknamePlayer_2 } = gamesPool.find(game => game.id === gameId);
    return [nicknamePlayer_1, nicknamePlayer_2]
}

module.exports = {
    joinGame,
    leaveGame,
    getGameId,
    setGameCards,
    getNicknames
};