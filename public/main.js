import FS from "./events/file-system/FS"
import FSEvents from "./events/file-system/FSEvents"
import MainWindow from "./lib/Main.js"

const {app, BrowserWindow, ipcMain, ipcRenderer} = require("electron")

if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit()
}

const createWindow = () => {
    const {session} = require("electron")

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                "Content-Security-Policy": ["default-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; script-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; connect-src * 'self' data: blob: file: 'unsafe-inline' 'unsafe-eval'; img-src * 'self' data: blob: file: data: blob: 'unsafe-inline'; frame-src * 'self' data: blob: file:; style-src * 'self' data: blob: file: 'unsafe-inline';"]
            }
        })
    })
    new MainWindow()
    FSEvents()
    FS()
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


