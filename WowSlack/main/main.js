const electron = require('electron');
const url = require('url');
const path = require('path');
const request = require('request');

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
        minHeight: 900,
        maxWidth : 1281,
        maxHeight : 800,
        frame: false,
        icon : path.join(__dirname, '../assets/ws.png')
    })
    MainWindow.on("close", (evt) => {
        app.quit();
    });
     MainWindow.hide(); //dont want to show this until user logs in

    let $ = require('jquery');
    MainWindow.$ = $;
    ChildWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
      //  autoHideMenuBar : true,
        parent: MainWindow
    })

    ChildWindow.on("close", (evt) => {
        evt.preventDefault();    
        ChildWindow.hide();
    });

    var isLogedInAlready = false; //need to implent this proper
    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../mainpage/MainPage.html'),
        protocol: 'file',
        slashes: true,
        show: false
    }));
    if (!isLogedInAlready) {

        ChildWindow.loadURL(url.format({
           pathname: path.join(__dirname, '../login/loginWindow.html'),
          //pathname: path.join(__dirname, '../TheTutoiralIFondOnYoutube/workplz.html'),
            protocol: 'file',
            slashes: true,
            show: false
        }));

        ChildWindow.once('ready-to-show', () => {
            child.show()
        })
    }

    request('https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=cc03f6bfa99541d9b2644e450b96eadf&client_secret=e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI', {
        json: true
    }, (err, res, body) => {

        global.Token = body.access_token
    })


});

//reload function,this will reload all details into the mainPage.html
ipcMain.on('asynchronous-message', (event, args) => {
    ChildWindow.hide(); //when we do login,close the login window

    global.uid = args
    MainWindow.show();
    MainWindow.webContents.send('info', args);
    MainWindow.webContents.send('loadProfilePage');

});

ipcMain.on('tabChangeProfile', (sender, args) => {


    MainWindow.webContents.send('loadProfilePage');
})

ipcMain.on('load-guildpage', (sender, args) => {
    MainWindow.webContents.send('load-guildpage', args);
});

ipcMain.on('load-itemCalc', (sender, args) => {

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

ipcMain.on("storeUserDetails", (event, userDetails) => { //handly way I can set global vars for the users when logging in

    global.userDetails = userDetails;

});

ipcMain.on("storeAuthToken", (event, authToken) => { //store the Auth token in the global namespace

    global.Token = authToken;
});

ipcMain.on('sign-out', (event, args) => {
    MainWindow.hide();
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

ipcMain.on("load-Guild", (event,args) =>{
    global.loadGuildID = args;
})
ipcMain.on('load-guildChatpage', (event, args, args2) => {

    MainWindow.webContents.send("load-guildChatpage", args, args2);
})

ipcMain.on('load-guildEventPage', (event, args) => {
    global.Gid = args; //fucking terrible idea,really bad

    MainWindow.webContents.send("load-guildEventPage", args);
});

ipcMain.on('load-eventCreate', (event, args) => {
    global.Gid = args; //fucking terrible idea,really bad
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCalendar/AddEvent/AddEvent.html'),
        protocol: 'file',
        show: false,
        slashes: true
    }));

    ChildWindow.show();
});

ipcMain.on('load-eventEdit', (sender,args) =>{
    console.log("Hmm little kiten")
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCalendarV2/EventEdit/eventEdit.html'),
        protocol: 'file',
        show: false,
        slashes: true
    }));
        global.editEventID = args;
        ChildWindow.show();
});

ipcMain.on('eventAdded', () =>{
    ChildWindow.hide();
})

ipcMain.on('eventUpdated', () =>{
    ChildWindow.hide();
})
ipcMain.on('toggleLoaderOff', () =>{
    MainWindow.webContents.send('toggleLoaderOff');
})