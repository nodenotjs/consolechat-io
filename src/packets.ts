import { UserIdentifier, UserProfile } from "./classes"

export enum Packets {
    // Reserved. Do not change
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',

    // Server
    MOTD = 'motd',
    MESSAGE = 'msg',
    UPDATE_PROFILE = 'updateprofile',
    REMOVE_PROFILE = 'removeprofile',
    YOUR_PROFILE = 'yourprofile',

    // Client
    RECEIVED_MSG = 'sendmsg'
}

export enum MessageType {
    NORMAL = 0,
    USER_JOIN = 1,
    USER_LEAVE = 2
}

export interface IPacket {/*foo*/ }

// SERVER
export interface IPMotd extends IPacket {
    message: Array<string>
    styles: Array<String>
}

export interface IPMessage extends IPacket
{
    content?: String,
    messagetype?: MessageType,
    userid: UserIdentifier
}

export interface IPUserProfile extends IPacket
{
    profile: UserProfile
}

export interface IPUpdateProfile extends IPacket
{
    profiles: Array<UserProfile>
}

export interface IPRemoveProfile extends IPacket
{
    userids: Array<UserIdentifier>
}

export interface IPYourProfile extends IPacket
{
    userid: UserIdentifier
}

// - CLIENT
export interface IPReceivedMessage extends IPacket
{
    message: String
}