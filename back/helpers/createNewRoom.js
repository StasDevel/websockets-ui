export default function createNewRoom(serverData, ws) {
  //Создает новую комнату и добавляет туда текущего юзера
  const rooms = serverData.rooms;
  const keysOfRooms = Object.keys(rooms);
  const newRoomIndex = keysOfRooms[keysOfRooms.length - 1]
    ? Number(keysOfRooms[keysOfRooms.length - 1]) + 1
    : 1;
  ws.userGameInfo.roomInfo = {
    roomId: newRoomIndex,
  };
  rooms[newRoomIndex] = {
    players: [ws.userGameInfo.userId],
    games: {},
  };
}
