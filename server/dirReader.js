import path from "path";
import fsp from "fs/promises";

function checkObject(object, dir, resolve, reject) {
  const fullPath = path.join(dir, object);
  const stat = fsp.stat(fullPath);
  stat.then((r) => {
    if (r.isFile()) {
      resolve();
    } else {
      reject();
    }
  });
}

const readDir = (dir) => {
  let currentDirObjects = {
    path: dir,
    folders: [],
    files: [],
  };
  return fsp.readdir(dir).then((objects) => {
    let result = objects.map((object) => {
      return new Promise((resolve, reject) => {
        checkObject(object, dir, resolve, reject);
      })
        .then(() => currentDirObjects.files.push(object))
        .catch(() => currentDirObjects.folders.push(object));
    });

    return Promise.all(result).then(() => {
      return currentDirObjects;
    });
  });
};

export { readDir };
