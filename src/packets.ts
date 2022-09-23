import { UserIdentifier, UserProfile } from "./classes"

export enum Packets {
    // Reserved. Do not change
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',

    // Server
    MOTD = 'motd',
    MESSAGE = 'msg',

    // Client
    RECEIVED_MSG = 'sendmsg',
    REQUEST_PROFILE = 'req-profile'
}

export interface IPacket {/*foo*/ }

// SERVER
export interface IPMotd extends IPacket {
    message: String
    styles: Array<String>
}
export class PMotd implements IPMotd {
    public message: String
    public styles: Array<String>

    constructor(message: String, ...styles: Array<String>) {
        this.message = message
        this.styles = styles
    }
}

export interface IPMessage extends IPacket
{
    message: String,
    author: UserIdentifier
}
export class PMessage implements IPMessage
{
    public message: String
    public author: UserIdentifier

    constructor(message: String, author: UserIdentifier) {
        this.message = message
        this.author = author
    }
}

export interface IPUserProfile extends IPacket
{
    profile: UserProfile
}
export class PUserProfile implements IPUserProfile {
    public profile: UserProfile

    constructor(profile: UserProfile) {
        this.profile = profile
    }
}


// - CLIENT
export interface IPReceivedMessage extends IPacket
{
    message: String
}
export class PReceivedMessage implements IPReceivedMessage
{
    public message: String

    constructor(message: String) {
        this.message = message
    }
}

export interface IPRequestUserProfile extends IPacket
{
    profileId: UserIdentifier
}
export class PRequestUserProfile implements IPRequestUserProfile {
    public profileId: UserIdentifier

    constructor(profileId: UserIdentifier) {
        this.profileId = profileId
    }
}