console.log("%cLoaded.", "font-style: italic;")

const serverAdress = "http://localhost:3000/"
const socketio = io(serverAdress);

function requestClients() {
    socketio.emit("list-users", (response) => {
        console.log(response)
    })
}