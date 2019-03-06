const electron = require('electron');
const window = require('./window');

const {
    app,
    Menu,
    ipcMain,
} = electron;

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Esperando app estar pronto
app.on('ready', () => {
    mainWindow = window('', false, 'mainWindow.html');
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

    addWindow = window('Adicionando itens a lista de compras', true, 'addWindow.html');

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