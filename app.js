import express from "express";
import path from "path";
import { readDir } from "./server/dirReader.js";
import { fileURLToPath } from "url";
import { fileReader } from "./server/fileReader.js";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let rootFolder = path.join(process.cwd());

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
