import { UserIdentifier, UserProfile, MessageType, IMessage } from "./classes"

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
    RECEIVED_MSG = 'sendmsg',
    RECEIVED_UPDATE_NICKNAME = 'updatenick'
}

export interface IPacket {/*foo*/ }

// SERVER
export interface IPMotd extends IPacket {
    message: Array<string>
    styles: Array<String>
}

export interface IPMessage extends IMessage, IPacket
{
    
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

export interface IPReceivedUpdateNickname extends IPacket
{
    nickname: String
}