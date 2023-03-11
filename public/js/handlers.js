import { getFileContent } from "./api.js";

// export function handleClickOnFolder(event, path) {
//   // console.log("click on folder: ", event.srcElement.childNodes[0].data, path);
// }
export function handleRender(response) {
  return new Promise((resolve, reject) => {
    document.getElementById("explorer").innerHTML = "";
    response.data.result.folders.forEach((el) => {
      document
        .getElementById("explorer")
        .insertAdjacentHTML(
          "beforeend",
          `<img src=images/folder.png /><span id="folder-el" class="link">${el}</span>`
        );
      document.getElementById("explorer").append(document.createElement("br"));
    });
    response.data.result.files.forEach((el) => {
      document
        .getElementById("explorer")
        .insertAdjacentHTML(
          "beforeend",
          `<img src=images/file.png /><span id="file-el" class="link">${el}</span>`
        );
      document.getElementById("explorer").append(document.createElement("br"));
    });
    resolve();
  });
}

export function openFile(path) {
  getFileContent(path).then((res) => {
    const textArea = document.getElementById("file-content");
    textArea.innerHTML = res.data.result;
    textArea.setAttribute("style", "height:" + 0);
    textArea.setAttribute(
      "style",
      "height:" + textArea.scrollHeight + "px;overflow-y:hidden;"
    );
  });
}
