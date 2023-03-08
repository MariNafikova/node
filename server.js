const http = require("http");
const fs = require("fs");
const path = require("path");
const io = require("socket.io");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");
const crypto = require("crypto");
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

const app = http.createServer((request, response) => {
  if (request.method === "GET") {
    const filePath = path.join(__dirname, "index.html");
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
  } else if (request.method === "POST") {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", () => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      response.writeHead(200, { "Content-Type": "json" });
      response.end(data);
    });
  } else {
    response.statusCode = 405;
    response.end();
  }
});

const socketIO = io(app);
const randomId = () => crypto.randomBytes(8).toString("hex");
socketIO.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;

      socket.broadcast.emit("RECONN_EVENT", {
        msg: `${socket.username} переподключился!`,
      });

      return next();
    }
  }
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });
  console.log("generate username: ", username);
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  socket.broadcast.emit("CONN_EVENT", {
    msg: `${socket.username} подключился!`,
  });
  next();
});
socketIO.on("connection", async function (socket) {
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("DISCONN_EVENT", {
      msg: `${socket.username} отключился!`,
    });
  });
  socket.on("CLIENT_MSG", (data) => {
    socket.emit("SERVER_MSG", { msg: data.msg });
    socket.broadcast.emit("SERVER_MSG", { msg: data.msg });
  });
});

app.listen(3000, "localhost");
