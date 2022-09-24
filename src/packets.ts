import { UserIdentifier, UserProfile } from "./classes"

export enum Packets {
    // Reserved. Do not change
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',

    // Server
    MOTD = 'motd',
    MESSAGE = 'msg',
    USER_JOIN = 'userjoin',
    USER_LEAVE = 'userleave',
    UPDATE_PROFILE = 'updateprofile',
    REMOVE_PROFILE = 'removeprofile',
    YOUR_PROFILE = 'yourprofile',

    // Client
    RECEIVED_MSG = 'sendmsg'
}

export interface IPacket {/*foo*/ }

// SERVER
export interface IPMotd extends IPacket {
    message: Array<string>
    styles: Array<String>
}

export interface IPMessage extends IPacket
{
    message: String,
    userid: UserIdentifier
}

export interface IPUserProfile extends IPacket
{
    profile: UserProfile
}

export interface IPUserJoin extends IPacket
{
    userid: UserIdentifier
}

export interface IPUserLeave extends IPacket
{
    userid: UserIdentifier
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