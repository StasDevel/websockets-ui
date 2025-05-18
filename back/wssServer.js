import { WebSocketServer } from "ws";
import getFreeRooms from "./helpers/getFreeRooms.js";

class HandmadeESocket {
  actions = [];
  data = { users: {}, rooms: {}, winners: {} };

  on(actionType, callback) {
    this.actions.push({ actionType, callback });
  }

  createServer(port) {
    const wss = new WebSocketServer({ port });

    wss.on("connection", ws => {
      ws.on("message", message => {
        try {
          const dataParsed = JSON.parse(message.toString());

          const type = dataParsed.type;
          const passedData = dataParsed.data;

          this.actions.forEach(({ actionType, callback }) => {
            if (actionType === type) {
              callback(passedData, this.data, ws, wss);
            }
          });
        } catch (e) {
          console.error("Ошибка при обработке сообщения:", e);
        }
      });

      ws.on("close", () => {
        const createdRoomByUser = ws.userGameInfo.roomInfo.createdRoomId;
        if (createdRoomByUser) {
          delete this.data.rooms[`${createdRoomByUser}`];
          console.log(this.data);
          const freeRooms = getFreeRooms(this.data);
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
        }
      });
    });

    console.log(`Сервер websocket запущен на порту: ${port}`);
  }
}

export default HandmadeESocket;
