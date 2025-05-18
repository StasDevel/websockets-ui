import HandmadeESocket from "./wssServer.js";
import authentication from "./helpers/auth.js";
import getFreeRooms from "./helpers/getFreeRooms.js";

import { alphaNumericID } from "./helpers/uuid.js";

const server = new HandmadeESocket();

server.on("reg", (passedData, data, ws, wss) => {
  const parsedData = JSON.parse(passedData);
  const userName = parsedData.name;
  const userPassword = parsedData.password;

  const resOfUserAdd = authentication(userName, userPassword, data, ws);

  ws.send(
    JSON.stringify({
      type: "reg",
      data: JSON.stringify(resOfUserAdd),
      id: 0,
    }),
  );

  const arrAllWinners = Object.keys(data.winners);
  const allUsers = data.users;
  const winnersForUpdate = arrAllWinners.map(key => {
    return {
      name: allUsers[key].name,
      wins: data.winners[key],
    };
  });

  const freeRooms = getFreeRooms(data);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "update_winners",
          data: JSON.stringify(winnersForUpdate),
          id: 0,
        }),
      );

      client.send(
        JSON.stringify({
          type: "update_room",
          data: JSON.stringify(freeRooms),
          id: 0,
        }),
      );
    }
  });
});

server.on("create_room", (passedData, data, ws, wss) => {
  const rooms = data.rooms;
  const keysOfRooms = Object.keys(rooms);
  const newRoomIndex = keysOfRooms[keysOfRooms.length - 1]
    ? Number(keysOfRooms[keysOfRooms.length - 1]) + 1
    : 1;

  rooms[newRoomIndex] = {
    players: [ws.userGameInfo.userId],
  };

  const freeRooms = getFreeRooms(data);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "update_room",
          data: JSON.stringify(freeRooms),
          id: 0,
        }),
      );
    }
  });
});

server.on("add_user_to_room", (passedData, data, ws, wss) => {
  const rooms = data.rooms;
  const parsedData = JSON.parse(passedData);
  const passedRoomIndex = parsedData.indexRoom;

  console.log(alphaNumericID());
  if (
    rooms[passedRoomIndex].players.length < 2 &&
    !rooms[passedRoomIndex].players.includes(ws.userGameInfo.userId)
  ) {
    rooms[passedRoomIndex].players.push(ws.userGameInfo.userId);

    rooms[passedRoomIndex]["games"] = {};
    const gamesObject = rooms[passedRoomIndex]["games"];
    const keysOfGames = Object.keys(gamesObject);
    const newGameIndex = keysOfGames[keysOfGames.length - 1]
      ? Number(keysOfGames[keysOfGames.length - 1]) + 1
      : 1;

    const currentPlayers = rooms[`${passedRoomIndex}`]["players"];

    wss.clients.forEach(client => {
      if (
        client.readyState === WebSocket.OPEN &&
        currentPlayers.includes(client.userGameInfo.userId)
      ) {
        client.send(
          JSON.stringify({
            type: "update_room",
            data: JSON.stringify({
              idGame: newGameIndex,
              idPlayer: alphaNumericID(),
            }),
            id: 0,
          }),
        );
      }
    });
  }
});

server.on("add_ships", (comingData, data) => {
  console.log("add_ships");
});

server.on("start_game", (comingData, data) => {
  console.log("start_game");
});

server.createServer(3000);
