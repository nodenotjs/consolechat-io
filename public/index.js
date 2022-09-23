const __urlParms = new URLSearchParams(window.location.search)
var DEBUG = __urlParms.get('debug')
var NETDEBUG = __urlParms.get('netdebug')

const profilesManager = new ProfilesManager()

const sys = {
    slog: {
        debug: (obj) => console.log(`%c[DEBUG] ${obj}`, "font-style: italic; color: gray;"),
        netdebug: (obj) => console.log(`%c[NETDEBUG] ${obj}`, "font-style: italic; color: gray;")
    },

    util: {
        displayMsg: (message, author) =>
            console.log(`%c${author.nickname}%c: %c${message}`,
                "font-weight: bold", "color: gray", "")
    },

    Packets: {
        // Server
        MOTD: 'motd',
        MESSAGE: 'msg',
        USER_PROFILE: 'userprofile',

        // Client
        SENDMSG: 'sendmsg',
        REQUEST_PROFILE: 'req-profile'
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

socket.prependAny((event, ...args) => {
    NETDEBUG && sys.slog.netdebug(`Received event '${event}' with args '${JSON.stringify(args)}'`)
})





socket.on(sys.Packets.MOTD, (data) => {
    console.log(data.message, ...data.styles)
})

socket.on(sys.Packets.MESSAGE, (data) => {
    const message = data.message
    var author = profilesManager.getProfileById(data.author)
    if (author)
    {
        sys.util.displayMsg(message, author)
    }
    else
    {
        const sendData = {profileId: data.author}
        socket.emit(sys.Packets.REQUEST_PROFILE, sendData, (data) => {
            const profile = data.profile
            profilesManager.addProfile(profile)
            sys.util.displayMsg(message, profile)
        })
    }
})






function send(message) {
    const data = { message: message }
    socket.emit(sys.Packets.SENDMSG, data)
}