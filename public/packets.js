class IPacket {}
// Server side

class PStyledMessage extends IPacket {
    constructor(message, ...styles) {
        this.message = message
        this.styles = styles    
    }
}