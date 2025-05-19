import { generateUUID } from './uuid.js'

export default function authentication(
  name: string,
  password: string,
  data: any,
  ws: any,
): any {
  const allUsers = data.users
  const allWinners = data.winners
  const userId = generateUUID()
  const userObject = {
    name: name,
    userId: '',
    error: false,
    errorText: '',
  }

  for (const elem in allUsers) {
    const userInData = allUsers[elem]
    if (userInData.name === name && userInData.password === password) {
      userObject.userId = elem
      userObject.error = false
      userObject.errorText = ''
      ws.userGameInfo = { name: name, userId: userId }
      return userObject
    } else if (userInData.name === name && userInData.password !== password) {
      userObject.userId = ''
      userObject.error = true
      userObject.errorText = 'Неверный пароль.'
      return userObject
    }
  }

  allWinners[userId] = 0
  allUsers[userId] = { name: name, password: password }
  userObject.userId = userId
  userObject.error = false
  userObject.errorText = ''
  ws.userGameInfo = {
    name: name,
    userId: userId,
    roomInfo: {
      roomId: null,
      createdRoomId: null,
      currentPlayerId: null,
    },
  }

  return userObject
}
