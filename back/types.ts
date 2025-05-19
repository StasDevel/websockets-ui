export type ID = string | number

export interface User {
  id: ID
  name: string
  password: string
  wins: number
}

export interface Room {
  roomId: ID
  players: ID[]
  games?: Record<string, Game>
}

export interface Ship {
  position: { x: number; y: number }
  direction: boolean
  length: number
  type: 'small' | 'medium' | 'large' | 'huge'
  hits?: { x: number; y: number }[]
}

export interface PlayerInGame {
  ships: Ship[]
  hits?: { x: number; y: number }[]
}

export interface Game {
  [playerId: string]: PlayerInGame
}

export interface ServerData {
  users: Record<ID, User>
  rooms: Record<ID, Room>
  winners: Record<ID, number>
}

export interface WebSocketUserGameInfo {
  name: string
  userId: ID
  roomInfo: {
    roomId: ID | null
    createdRoomId: ID | null
    currentPlayerId: ID | null
  }
}

export interface WebSocketWithGameInfo extends WebSocket {
  on(arg0: string, arg1: (message: any) => void): unknown
  userGameInfo: WebSocketUserGameInfo
}
