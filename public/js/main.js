import { getDirObjects } from "./api.js";
import { handleRender, openFile } from "./handlers.js";

let appPath = "root";

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

renderPage(appPath);
