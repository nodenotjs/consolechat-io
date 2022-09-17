import { Socket, Server } from 'socket.io'
import {Packets} from './packets'

export class NetUser {
    private _socket: Socket;
    private _nickname: String;

    constructor(socket: Socket, nickname?: String) {
        this._socket = socket;
        this._nickname = nickname || '';
    }

    get socket() {
        return this._socket;
    }

    get nickname() {
        return this._nickname;
    }
    set nickname(value) {
        this._nickname = value;
    }

    disconnect(reason?: string) {
        this._socket.emit(Packets.KICK, reason)
        this._socket.disconnect()
    }
}


export class NetUsersManager {
    private _users;

    constructor(netusers?: Array<NetUser>) {
        this._users = netusers || [];
    }

    get users() {
        return this._users
    }

    addUser(netuser: NetUser) {
        this._users.push(netuser);
    }

    removeUser(netuser: NetUser) {
        const indexOfUser = this._users.indexOf(netuser);
        this._users = this._users.slice(indexOfUser, 1);
    }
}