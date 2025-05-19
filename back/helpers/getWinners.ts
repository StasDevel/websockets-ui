export default function getWinners(serverData: any) {
  const arrServerWinners = Object.keys(serverData.winners)
  const allServerUsers = serverData.users

  return arrServerWinners.map((key) => ({
    name: allServerUsers[key]?.name || 'Unknown',
    wins: serverData.winners[key],
  }))
}
