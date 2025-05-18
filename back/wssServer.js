import { WebSocketServer } from "ws";

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
        console.log("Пользователь отключился");
      });
    });

    console.log(`Сервер websocket запущен на порту: ${port}`);
  }
}

export default HandmadeESocket;
