import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const isConected = 'is_conected'
const temperature = 'temperature'
const hardcodedToken = 'miTokenSecreto'
const port = process.env.PORT ?? 3000

const app = express()

const server = createServer(app)
const io = new Server(server)

const accessControlMiddleware = (socket, next) => {
  const clientToken = socket.handshake.query.token

  if (clientToken === hardcodedToken) {
    return next()
  }
  return next(new Error('Acceso no autorizado'))
}

io.use(accessControlMiddleware)

io.on('connection', (socket) => {
  console.log('a user connected')
  io.emit(isConected, true)
  io.emit(temperature, null)

  socket.on(isConected, (conectionStatus) => {
    io.emit(isConected, conectionStatus)
  })

  socket.on(temperature, (temperature) => {
    console.log('temperature: ' + temperature)
    io.emit(temperature, temperature)
  })

  socket.on('error', (err) => {
    console.log('error: ' + err)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    io.emit(isConected, false)
  })
})

app.use(logger('dev'))

app.get('/', (_, res) => {
  res
    .status(200)
    .send('Hello word')
})

server.listen(port, () => {
  console.log('listen on port ' + port)
})
