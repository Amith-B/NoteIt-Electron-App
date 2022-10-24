const { contextBridge } = require("electron");
const fs = require("fs");

contextBridge.exposeInMainWorld("fs", {
  readFile: fs.readFile,
  writeFile: fs.writeFile,
});
