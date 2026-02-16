require('dotenv').config();
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const db = require('./db/index.js');
const { registerIpcHandlers } = require('./ipc/index.js');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        minWidth: 400,
        minHeight: 500,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: !app.isPackaged,
        },
        autoHideMenuBar: true,
    });

    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
    }

    win.show();
}

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
    try {
        await db.sequelize.sync({ force: false });
        registerIpcHandlers();
        createWindow();
    } catch (error) {
        console.error(error);
    }
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});