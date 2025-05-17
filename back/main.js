import HandmadeESocket from "./wssServer.js";
import generateUUID from "./helpers/uuid.js";

const server = new HandmadeESocket();

server.on("reg", (passedData, data, ws) => {
  const parsedData = JSON.parse(passedData);
  const userName = parsedData.name;
  const userPassword = parsedData.password;
  const allUsers = data.users;

  function addUser(name, password, users) {
    const userId = generateUUID();
    const userObject = {
      name: name,
      userId: "",
      error: "",
      errorText: "",
    };

    for (let elem in users) {
      if (users[elem].name === name) {
        userObject.userId = "";
        userObject.error = true;
        userObject.errorText = "Пользователь с таким именем уже существует.";
        return userObject;
      }
    }

    users[userId] = { name: name, password: password };

    userObject.userId = userId;
    userObject.error = false;
    userObject.errorText = "";

    ws.userGameInfo = {name: userName, userId: userId};

    return userObject;
  }

  const resOfUserAdd = addUser(userName, userPassword, allUsers);

  ws.send(
    JSON.stringify({
      type: "reg",
      data: JSON.stringify(resOfUserAdd),
      id: 0,
    })
  );
});





server.on("update_winners", (comingData, data) => {
  console.log("update_winners");
});




server.on("create_room", (passedData, data, ws) => {
  const rooms = data.rooms;
  const keysOfRooms = Object.keys(rooms);
  const newRoomIndex = keysOfRooms[keysOfRooms.length - 1]
    ? +keysOfRooms[keysOfRooms.length - 1] + 1
    : 1;

  rooms[newRoomIndex] = {
    players: [ws.userId],
  };

  ws.send(
    JSON.stringify({
      type: "update_room",
      data: 
        JSON.stringify([{
          roomId: `${newRoomIndex}`,
          roomUsers: [
            {
              name: ws.userGameInfo.name,
              index: ws.userGameInfo.userId,
            },
          ],
        }]),
      id: 0,
    })
  );

  console.log(data, "rooms");
});

server.on("add_user_to_room", (passedData, data, ws) => {
  const rooms = data.rooms;
  const parsedData = JSON.parse(passedData);
  const passedRoomIndex = parsedData.indexRoom;

  if (rooms[passedRoomIndex].players.length < 2) {
    rooms[passedRoomIndex].players.push(ws.userId);
  }
});

server.on("create_game", (comingData, data) => {
  console.log("create_game");
});

server.on("update_room", (comingData, data) => {
  console.log("update_room");
});

server.on("add_ships", (comingData, data) => {
  console.log("add_ships");
});

server.on("start_game", (comingData, data) => {
  console.log("start_game");
});

server.createServer(3000);
