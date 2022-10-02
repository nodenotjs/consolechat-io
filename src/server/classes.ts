import { Server, Socket } from "socket.io"
import { Packets } from "./packets"


export class TagGroup<Type> {
    private _tags: Array<Type>

    constructor() {
        this._tags = []
    }

    public addTag(tag: Type) {
        if (this.haveTag(tag)) return

        this._tags.push(tag)
    }

    public addTags(tags: Array<Type>) {
        tags.forEach((e) => { this.addTag(e) })
    }

    public removeTag(tag: Type) {
        if (!this.haveTag(tag)) return

        const index = this._tags.indexOf(tag)
        this._tags.splice(index, 1)
    }

    public removeTags(tags: Array<Type>) {
        tags.forEach((e) => { this.removeTag(e) })
    }

    public haveTag(tag: Type): boolean {
        return this._tags.includes(tag)
    }

    public getEntries(): Array<Type> {
        return JSON.parse(JSON.stringify(this._tags)) // Deep Copy the array
    }
}


export type ChannelIdentifier = number
export type MessageIdentifier = number
export type UserIdentifier = number

export enum MessageType {
    NORMAL = 0,
    USER_JOIN = 1,
    USER_LEAVE = 2,
    NICKNAME_UPDATED = 3,
    SYSTEM = 4
}

export enum UserTags {
    PERM_CHANGE_NICKNAME = "perm_changenick"
}

export interface IMessage {
    content?: String
    messagetype?: MessageType
    userid: UserIdentifier
    timestamp: number
}

export class UniquerId {
    private _generated: number

    constructor(seed?: number) {
        this._generated = seed || 0
    }

    public getNext() {
        this._generated += 1
        return this._generated
    }
}

export class User {
    public profile: UserProfile
    public tags: TagGroup<UserTags>
    private _id: UserIdentifier

    constructor(id: UserIdentifier, profile: UserProfile) {
        this._id = id
        this.profile = profile
        this.tags = new TagGroup<UserTags>()
    }

    get id() { return this._id }
}

export class UserProfile {
    public nickname: String
    private _associatedUserId: UserIdentifier

    constructor(associatedUserId: UserIdentifier, nickname: String) {
        this._associatedUserId = associatedUserId
        this.nickname = nickname
    }

    get userid(): UserIdentifier { return this._associatedUserId }

    public toJSON() {
        return { nickname: this.nickname, userid: this.userid }
    }
}

export class UserManager {
    private _idGenerator: UniquerId
    private _users: Map<UserIdentifier, User>

    constructor() {
        this._idGenerator = new UniquerId()

        this._users = new Map<UserIdentifier, User>
    }

    public createUser(nickname: String): User {
        const id = this._idGenerator.getNext()
        const profile = new UserProfile(id, nickname)
        const user = new User(id, profile)
        this._insertUser(user)
        return user
    }

    public removeUser(id: UserIdentifier): boolean {
        return this._removeUser(id)
    }

    public getUserById(id: UserIdentifier): User | undefined {
        return this._users.get(id)
    }

    public getAllUsers(): Array<User> {
        return [...this._users.values()]
    }

    public getAllUserProfiles(): Array<UserProfile> {
        const userProfiles: Array<UserProfile> = this.getAllUsers().map((x) => x.profile)
        return userProfiles
    }

    private _insertUser(user: User): Map<UserIdentifier, User> {
        return this._users.set(user.id, user)
    }

    private _removeUser(id: UserIdentifier): boolean {
        return this._users.delete(id)
    }
}

export class NetUser {
    public user: User
    public socket: Socket
    constructor(user: User, socket: Socket) {
        this.user = user
        this.socket = socket
    }
}

export class Message implements IMessage {
    public userid: number
    public timestamp: number
    public content?: String | undefined
    public messagetype?: MessageType | undefined

    constructor(userid: number, timestamp: number, content?: String, messagetype?: MessageType) {
        this.userid = userid
        this.timestamp = timestamp
        this.content = content
        this.messagetype = messagetype
    }
}

// TODO: Complete the class
//! Do not use this while incomplete!
export class Channel {
    public userids: Array<UserIdentifier>

    constructor() {
        this.userids = []
    }
}