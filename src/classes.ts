import { Socket } from "socket.io";
import { Packets, PKicked, PUpdateNickname } from "./packets";

export class User {
    public profile: UserProfile
    private _userId: number

    constructor(userId: number, profile: UserProfile) {
        this._userId = userId
        this.profile = profile
    }

    get userId(): number {
        return this._userId
    }
}

export class UserProfile {
    public nickname: String
    private _associatedUserId: number

    constructor(associatedUserId: number, nickname: String) {
        this._associatedUserId = associatedUserId
        this.nickname = nickname
    }

    get userId(): number {
        return this._associatedUserId
    }
}

export class Message {
    public content: String
    public author: User

    constructor(content: String, author: User) {
        this.content = content
        this.author = author;
    }
}

export class Channel {
    private _messages: Array<Message>
    private _channelId: number

    constructor(channelId: number) {
        this._channelId = channelId
        this._messages = []
    }

    get channelId() {
        return this._channelId
    }

    insertMessage(message: Message) {
        this._messages.push(message)
    }

    getMessages(ammount?: number, startIndex?: number) {
        const endIndex = this._messages.length
        const readAmmount = ammount || endIndex
        const startFromIndex = startIndex || 0 + (endIndex - readAmmount)

        return this._messages.slice(startFromIndex, endIndex)
    }
}