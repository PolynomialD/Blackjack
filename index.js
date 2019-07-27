const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow

const callback = () => {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 770
  })

  if (process.env.NODE_ENV !== 'production') mainWindow.toggleDevTools()

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

  mainWindow.on('closed', () => {
    app.quit()
  })
}

app.on('ready', callback)

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
  },
  {
    label: 'options',
    submenu: [
      {
        label:'toggle help sounds',
        accelerator: process.platform === 'darwin' ? 'Command+H' : 'Ctrl+H',
        click() {
          console.log('clicked')
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
