import { WebSocketServer } from "ws";
import indexHandler from "./handlers/indexHandler.js";
import generateUUID from './helpers/uuid.js'

class HandmadeESocket {
    actions = []
    data = {users: {}, rooms: {}}

    on(actionType, callback) {
        this.actions.push({ actionType, callback });
    }

    createServer(port) {
        const wss = new WebSocketServer({port});

        wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                try {
                    const dataParsed = JSON.parse(message.toString());

                    const type = dataParsed.type;
                    const passedData = dataParsed.data;
                    const id = dataParsed.id
                    

                    this.actions.forEach(({ actionType, callback }) => {
                        if (actionType === type) {
                            callback(passedData, this.data, ws)
                        }
                    });
                } catch (e) {
                    console.error('Ошибка при обработке сообщения:', e);
                }
            });

            ws.on('close', () => {
                console.log('Пользователь отключился')
            })
        })

        

        console.log(`Сервер websocket запущен на порту: ${port}`)
    }
}

export default HandmadeESocket