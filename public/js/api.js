async function getDirObjects(path) {
  return await axios.get("http://localhost:3000/api/getDirObjects", {
    params: {
      path: path,
    },
  });
}

async function getFileContent(path) {
  return await axios.get("http://localhost:3000/api/getFileContent", {
    params: {
      path: path,
    },
  });
}

export { getDirObjects, getFileContent };
