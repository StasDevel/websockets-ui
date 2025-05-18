import { generateUUID } from "./uuid.js";

export default function authentication(name, password, data, ws) {
  const allUsers = data.users;
  const allWinners = data.winners;

  const userId = generateUUID();
  const userObject = {
    name: name,
    userId: "",
    error: "",
    errorText: "",
  };

  for (const elem in allUsers) {
    if (allUsers[elem].name === name && allUsers[elem].password === password) {
      userObject.userId = elem;
      userObject.error = false;
      userObject.errorText = "";

      ws.userGameInfo = { name: name, userId: userId };

      return userObject;
    } else if (
      allUsers[elem].name === name &&
      allUsers[elem].password !== password
    ) {
      userObject.userId = "";
      userObject.error = true;
      userObject.errorText = "Неверный пароль.";
      return userObject;
    }
  }
  allWinners[userId] = 0;
  allUsers[userId] = { name: name, password: password };

  userObject.userId = userId;
  userObject.error = false;
  userObject.errorText = "";

  ws.userGameInfo = { name: name, userId: userId };

  return userObject;
}
