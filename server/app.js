import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';

const PORT = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello bhai");
})

io.on("connection", (socket) => {
    console.log(`Client Connected ${socket.id}`);

    socket.emit('welcome', `Welcome to the server`);   // msg will go to all the servers
    socket.broadcast.emit('welcome', `${socket.id} joined the server`);   // msg will go to all servers except the current one (from which we are reloading)

    socket.on('disconnect', () => console.log(`Client Disconnected ${socket.id}`));

    socket.on('message', ({message, room}) => {
        console.log(message, room);
        io.to(room).emit('receive-message', message); // msg will go to all the servers
    });

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Client joined ${room}`);
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});