const __urlParms = new URLSearchParams(window.location.search)
var DEBUG = __urlParms.get('debug')
var NETDEBUG = __urlParms.get('netdebug')
const sys = {
    slog: {
        debug: (obj) => console.log(`%c[DEBUG] ${obj}`, "font-style: italic; color: gray;"),
        netdebug: (obj) => console.log(`%c[NETDEBUG] ${obj}`, "font-style: italic; color: gray;")
    }
}
DEBUG && sys.slog.debug("Loaded.");


const serverAdress = "http://localhost:3000/"
const socket = io(serverAdress);


socket.on('connect', () => {
    DEBUG && sys.slog.debug(`Connected! SocketID='${socket.id}'`)

})

socket.on('disconnect', (reason) => {
    DEBUG && sys.slog.debug(`Disconnected! Reason: ${reason}`)
})

socket.on('kick', (reason) => {
    DEBUG && sys.slog.debug(`Kicked! Reason: ${reason}`)
    socket.disconnect()
})

socket.prependAny((event, ...args) => {
    NETDEBUG && sys.slog.netdebug(`Received event '${event}' with args '${JSON.stringify(args)}'`)
})