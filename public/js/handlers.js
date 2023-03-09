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
    document.getElementById("file-content").innerHTML = res.data.result;
  });
}
