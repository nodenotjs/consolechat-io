import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import { slog } from './utils'
import settings from './server_config.json'
import { IPMessage, IPReceivedMessage, IPRequestUserProfile, IPUserProfile, Packets } from './packets'
import { NetUser, User, UserManager } from './classes'
import { isPromise } from 'util/types'

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

const userManager: UserManager = new UserManager();

io.on(Packets.CONNECTION, (socket) => {
    const user: User = userManager.createUser(`Guest ${10000 + ~(Math.random() * 9999)}`)
    const netUser: NetUser = new NetUser(user, socket)

    socket.on(Packets.DISCONNECT, (_: any) => {
        userManager.removeUser(user.id)
    })

    socket.on(Packets.REQUEST_PROFILE, (data: IPRequestUserProfile, callback: Function) => {
        const id = data.profileId
        const profile = userManager.getUserById(id)
        if (profile) {
            const sendData: IPUserProfile = { profile: profile.profile }
            callback(sendData)
        }
        else {
            callback(undefined)
        }
    })

    socket.on(Packets.RECEIVED_MSG, (data: IPReceivedMessage) => {
        
        const sendData: IPMessage = { message: data.message, author: user.id }
        io.emit(Packets.MESSAGE, sendData)
    })

    netUser.sendMotd(
        "%c --== Bem-vindo ao ConsoleChat.io! ==--" +
        "%c\n Pelo visto você achou onde o site funciona ;)" +
        "%c\n\n Caso precise de ajuda, digite %chelp%c para a lista de comandos"

        , "font-weight: bold; color: gold; font-size: 24px",
        "color: lime",
        "", "color: aqua; text-decoration: underline", "")
})