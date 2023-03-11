import fsp from "fs/promises";

const fileReader = (path) => {
  return new Promise((resolve, reject) => {
    fsp.readFile(path, "utf-8").then((r) => {
      resolve(r);
    });
  });
};

export { fileReader };
