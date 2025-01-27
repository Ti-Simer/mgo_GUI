const { app, BrowserWindow, screen, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Crea la ventana sin barra de título incorporada
  win = new BrowserWindow({
    width: 1366,
    height: 650,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  // Desactiva el menú predeterminado
  Menu.setApplicationMenu(null);

  // Maximiza la ventana al inicio
  win.maximize();

  //win.webContents.openDevTools();

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'sistema_registros', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
