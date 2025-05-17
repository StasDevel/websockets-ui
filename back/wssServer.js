import { WebSocketServer } from "ws";
import indexHandler from "./handlers/indexHandler.js";
import generateUUID from './helpers/uuid.js'

// const wss = new WebSocketServer({port: 3000});

// const data = {
//     users: {    }
// }

// wss.on('connection', (ws) => {
//     console.log("Новое подключение")
//     // console.log(wss.clients )

//     ws.on('message', (message) => {
//         const type = JSON.parse(message.toString()).type

//         indexHandler(type, data)
//         console.log()
//     })

// })


class HandmadeESocket {
    actions = []
    data = {users: {}}

    on(actionType, callback) {
        this.actions.push({ actionType, callback });
    }

    createServer(port) {
        const wss = new WebSocketServer({port});

        wss.on('connection', (ws) => {
            console.log('Новое подключение');

            ws.on('message', (message) => {
                try {
                    const dataParsed = JSON.parse(message.toString());
                    const type = dataParsed.type;

                    this.actions.forEach(({ actionType, callback }) => {
                        if (actionType === type) {
                            // callback({ userId, data });
                            callback(dataParsed, this.data)
                        }
                    });
                } catch (e) {
                    console.error('Ошибка при обработке сообщения:', e);
                }
            });

        })
    }
}

export default HandmadeESocket