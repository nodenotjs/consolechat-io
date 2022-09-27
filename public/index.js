const serverAdress = "http://localhost:3000/"
const socket = io(serverAdress)

const __urlParms = new URLSearchParams(window.location.search)
var DEBUG = __urlParms.get('debug')
var NETDEBUG = __urlParms.get('netdebug')

const profilesCache = new ProfilesCache()

const sys = {
    slog: {
        debug: (obj) => console.log(`%c[DEBUG] ${obj}`, "font-style: italic; color: gray;"),
        debugwarn: (obj) => console.log(`%c[DEBUG WARN] ${obj}`, "font-style: italic; color: yellow;"),
        netdebug: (obj) => console.log(`%c[NETDEBUG] ${obj}`, "font-style: italic; color: gray;")
    },


    Packets: {
        // Server
        MOTD: 'motd',
        MESSAGE: 'msg',
        USER_JOIN: 'userjoin',
        USER_LEAVE: 'userleave',
        UPDATE_PROFILE: 'updateprofile',
        REMOVE_PROFILE: 'removeprofile',
        YOUR_PROFILE: 'yourprofile',

        // Client
        SEND_MSG: 'sendmsg',
    },

    MessageType: {
        NORMAL: 0,
        USER_JOIN: 1,
        USER_LEAVE: 2
    },

    getTimeString(timestamp) {
        const messageDate = new Date(timestamp)
        return `${messageDate.getHours()}:${messageDate.getMinutes()}`
    },

    displayMessage: (message, profile) => {
        const messageDateString = sys.getTimeString(message.timestamp)
        console.log(
            `%c${profile.nickname}%c: %c${message.content}%c - ${messageDateString}`,
            'font-weight: bold', 'color: gray', '', 'color: gray')
    },

    displayMotd: (content, ...styles) => {
        console.log(content, ...styles)
    },

    displayUserJoin: (message, profile) => {
        const messageDateString = sys.getTimeString(message.timestamp)
        console.log(
            `%c🠊 %c${profile.nickname}%c joined the conversation!%c - ${messageDateString}`,
            'color: lime', 'font-weigth: bold', 'color: gray', 'color: gray'
        )
    },

    displayUserLeave: (message, profile) => {
        const messageDateString = sys.getTimeString(message.timestamp)
        console.log(
            `%c🠈 %c${profile.nickname}%c left the conversation%c - ${messageDateString}`,
            'color: red', 'font-weigth: bold', 'color: gray', 'color: gray'
        )
    }
}

DEBUG && sys.slog.debug("Loaded.");




socket.on('connect', () => {
    DEBUG && sys.slog.debug(`Connected! SocketID='${socket.id}'`)

})

socket.on('disconnect', (reason) => {
    DEBUG && sys.slog.debug(`Disconnected! Reason: ${reason}`)
})

socket.prependAny((event, ...args) => {
    NETDEBUG && sys.slog.netdebug(`Received event '${event}' with args '${JSON.stringify(args)}'`)
})



socket.on(sys.Packets.UPDATE_PROFILE, (data) => {
    data.profiles.forEach((p) => {
        const newProfile = !profilesCache.getHasProfile(p.userid)
        if (newProfile)
            DEBUG && sys.slog.debug(`Added profile ${p.userid} to cache`)
        else
            DEBUG && sys.slog.debug(`Updated profile ${p.userid} in cache`)

        profilesCache.setProfile(p)
    })
})

socket.on(sys.Packets.REMOVE_PROFILE, (data) => {
    data.userids.forEach((i) => {
        DEBUG && sys.slog.debug(`Removed profile ${i} from cache`)
        profilesCache.removeProfile(i)
    })
})

socket.on(sys.Packets.YOUR_PROFILE, (data) => {
    const id = data.userid
    profilesCache.setMyProfileId(id)
    DEBUG && sys.slog.debug(`Your profile id defined to ${id}`)
})

socket.on(sys.Packets.MOTD, (data) => {
    const message = data.message.join('')
    sys.displayMotd(message, ...data.styles)
})

socket.on(sys.Packets.MESSAGE, (data) => {
    const messagetype = data.messagetype || sys.MessageType.NORMAL
    const message = data
    const author = data.userid
    const profile = profilesCache.getProfile(author)

    switch (messagetype) {
        case sys.MessageType.NORMAL:
            sys.displayMessage(message, profile)
            break

        case sys.MessageType.USER_JOIN:
            sys.displayUserJoin(message, profile)
            break

        case sys.MessageType.USER_LEAVE:
            sys.displayUserLeave(message, profile)
            break

        default:
            sys.slog.debugwarn("Unknow messagetype received.", { data: data })
            break
    }
})

/*socket.on(sys.Packets.USER_JOIN, (data) => {
    const userId = data.userid
    const profile = profilesCache.getProfile(userId)
})

socket.on(sys.Packets.USER_LEAVE, (data) => {
    const userId = data.userid
    const profile = profilesCache.getProfile(userId)
})*/


// - USER COMMANDS
Object.defineProperty(__proto__, "help", {
    get: () => {
        console.log(
            "say(\"<message>\"): sends a message"
        )
    }
})

function say(message) {
    let finalMessage = message
    if (Array.isArray(finalMessage)) finalMessage = finalMessage.join('')

    const data = { message: finalMessage }
    socket.emit(sys.Packets.SEND_MSG, data)
}