import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { sendMessage, getTextMessageInput } from './service/service.js'

dotenv.config()

const isConected = 'is_conected'
const temperature = 'temperature'
const hardcodedToken = process.env.TOKEN
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
    if (!conectionStatus) {
      // service('conexion_perdida')
    }
    io.emit(isConected, conectionStatus)
  })

  socket.on(temperature, (temperature) => {
    console.log('temperature: ' + temperature)
    if (temperature > 10) {
      // service('heladera_caliente')
    }
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
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Send')
})

app.post('/test', function (req, res, next) {
  const data = getTextMessageInput(process.env.RECIPIENT_WAID, 'Welcome to the Movie Ticket Demo App for Node.js!')

  sendMessage(data)
    .then(function (response) {
      res.redirect('/')
      res.sendStatus(200)
    })
    .catch(function (error) {
      console.log(error)
      console.log(error.response.data)
      res.sendStatus(500)
    })
})

server.listen(port, () => {
  console.log('listen on port ' + port)
})
