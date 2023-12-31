import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { sendMessage } from './service/service.js'

dotenv.config()

const isConected = 'is_conected'
const temperature = 'temperature'
var temperatureValue = 0
// const hardcodedToken = process.env.TOKEN
const port = process.env.PORT ?? 3000

const app = express()

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

// const accessControlMiddleware = (socket, next) => {
//   const clientToken = socket.handshake.query.token

//   if (clientToken === hardcodedToken) {
//     return next()
//   }
//   return next(new Error('Acceso no autorizado'))
// }

// io.use(accessControlMiddleware)

io.on('connection', (socket) => {
  console.log('a user connected')
  sendMessage('conexion_perdida')
  io.emit(isConected, true)
  io.emit(temperature, null)

  //TODO: VALIDAR DATOS
  socket.on(isConected, (conectionStatus) => {
    if (!conectionStatus) {
      sendMessage('conexion_perdida')
    }
    io.emit(isConected, conectionStatus)
  })

  socket.on(temperature, (temperatureSocket) => {
    console.log('temperature: ' + temperatureSocket)
    temperatureValue = temperature
    if (temperatureSocket > 10) {
      sendMessage('heladera_caliente')
    }
    io.emit(temperature, temperatureSocket)
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
  sendMessage('heladera_caliente')
    .then(function (response) {
      console.log('response: ' + response)
      res.send('Funciono')
    })
    .catch(function (error) {
      console.log(error)
      console.log(error.response?.data)
      res.sendStatus(500)
    })
})

server.listen(port, () => {
  console.log('listen on port ' + port)
})
