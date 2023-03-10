import path from "path";
import { readDir } from "./server/dirReader.js";
import { fileURLToPath } from "url";
import { fileReader } from "./server/fileReader.js";

import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { Worker } from "worker_threads";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let rootFolder = path.join(process.cwd());
let usersOnline = 0;

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/api/getDirObjects", (req, res) => {
  if (
    req.query.path.slice("/").length < rootFolder.slice("/").length ||
    req.query.path === rootFolder ||
    req.query.path === "root"
  ) {
    readDir(rootFolder).then((result) =>
      res.send({ success: true, result: result })
    );
  } else {
    readDir(path.join(req.query.path)).then((result) =>
      res.send({ success: true, result: result })
    );
  }
});

app.get("/api/getFileContent", function (req, res) {
  fileReader(path.join(req.query.path)).then((result) => {
    res.send({ success: true, result: result });
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  usersOnline += 1;
  socket.emit("CONN_EVENT", {
    msg: `Пользователей онлайн: ${usersOnline}`,
  });
  socket.broadcast.emit("CONN_EVENT", {
    msg: `Пользователей онлайн: ${usersOnline}`,
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    usersOnline -= 1;
    socket.emit("CONN_EVENT", {
      msg: `Пользователей онлайн: ${usersOnline}`,
    });
    socket.broadcast.emit("CONN_EVENT", {
      msg: `Пользователей онлайн: ${usersOnline}`,
    });
  });
  socket.on("CLIENT_SEARCH", (data) => {
    start(data)
      .then((result) => {
        socket.emit("SERVER_MSG", {
          counter: result.data.counter,
          output: result.data.output,
        });
      })
      .catch((err) => console.error(err));
  });
});

function start(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./server/worker.js", { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
  });
}
server.listen(port, () => {
  console.log(`Server listening on *:${port}`);
});
