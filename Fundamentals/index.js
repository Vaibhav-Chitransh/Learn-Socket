import express from "express";
import { createServer } from "node:http";
import path from "path";
import { fileURLToPath } from "node:url";
import {Server} from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat-message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat-message', msg); // in order to send the event to everyone including myself
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

server.listen(3000, () => console.log("Server is running at port: 3000"));