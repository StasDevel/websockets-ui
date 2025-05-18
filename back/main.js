import HandmadeESocket from "./wssServer.js";
import authentication from "./helpers/auth.js";
import getFreeRooms from "./helpers/getFreeRooms.js";

import { alphaNumericID } from "./helpers/uuid.js";
import getWinners from "./helpers/getWinners.js";
import createNewRoom from "./helpers/createNewRoom.js";
import createNewGame from "./helpers/createNewGame.js";

const server = new HandmadeESocket();

server.on("reg", (passedData, serverData, ws, wss) => {
  const clientData = JSON.parse(passedData);
  const userName = clientData.name;
  const userPassword = clientData.password;

  const resOfUserAdd = authentication(userName, userPassword, serverData, ws);

  ws.send(
    JSON.stringify({
      type: "reg",
      data: JSON.stringify(resOfUserAdd),
      id: 0,
    }),
  );

  const winners = getWinners(serverData);
  const freeRooms = getFreeRooms(serverData);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "update_winners",
          data: JSON.stringify(winners),
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

server.on("create_room", (passedData, serverData, ws, wss) => {
  createNewRoom(serverData, ws);

  const freeRooms = getFreeRooms(serverData);

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

server.on("add_user_to_room", (passedData, serverData, ws, wss) => {
  const rooms = serverData.rooms;
  const clientData = JSON.parse(passedData);
  const passedRoomIndex = clientData.indexRoom;
  const chosenRoom = rooms[passedRoomIndex];
  const userId = ws.userGameInfo.userId;

  if (chosenRoom.players.length < 2 && !ws.userGameInfo.roomInfo) {
    chosenRoom.players.push(userId);
    ws.userGameInfo.roomInfo = {
      roomId: passedRoomIndex,
    };

    const gameId = createNewGame(serverData, passedRoomIndex);
    const currentPlayers = rooms[`${passedRoomIndex}`]["players"];
    const freeRooms = getFreeRooms(serverData);

    wss.clients.forEach(client => {
      if (
        client.readyState === WebSocket.OPEN &&
        currentPlayers.includes(client.userGameInfo.userId)
      ) {
        client.send(
          JSON.stringify({
            type: "update_room",
            data: JSON.stringify(freeRooms),
            id: 0,
          }),
        );
        client.send(
          JSON.stringify({
            type: "create_game",
            data: JSON.stringify({
              idGame: gameId,
              idPlayer: alphaNumericID(),
            }),
            id: 0,
          }),
        );
      }
    });
  }
  console.log(serverData);
});

server.on("add_ships", (passedData, serverData, ws, wss) => {
  const parsedData = JSON.parse(passedData);
  const gameId = parsedData.gameId;
  const ships = parsedData.ships;
  const indexPlayer = parsedData.indexPlayer;
  ws.userGameInfo.roomInfo.currentPlayerId = indexPlayer;

  const inRoomNumber = ws.userGameInfo.roomInfo.roomId;
  const currentGame = serverData.rooms[inRoomNumber].games[gameId];
  currentGame[indexPlayer] = { ships: ships };

  const objectForClient = {
    ships: currentGame[indexPlayer],
    currentPlayerIndex: indexPlayer,
  };

  if (Object.keys(currentGame).length == 2) {
    console.log(ws.userGameInfo.roomInfo.roomId == gameId, "must send");
    wss.clients.forEach(client => {
      if (
        client.readyState === WebSocket.OPEN &&
        ws.userGameInfo.roomInfo.roomId == gameId
      ) {
        client.send(
          JSON.stringify({
            type: "start_game",
            data: JSON.stringify(objectForClient),
            id: 0,
          }),
        );
      }
    });
  }
});

server.on("start_game", (comingData, data) => {
  console.log("start_game");
});

server.createServer(3000);
