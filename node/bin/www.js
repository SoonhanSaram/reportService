/**
 * http Server Setting
 */
import http from 'http';
import app from './app.js';
import createDebug from 'debug';
import { Server } from 'socket.io';

// port number check
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) {
    return val;
  }

  // well Known Port greate then
  if (port >= 1024) {
    return port;
  }
  return false;
};


const debug = createDebug('report:server');
const port = normalizePort(process.env.PORT || "3010");

/**
 * Create HTTP server.
 * http and app(express framework) integration
 */
const server = http.createServer(app);

let sockets = {};

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  const socketId = socket['id'];
  const company = socket['userBelongto'];

  // console.log('socketId', socketId);

  console.log(sockets);
  // console.log('connect 소켓', socket);
  if (sockets[socketId]) {
    // 중복된 socketId가 존재한다면 기존에 존재하는 소켓을 disconnect 시키는 함수를 만들어줘야 한다.
    socket.disconnect();
  } else {
    sockets[socketId] = socket;
  }


  socket.on('joinRoom', () => {
    socket.join(company);
    console.log(socketId);
    // const count = countPeople(id.corporation);
    io.to(company).emit('msg', `${socketId}님이 입장하셨습니다.`);
  });

  socket.on('msg', (msg) => {
    msg === '' || null ? null : io.to(company).emit('msg', msg);
    console.log(msg);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(company);
    io.to(company).emit('msg', `${socketId}님이 퇴장하셨습니다.`);
  });
})


server.listen(port);

// Event listener for HTTP server "error" event.
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Event listener for HTTP server "listening" event.
server.on("listening", () => {
  const addr = server.address();
  console.log(addr);
  const bind =
    typeof addr === "string"
      ? `address : ${addr.address}, port : ${addr.port}`
      : `address : ${addr.address}, port : ${addr.port}`;
  debug("Http Listening on " + bind);
  console.log(`Http Listening on http://localhost:${addr.port}`);
});
