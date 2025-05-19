export default function createNewRoom(serverData, ws) {
    const rooms = serverData.rooms;
    const keysOfRooms = Object.keys(rooms);
    const newRoomIndex = keysOfRooms.length > 0 ? Number(keysOfRooms[keysOfRooms.length - 1]) + 1 : 1;
    rooms[newRoomIndex] = {
        players: [ws.userGameInfo.userId],
        games: {},
    };
    ws.userGameInfo.roomInfo.createdRoomId = newRoomIndex;
    ws.userGameInfo.roomInfo.roomId = newRoomIndex;
}
