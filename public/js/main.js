import { getDirObjects } from "./api.js";
import { handleRender, openFile } from "./handlers.js";

let appPath = "root";
let socket = io();

socket.on("CONN_EVENT", function (data) {
  document.getElementById("online-counter").innerHTML = data.msg;
});

function renderPage(path) {
  getDirObjects(path).then((res) => {
    path = res.data.result.path;
    appPath = res.data.result.path;
    handleRender(res).then(() => {
      document.querySelectorAll("#folder-el").forEach((elem) => {
        elem.addEventListener("click", (e) => {
          path += "/" + e.srcElement.childNodes[0].data;
          appPath += "/" + e.srcElement.childNodes[0].data;
          renderPage(path);
        });
      });
      document.querySelectorAll("#file-el").forEach((elem) => {
        elem.addEventListener("click", (e) => {
          let filePath = path + "/" + e.srcElement.childNodes[0].data;
          openFile(filePath);
        });
      });
    });
  });
}
document.getElementById("routeBack").addEventListener("click", () => {
  let route = appPath.split("/").slice(0, -1).join("/");
  renderPage(route);
});

document.getElementById("searchButton").onclick = function () {
  socket.emit("CLIENT_SEARCH", {
    search: {
      text: document.getElementById("file-content").innerHTML,
      findString: document.getElementById("searchInput").value,
    },
  });
  document.getElementById("searchInput").value = "";
};

socket.on("SERVER_MSG", function (data) {
  const textArea = document.getElementById("file-content");
  const matchesFound = document.getElementById("matches-found");
  textArea.innerHTML = data.output;
  matchesFound.innerHTML = data.counter;
  textArea.setAttribute("style", "height:" + 0);
  textArea.setAttribute("style", "font-family: monospace;");
  textArea.setAttribute("style", "white-space: pre;");
  textArea.setAttribute(
    "style",
    "height:" + textArea.scrollHeight + "px;overflow-y:hidden;"
  );
});

renderPage(appPath);
