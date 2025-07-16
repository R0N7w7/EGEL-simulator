const { app, BrowserWindow, ipcMain, Notification } = require('electron');
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
            nodeIntegration: true,
            contextIsolation: true,
            devTools: false,
        },
        autoHideMenuBar: true,
    });

    if (!app.isPackaged) {
        // No está empaquetado = modo desarrollo
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        // Está empaquetado = producción
        win.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
    }

    win.show();
}

app.whenReady().then(async () => {
    try {
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