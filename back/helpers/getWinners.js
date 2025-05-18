export default function getWinners(serverData) {
  const arrServerWinners = Object.keys(serverData.winners);
  const allServerUsers = serverData.users;
  const winnersToUpdate = arrServerWinners.map(key => {
    return {
      name: allServerUsers[key].name,
      wins: serverData.winners[key],
    };
  });

  return winnersToUpdate;
}
