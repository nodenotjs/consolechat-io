import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import { slog } from './utils'
import { NetUser, NetUsersManager } from './defs'
import { Packets as P, PHandshake } from './packets'
import { getUnpackedSettings } from 'http2'
import settings from './server_config.json'



var DEBUG: boolean = true
const PORT: any = process.env.PORT || 3000

const app = express()
app.use(express.static(__dirname + '/../public'))
const httpServer = new http.Server(app)
const io = new socketio.Server(httpServer, {
    serveClient: false,
})

httpServer.listen(PORT, () => {
    console.log(`Server started! Listening ${PORT}`)
})


const users = new NetUsersManager();

io.on('connection', (client) => {
    DEBUG && slog.debug(`New connection: ${client.id}!`)
    const user = new NetUser(client)
    
    
    client.timeout(settings.HANDSHAKE_TIMEOUT).emit(P.REQUEST_HANDSHAKE, (err: any, response: PHandshake) => {
        if (err) {
            user.disconnect('Missing handshake')
            return
        }
        if (!validateNickname(response.nickname)) {
            user.disconnect('Invalid nickname')
            return
        }

        user.nickname = response.nickname
        users.addUser(user);
    })


    client.on('disconnect', (reason: String) => {
        DEBUG && slog.debug(`Disconnection: ${client.id}! Reason: ${reason}`)
        users.removeUser(user);
    })
})

// temp
function validateNickname(nick: String): Boolean {
    try {
        const validLenght = nick.length >= settings.MIN_USERNAME_LEN && nick.length <= settings.MAX_USERNAME_LEN
        return validLenght;
    } catch {
        return false
    }
}