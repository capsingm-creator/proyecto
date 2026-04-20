// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, Menu, MenuItem, ipcMain} = require('electron');
let mainWindow;
const path = require('node:path');

let templateAdmin =[
  {
    label: "Menu",
    submenu:[
      {
        label:"Stock Manage",
        click: (menuItem, browserWindow) => {
          if (browserWindow) browserWindow.webContents.send('navigation', 'stockManage');
        }
      },
      {
        label:"Sales and Invoicing",
        submenu:[
          {
            label:"Invoices",
            click: (menuItem, browserWindow) => {
              if (browserWindow) browserWindow.webContents.send('navigation', 'invoices');
            }
          },
          {
            label:"Clients",
            click: (menuItem, browserWindow) => {
              if (browserWindow) browserWindow.webContents.send('navigation', 'clients');
            }
          }
        ]
      },
      {
        type:"separator",
      },
      {
        label:"System Administration",
        submenu:[
          {
            label:"User Management",
            click: (menuItem, browserWindow) => {
              if (browserWindow) browserWindow.webContents.send('navigation', 'userManagment');
            }
          }
        ]
      },
      {
        type:"separator",
      },
      {
        label:"Exit",
        role:"close"
      },
    ]
  },
  {
    label: "Help",
    submenu:[
      {
        label: "User Guide",
      },
      {
        label: "About",
      }
    ]
  },
  {
    label:"dev",
    role:"toggleDevTools"
  }
];

let templateUser =[
  {
    label: "Menu",
    submenu:[
      {
        label:"Stock Manage",
        click: (menuItem, browserWindow) => {
          if (browserWindow) browserWindow.webContents.send('navigation', 'stockManage');
        }
      },
      {
        label:"Sales and Invoicing",
        submenu:[
          {
            label:"Invoices",
            click: (menuItem, browserWindow) => {
              if (browserWindow) browserWindow.webContents.send('navigation', 'invoices');
            }
          },
          {
            label:"Clients",
            click: (menuItem, browserWindow) => {
              if (browserWindow) browserWindow.webContents.send('navigation', 'clients');
            }
          }
        ]
      },
      {
        type:"separator",
      },
      {
        label:"Perfil",
        click:(menuItem, browserWindow) => {
              if (browserWindow) browserWindow.webContents.send('navigation', 'userPerfil');
            }
      },
      {
        type:"separator",
      },
      {
        label:"Exit",
        role:"close"
      },
    ]
  },
  {
    label: "Help",
    submenu:[
      {
        label: "User Guide",
      },
      {
        label: "About",
      }
    ]
  },
  {
    label:"dev",
    role:"toggleDevTools"
  }
];


function createMainWindow (userData) {
  const userGroup = userData.lpa_user_group ? userData.lpa_user_group.toLowerCase() : 'user';
  const selectedTemplate = (userGroup === 'admin') ? templateAdmin : templateUser;

  const menu = Menu.buildFromTemplate(selectedTemplate);
  Menu.setApplicationMenu(menu);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    backgroundColor: 'white',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile('index.html')
  mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-user-permissions', userData);
    });
}

function createLoginWindow () {
  let loginWindow;
  loginWindow = new BrowserWindow({
    width: 400,
    height: 550,
    backgroundColor: 'white',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  loginWindow.setMenu(null);
  loginWindow.loadFile('login.html')
  loginWindow.once('ready-to-show', () => {
    loginWindow.show();
  })

  ipcMain.once('login-success', (event, userData) => {
        loginWindow.close();
        createMainWindow(userData); 
    });
}

app.whenReady().then(()=>{
    createLoginWindow();
})