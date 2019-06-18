const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

  mainWindow.on('closed', () => {
    app.quit()
  })
})

const menuTemplate = [
  {
    label: 'file',
    submenu: [
      {
        label:'quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({label: ''})
}

if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}
