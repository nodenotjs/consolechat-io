export enum Packets {
    // Reserved
    //CONNECTION = 'connection',
    //DISCONNECTION = 'disconnect',

    // Custom
    REQUEST_HANDSHAKE = 'req-handshake',
    HANDSHAKE = 'handshake',
    KICK = 'kick'
}

export type PHandshake = {
    nickname: String
}