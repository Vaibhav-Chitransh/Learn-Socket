import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => {
    return io("http://localhost:3000");
  }, []);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [socketId, setSocketId] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log(`connected ${socket.id}`);
    });

    socket.on('receive-message', (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (msg) => console.log(msg));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
    setRoom('');
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room', roomName);
    setRoomName('');
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" component="div" gutterBottom>
        Welcome {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          id="outlined-basic"
          label="room name"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>

      <Stack>
        {
          messages.map((msg, idx) => (
            <Typography key={idx} variant="h6" component='div' gutterBottom>
              {msg}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  );
};

export default App;
