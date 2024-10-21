require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});
console.log("main process working");
console.log('main.js');

const { app, BrowserWindow } = require('electron');
const path = require("path");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),  // Preload script for secure communication
            nodeIntegration: false,  // Disable node integration for security
            contextIsolation: true,  // Enable context isolation for security
            enableRemoteModule: false,
            webSecurity: true,  // Enable web security
            sandbox: true  // Recommended in production to isolate processes
        }
    });

    // Load the main index.html file
    win.loadFile(path.join(__dirname, "index.html"));

    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools(); 
    }

    win.on('closed', () => {
        win = null;
    });
}

// Set environment to 'development' for development mode
process.env.NODE_ENV = 'development';

// Create window when Electron is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
