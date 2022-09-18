export enum Packets {
    // Reserved. Do not change
    CONNECTION = 'connection',
    DISCONNECTION = 'disconnect',

    // Custom
    KICK = 'kicked',
    UPDATE_NICK = 'update-nick'
}

export interface IPacket {/*foo*/ }

export interface IPUpdateNickname extends IPacket {
    newnick: String
}

export interface IPKicked extends IPacket {
    reason: String
}


export class PKicked implements IPKicked {
    public reason: String
    constructor(reason: String) {
        this.reason = reason
    }
}

export class PUpdateNickname implements IPUpdateNickname {
    public newnick: String
    constructor(newnick: String) {
        this.newnick = newnick
    }
}
