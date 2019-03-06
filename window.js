const electron = require('electron');
const url = require('url');
const path = require('path');
const {
    BrowserWindow
} = electron;

const window = (title, isForm, htmlFileName) => {
    let newWindow;
    if (isForm) {
        newWindow = new BrowserWindow({
            width: 300,
            height: 200,
            title: title,
        });
    } else {
        newWindow = new BrowserWindow({});
    }   

    //Renderizando HTML 
    newWindow.loadURL(url.format({
        pathname: path.join(__dirname, htmlFileName),
        protocol: 'file:',
        slashes: true,
    }));

    return newWindow;
}

module.exports = window;