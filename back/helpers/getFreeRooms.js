export default function getFreeRooms(data) {
  const users = data.users;
  const rooms = data.rooms;

  return Object.keys(rooms)
    .map(elem => {
      const idUserInRoom = rooms[elem].players[0];
      const userNameInRoom = users[idUserInRoom].name;

      if (rooms[elem].players.length < 2) {
        return {
          roomId: `${elem}`,
          roomUsers: [
            {
              name: userNameInRoom,
              index: idUserInRoom,
            },
          ],
        };
      }
    })
    .filter(val => val);
}
