import express from 'express'
import { instrument } from '@socket.io/admin-ui'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

const app = express()

app.use(cors())

const server = http.createServer(app)

const PORT = process.env.PORT || 3000

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
})

const rooms = {}

io.on('connection', socket => {
  socket.emit('hi', 'connected to socket')
  socket.on('new-game-ID', (socketID, roomID) => {
    rooms.roomID = [socketID]
    socket.join(roomID)
  })

  socket.on('connect-to-game', (roomID) => {

    if (rooms.roomID?.length < 2) {
      rooms.roomID.push(socket.id)
      socket.join(roomID)
      socket.to(roomID).emit('player-joined', 'player joined')
    } else {
      socket.emit('room-is-full', 'Sorry, seems this room is full!')
      return
    }
  })

  socket.on('move-played', (pieceOnField) => {
    socket.broadcast.emit('piece-on-field', pieceOnField)
  })

  socket.on('choosen-side', color => {
    socket.broadcast.emit('player-choosen-color', color)
  })

  socket.on('choosen-time', choosenRange => {
    socket.broadcast.emit('player-choosen-time', choosenRange)
  })

  socket.on('restart-game', () => {
    socket.broadcast.emit('player-restarted-game')
  })

  socket.on('player-accepting-restart', () => {
    socket.broadcast.emit('player-accepted-restart')
  })

})

server.listen(PORT, () => {
  console.log('server started!');
})

instrument(io, { auth: false })