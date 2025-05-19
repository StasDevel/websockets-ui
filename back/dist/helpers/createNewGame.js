export default function createNewGame(serverData, passedRoomIndex) {
    const rooms = serverData.rooms;
    const gamesObject = rooms[passedRoomIndex].games;
    const keysOfGames = Object.keys(gamesObject);
    const gameId = keysOfGames.length > 0 ? Number(keysOfGames[keysOfGames.length - 1]) + 1 : 1;
    gamesObject[gameId] = {};
    return String(gameId);
}
