import { Server, Socket } from "socket.io";
import { Packets } from "./packets";

export type ChannelIdentifier = number;
export type MessageIdentifier = number;
export type UserIdentifier = number;

export enum ChannelType {
    PUBLIC,
    PRIVATE
}

export class UniquerId {
    private _generated: number;

    constructor(seed?: number) {
        this._generated = seed || 0;
    }

    public getNext() {
        this._generated += 1;
        return this._generated;
    }
}

export class User {
    public profile: UserProfile
    private _id: UserIdentifier;

    constructor(id: UserIdentifier, profile: UserProfile) {
        this._id = id;
        this.profile = profile
    }

    get id() { return this._id }
}

export class UserProfile {
    public nickname: String
    private _associatedUserId: UserIdentifier;

    constructor(associatedUserId: UserIdentifier, nickname: String) {
        this._associatedUserId = associatedUserId;
        this.nickname = nickname
    }

    get userid(): UserIdentifier { return this._associatedUserId }

    toJSON() {
        return { nickname: this.nickname, userid: this.userid }
    }
}

export class UserManager {
    private _idGenerator: UniquerId
    private _users: Map<UserIdentifier, User>

    constructor() {
        this._idGenerator = new UniquerId();

        this._users = new Map<UserIdentifier, User>
    }

    public createUser(nickname: String): User {
        const id = this._idGenerator.getNext()
        const profile = new UserProfile(id, nickname)
        const user = new User(id, profile)
        this._insertUser(user)
        return user;
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
        const userProfiles: Array<UserProfile> = []
        this.getAllUsers().forEach((u) => {
            userProfiles.push(u.profile);
        })

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

export class Message {
    public content: String
    public author: User
    private _id: MessageIdentifier

    constructor(id: MessageIdentifier, content: String, author: User) {
        this._id = id;
        this.content = content
        this.author = author;
    }

    public get id(): MessageIdentifier { return this._id }
}

export class Channel {
    public channelType: ChannelType
    public creator: UserIdentifier
    private _messages: Array<Message>
    private _id: ChannelIdentifier

    constructor(id: ChannelIdentifier, channelType: ChannelType, creator: UserIdentifier) {
        this._id = id;
        this.channelType = channelType;
        this.creator = creator;

        this._messages = []
    }

    public get id(): ChannelIdentifier { return this._id }
}

export class ChannelManager {
    private _idGenerator: UniquerId
    private _channels: Map<ChannelIdentifier, Channel>

    constructor() {
        this._idGenerator = new UniquerId();
        this._channels = new Map<ChannelIdentifier, Channel>
    }

    public createChannel(channelType: ChannelType, creator: UserIdentifier): Channel {
        const channelId = this._idGenerator.getNext()
        const newChannel = new Channel(channelId, channelType, creator)
        this._insertChannel(newChannel);
        return newChannel;
    }

    public deleteChannel(channelId: ChannelIdentifier): boolean {
        return this._removeChannel(channelId);
    }

    public getChannelCount(): number {
        return this._channels.size;
    }

    public getChannelById(id: ChannelIdentifier): Channel | undefined {
        return this._channels.get(id);
    }

    private _insertChannel(channel: Channel): Map<ChannelIdentifier, Channel> {
        return this._channels.set(channel.id, channel);
    }

    private _removeChannel(channelId: ChannelIdentifier): boolean {
        return this._channels.delete(channelId);
    }

}