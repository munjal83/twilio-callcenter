const express = require('express');
const twilio = require('./twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id)
    socket.on('disconnect', () => {
        console.log('Socket disconnected')
    })
})

app.use(bodyParser.json());
app.use(cors())

const PORT = 3001;

app.get('/test', (req, res) => {
    res.send('Welcome to twilio');
})

app.post('/login', async (req, res) => {
    console.log('logging in');
    const {to, userName, channel} = req.body;
    const data = await twilio.sendVerifyAsync(to, channel)
    res.send(data)
})

app.post('/verify', async (req, res) => {
    console.log('Verifying code');
    const {to, code} = req.body;
    const data = await twilio.verifyCodeAsync(to, code)
    res.send(data);
})

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})
