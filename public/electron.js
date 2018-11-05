// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
// https://github.com/electron/electron/blob/master/docs/api/chrome-command-line-switches.md#supported-chrome-command-line-switches
// app.commandLine.appendSwitch('remote-debugging-port', '8315')
// app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')

const path = require('path');
// const url = require('url');

// const isDev = require('electron-is-dev');
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;

const { networkInterfaces, getNetworkInterfaces } = require('os');

exports.networkInterfaces = networkInterfaces;
exports.getNetworkInterfaces = getNetworkInterfaces;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 900, height: 900 });

  // and load the index.html of the app.
  console.info(`isDev is ${isDev}`);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  
  console.info(`networkInterfaces: ${JSON.stringify(networkInterfaces())}`)
  mainWindow.webContents.send('networkInterfaces', networkInterfaces());

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
