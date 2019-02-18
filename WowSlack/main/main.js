const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow
} = electron;
const ipcMain = electron.ipcMain;

let MainWindow;
let ChildWindow;

app.on('ready', function () {
    MainWindow = new BrowserWindow({
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
    })
    ChildWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        parent: MainWindow
    })
    
    var isLogedInAlready = false; //need to implent this proper
    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../mainpage/MainPage.html'),
        protocol: 'file',
        slashes: true
    }));
    if (!isLogedInAlready) {

        ChildWindow.loadURL(url.format({
         //   pathname: path.join(__dirname, '../login/loginWindow.html'),
            pathname: path.join(__dirname, '../TryWebRTC/testingvoice.html'),
            protocol: 'file',
            slashes: true
        }));
    }
});

//reload function,this will reload all details into the mainPage.html
ipcMain.on('asynchronous-message', (event, args) => {
    ChildWindow.hide(); //when we do login,close the login window
    console.log("login")
    global.uid = args;
    MainWindow.webContents.send('info', args);
    MainWindow.webContents.send('loadProfilePage');

});

ipcMain.on('tabChangeProfile',(sender,args) =>{
    console.log("LoadProfilePage from main")
    MainWindow.webContents.send('loadProfilePage',args);
})

ipcMain.on('load-guildpage',(sender,args) =>{
     
    console.log("In main process");
    MainWindow.webContents.send('load-guildpage',args);
    
})

ipcMain.on('load-itemCalc', (sender,args)=>{

    console.log("item calc load call form main");
    MainWindow.webContents.send("load-itemCalc");
})

ipcMain.on('create-account', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../login/loginWindow.html'),
        protocol: 'file',
        slashes: true
    }));
});


ipcMain.on('sign-out', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../login/loginWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    ChildWindow.show(); //when we do login,close the login window
});

ipcMain.on('load-charCreate', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../createChar/charCreate.html'),
        protocol: 'file',
        slashes: true
    }));
    ChildWindow.show(); //when we do login,close the login window
});


ipcMain.on('load-guildCreate', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCreate/guildCreate.html'),
        protocol: 'file',
        slashes: true
    }));
    ChildWindow.show(); //when we do login,close the login window
});

ipcMain.on('load-guildChatpage', (event,args) => {
    console.log("load guild chat called in Main page"); 
     MainWindow.webContents.send("load-guildChatpage",args); 
})

