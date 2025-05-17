import HandmadeESocket from "./wssServer.js";

const server = new HandmadeESocket();

server.on('reg', (comingData, data) => {
    console.log(data.users)
})




















server.on('update_winners', (comingData, data) => {
    console.log(data.users)
})


server.on('create_room', (comingData, data) => {
    console.log(data.users)
})

server.on('add_user_to_room', (comingData, data) => {
    console.log(data.users)
})

server.on('create_game', (comingData, data) => {
    console.log(data.users)
})

server.on('update_room', (comingData, data) => {
    console.log(data.users)
})

server.on('add_ships', (comingData, data) => {
    console.log(data.users)
})

server.on('start_game', (comingData, data) => {
    console.log(data.users)
})

server.createServer(3000)