const express = require('express');
const twilio = require('./twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('./utils/jwt');
const { response } = require('express');
const { getAccessTokenForVoice } = require('./twilio');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        const { token } = socket.handshake.query;
        try {
            const result = jwt.verifyToken(token)
            if (result.username) return next();
        } catch (error) {
            console.error(error)
        }
    }
})

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id)
    socket.emit('twilio-token', {token: getAccessTokenForVoice("chris")})
    socket.on('disconnect', () => {
        console.log('Socket disconnected')
    })
    socket.on('answer-call', (sid) => {
        console.log('Answering call with sid', sid)
    })
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3001;

app.get('/test', (req, res) => {
    res.send('Welcome to twilio');
})

app.post('/check-token', (req, res) => {
    const { token } = req.body;
    let isValidToken = false;
    try {
        isValidToken = jwt.verifyToken(token)
    } catch (error) {
        console.error(error)
    }
    res.send({ isValidToken })
})

app.post('/login', async (req, res) => {
    console.log('logging in');
    const { to, username, channel } = req.body;
    const data = await twilio.sendVerifyAsync(to, channel)
    res.send('Sent Code');
})

app.post('/verify', async (req, res) => {
    console.log('Verifying code');
    const { to, username, code } = req.body;
    const data = await twilio.verifyCodeAsync(to, code);
    if (data.status === 'approved') {
        const token = jwt.createJwt(username);
        return res.send({ token })
    }
    res.status(401).send('Invalid Token');
})

app.post('/call-new', (req, res) => {
    console.log("receiving new call")
    io.emit('call-new', { data: req.body })
    const response = twilio.voiceResponse("Thank you for your call. We will now put you on hold till the next attendent is available")
    res.send(response.toString())
})

app.post('/call-status-change', async (req, res) => {
    console.log("call status changed")
    res.send('OK')
})

app.post('/enqueue', (req, res) => {
    const response = twilio.enqueueCall('Customer Service');
    io.emit('enqueue', { data: req.body })
    res.type('text/xml')
    res.send(response.toString())
})

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
