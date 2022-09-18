import { Socket } from "socket.io";
import { Packets, PKicked, PUpdateNickname } from "./packets";

export class Client {
    public nickname: String

    constructor(nickname: String) {
        this.nickname = nickname;
    }
}

export class NetClient {
    private _socket: Socket
    private _client: Client

    constructor(client: Client, socket: Socket) {
        this._client = client;
        this._socket = socket
    }

    get socket() { return this._socket }
    get nickname() { return this._client.nickname }

    disconnect(reason?: String) {
        const packetData = new PKicked(reason || 'unknow')
        this._socket.emit(Packets.KICK, packetData)
        this._socket.disconnect()
    }

    updateNickname(newnick: String) {
        this._client.nickname = newnick

        const packetData = new PUpdateNickname(newnick)
        this._socket.emit(Packets.UPDATE_NICK, packetData)

    }
}

export class Message {
    public content: String
    public author: Client

    constructor(content: String, author: Client) {
        this.content = content
        this.author = author;
    }
}

export class Channel {
    private _messages: Array<Message>

    constructor() {
        this._messages = []
    }

    insertMessage(message: Message) {
        this._messages.push(message)
    }

    getMessages(ammount?: number) {
        const endIndex = this._messages.length
        const readAmmount = ammount || endIndex
        const startIndex = endIndex - readAmmount

        return this._messages.slice(startIndex, endIndex)
    }
}