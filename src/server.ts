import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import { slog } from './utils'
import settings from './server_config.json'

var DEBUG: boolean = true
const PORT: any = process.env.PORT || 3000

const app = express()
app.use(express.static(__dirname + '/../public'))
const httpServer = new http.Server(app)
const io = new socketio.Server(httpServer, {
    serveClient: false,
})

httpServer.listen(PORT, () => {
    console.log(`Server started! Listening ${PORT}`)
})



