export default function createNewGame(serverData, passedRoomIndex) {
  //Создает в КОМНАТЕ новую игру и возвращает индекс игры
  const rooms = serverData.rooms;
  const gamesObject = rooms[passedRoomIndex].games;
  const keysOfGames = Object.keys(gamesObject);
  const gameId = keysOfGames[keysOfGames.length - 1]
    ? Number(keysOfGames[keysOfGames.length - 1]) + 1
    : 1;
  gamesObject[gameId] = {};
  return gameId;
}
