import { Server, Socket } from "socket.io"
import { Packets } from "./packets"

export type ChannelIdentifier = number
export type MessageIdentifier = number
export type UserIdentifier = number

export enum MessageType {
    NORMAL = 0,
    USER_JOIN = 1,
    USER_LEAVE = 2
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
    private _id: UserIdentifier

    constructor(id: UserIdentifier, profile: UserProfile) {
        this._id = id
        this.profile = profile
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

    public getAllUserProfiles() : Array<UserProfile> {
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