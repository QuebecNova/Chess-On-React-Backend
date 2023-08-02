import { Server } from 'socket.io'
import http from 'http'
import { app } from '../app'

const server = http.createServer(app)

const PORT = process.env.SOCKET_PORT || 3002

const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
})

const rooms: { [key: string]: string[] } = {}

io.on('connection', (socket) => {
    let currentRoomID: string = ''

    socket.emit('hi', 'connected to socket')

    socket.on('new-game-ID', (roomID) => createNewRoom(roomID))

    socket.on('connect-to-game', (roomID) => connectToGame(roomID))

    socket.on('move-played', (pieceOnField) => sendPlayedMove(pieceOnField))

    socket.on('choosen-side', (color) => sendChoosenColor(color))

    socket.on('choosen-time', (choosenRange) => sendChoosenTime(choosenRange))

    socket.on('restart-game', sendRestartRequest)

    socket.on('player-accepting-restart', acceptRestart)

    socket.on('send-message', (msg) => sendMessage(msg))

    socket.on('disconnect', () => disconnect(currentRoomID))

    function createNewRoom(roomID: string) {
        rooms[roomID] = [socket.id]
        socket.join(roomID)
    }

    function connectToGame(roomID: string) {
        if (!rooms[roomID] || !roomID) {
            socket.emit('room-error', 'Sorry, seems this room is not exist!')
            return
        }

        if (rooms[roomID]?.length > 2) {
            socket.emit('room-error', 'Sorry, seems this room is full!')
            return
        }

        rooms[roomID].push(socket.id)
        socket.join(roomID)
        socket.emit('room-valid')
        currentRoomID = roomID
        socket.to(roomID).emit('player-joined', 'player joined')
    }

    function sendPlayedMove(pieceOnField) {
        socket.broadcast.emit('piece-on-field', pieceOnField)
    }

    function sendChoosenColor(color) {
        socket.broadcast.emit('player-choosen-color', color)
    }

    function sendChoosenTime(choosenRange) {
        socket.broadcast.emit('player-choosen-time', choosenRange)
    }

    function sendRestartRequest() {
        socket.broadcast.emit('player-restarted-game')
    }

    function acceptRestart() {
        socket.broadcast.emit('player-accepted-restart')
    }

    function sendMessage(msg) {
        socket.broadcast.emit('new-message', msg)
    }

    function disconnect(currentRoomID) {
        if (rooms?.[currentRoomID]) {
            const indexOfSocket = rooms[currentRoomID].indexOf(socket.id)
            rooms[currentRoomID].splice(indexOfSocket, 1)
            currentRoomID = ''
        }
    }
})

server.listen(PORT, () => {
    console.log('Socket started on port ' + PORT)
})
