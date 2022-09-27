// TODO: Code refactoration

import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import settings from './server_config.json'
import {
    IPUpdateProfile, IPMessage, IPMotd,
    IPReceivedMessage, IPRemoveProfile,
    IPYourProfile, Packets
} from './packets'
import { NetUser, User, UserManager, MessageType } from './classes'

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

const userManager: UserManager = new UserManager()

io.on(Packets.CONNECTION, (socket) => {
    const user: User = userManager.createUser(`Guest ${10000 + ~(Math.random() * 9999)}`)
    const netUser: NetUser = new NetUser(user, socket)

    // MOTD
    const sendMotd: IPMotd = settings.MOTD
    socket.emit(Packets.MOTD, sendMotd)

    //
    const sendAllProfiles: IPUpdateProfile = { profiles: userManager.getAllUserProfiles() }
    const sendNewProfile: IPUpdateProfile = { profiles: [user.profile] }
    const sendYourProfile: IPYourProfile = { userid: user.profile.userid }
    const sendUserJoin: IPMessage = { messagetype: MessageType.USER_JOIN, userid: user.id, timestamp: Date.now() }
    socket.emit(Packets.UPDATE_PROFILE, sendAllProfiles)
    socket.emit(Packets.YOUR_PROFILE, sendYourProfile)
    socket.broadcast.emit(Packets.UPDATE_PROFILE, sendNewProfile)
    io.emit(Packets.MESSAGE, sendUserJoin)



    socket.on(Packets.DISCONNECT, (reason: any) => {
        userManager.removeUser(user.id)

        const sendUserLeave: IPMessage = { messagetype: MessageType.USER_LEAVE, userid: user.id, timestamp: Date.now() }
        const sendRemoveProfile: IPRemoveProfile = { userids: [user.id] }
        io.emit(Packets.MESSAGE, sendUserLeave)
        io.emit(Packets.REMOVE_PROFILE, sendRemoveProfile)
    })

    socket.on(Packets.RECEIVED_MSG, (data: IPReceivedMessage) => {
        //! temporary way to handle errors. needs refactoration
        try {
            const filteredmessage = messageFilter(data.message)
            const sendData: IPMessage = { content: filteredmessage, userid: user.id, timestamp: Date.now() }
            io.emit(Packets.MESSAGE, sendData)
        } catch (err) {
            handleNetUserError(err, netUser)
        }
    })
})

function messageFilter(string: String): String {
    var filtered = string.substring(0, settings.MESSAGE_MAX_LEN)

    settings.MESSAGE_CHARACTER_FILTER.forEach((x) => {
        const char = String.fromCharCode(x)
        filtered = filtered.split(char).join('') // needs to be replaced with a faster solution
    })
    return filtered
}

//! temporary
function handleNetUserError(err: unknown, netuser: NetUser) {
    const userid = netuser.user.id

    console.log(`Socket ${netuser.socket.id} caused an error: ${err}. Forcing disconnection...`)
    netuser.socket.disconnect(true)

    const sendRemoveProfile: IPRemoveProfile = { userids: [userid] }
    io.emit(Packets.REMOVE_PROFILE, sendRemoveProfile)

    userManager.removeUser(userid)
}