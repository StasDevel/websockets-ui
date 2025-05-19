import { WebSocketServer, WebSocket } from 'ws'
import getFreeRooms from './helpers/getFreeRooms.js'

interface User {
  id: string
  name: string
  password: string
  wins: number
}

interface Room {
  players: string[]
  games: Record<string, any>
}

interface ServerData {
  users: Record<string, User>
  rooms: Record<string, Room>
  winners: Record<string, number>
}

interface GameRoomInfo {
  roomId: string | null
  createdRoomId: string | null
  currentPlayerId: string | null
}

interface GameUserInfo {
  userGameInfo: {
    name: string
    userId: string
    roomInfo: GameRoomInfo
  }
}

type GameWebSocket = WebSocket & GameUserInfo

interface ActionCallback {
  actionType: string
  callback: (
    passedData: string,
    serverData: ServerData,
    ws: GameWebSocket,
    wss: WebSocketServer,
  ) => void
}

class HandmadeESocket {
  public actions: ActionCallback[] = []
  public data: ServerData = {
    users: {},
    rooms: {},
    winners: {},
  }
  wss: any

  public on(
    actionType: string,
    callback: (
      passedData: string,
      serverData: ServerData,
      ws: GameWebSocket,
      wss: WebSocketServer,
    ) => void,
  ): void {
    this.actions.push({ actionType, callback })
  }

  public createServer(port: number): void {
    const wss = new WebSocketServer({ port })

    wss.on('connection', (ws: GameWebSocket) => {
      ws.userGameInfo = {
        name: '',
        userId: '',
        roomInfo: {
          roomId: null,
          createdRoomId: null,
          currentPlayerId: null,
        },
      }

      ws.on('message', (message: any) => {
        try {
          const dataParsed = JSON.parse(message.toString())
          const type = dataParsed.type
          const passedData = dataParsed.data

          this.actions.forEach(({ actionType, callback }) => {
            if (actionType === type) {
              callback(passedData, this.data, ws, wss)
            }
          })
        } catch (e) {
          console.error('Ошибка при обработке сообщения:', e)
        }
      })

      // Обработка отключения
      ws.on('close', () => {
        const createdRoomByUser = ws.userGameInfo.roomInfo.createdRoomId
        if (createdRoomByUser && this.data.rooms[`${createdRoomByUser}`]) {
          delete this.data.rooms[`${createdRoomByUser}`]
          const freeRooms = getFreeRooms(this.data)
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'update_room',
                  data: JSON.stringify(freeRooms),
                  id: 0,
                }),
              )
            }
          })
        }
      })
    })

    console.log(`Сервер websocket запущен на порту: ${port}`)
  }
}

export default HandmadeESocket
