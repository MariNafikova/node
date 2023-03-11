import { workerData, parentPort } from "worker_threads";
import { searchInFile } from "./searcher.js";

searchInFile(workerData).then((result) => {
  parentPort.postMessage({ data: result });
});
