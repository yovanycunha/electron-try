const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
} = electron;

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Esperando app estar pronto
app.on('ready', () => {
    //Criando Window
    mainWindow = new BrowserWindow({});

    //Renderizando HTML 
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true,
    }));
    
    //Sai do app quando fechar
    mainWindow.on('closed', ()=> {
        app.quit();
    });

    //Construindo o menu a partir do Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Inserindo o Menu
    Menu.setApplicationMenu(mainMenu)
});

//Lidando com Adicionar Item
function createAddWindow() {
    //Criando Window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Adicionando itens à lista de compras',
    });

    //Renderizando HTML 
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true,
    }));

    //Garbage Colletion 
    addWindow.on('close', ()=> {
        addWindow = null;
    });
}

//Capturando o item adicionado (item:add)
ipcMain.on('item:add', (e, item)=>{
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

//Template do Menu
const mainMenuTemplate = [{
    label: 'Arquivo',
    submenu: [{
            label: 'Adicionar Item',
            click() {
                createAddWindow()
            },
        },
        {
            label: 'Retirar todos os Itens',
            click(){
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Sair',
            click() {
                app.quit();
            },
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        }
    ]
}];


//Add dev menu se não estiver em Produção
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Toggle DevTools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                },
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            },
            {
                role: 'reload',
            },
        ]
    })
}