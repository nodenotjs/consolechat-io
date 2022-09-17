import express from 'express'
import socketio from 'socket.io'
import http from 'http'
import { Console } from 'console'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.static(__dirname + '/../public'))
const httpServer = new http.Server(app)
const io = new socketio.Server(httpServer, {
    serveClient: false,
})


httpServer.listen(PORT, () => {
    console.log(`Server started! Listening ${PORT}`)
})

var clients: Map<string, socketio.Socket> = new Map<string, socketio.Socket>;

io.on('connection', (client) => {
    console.log(`New connection: ${client.id}!`)
    clients.set(client.id, client)

    // Código apenas para teste.
    // Retorna os usuários para o cliente
    client.on('list-users', (callback: any) => {
        let res = [];

        for (const c of clients) {
            res.push(c[0])
        }

        callback(res)
        console.log(`Callbacking clients: ${res}`)
    })

    client.on('disconnect', (reason: string) => {
        console.log(`Disconnection: ${client.id}! Reason: ${reason}`)
        clients.delete(client.id)
    })
})