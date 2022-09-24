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

export interface IPMessage extends IPacket
{
    message: String,
    author: UserIdentifier
}

export interface IPUserProfile extends IPacket
{
    profile: UserProfile
}


// - CLIENT
export interface IPReceivedMessage extends IPacket
{
    message: String
}

export interface IPRequestUserProfile extends IPacket
{
    profileId: UserIdentifier
}