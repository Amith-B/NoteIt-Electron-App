const { contextBridge } = require("electron");
const path = require("path");
const fs = require("fs");

contextBridge.exposeInMainWorld("path", {
  getFilePath: (relativeURL) => path.join(__dirname, relativeURL),
});

contextBridge.exposeInMainWorld("fs", {
  readFile: fs.readFile,
  writeFile: fs.writeFile,
});
