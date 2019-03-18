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
        minHeight: 800,
    })
  //  MainWindow.hide(); //dont want to show this until user logs in
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
           pathname: path.join(__dirname, '../TheTutoiralIFondOnYoutube/workplz.html'),
            protocol: 'file',
            slashes: true
        }));
    }
    request('https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=cc03f6bfa99541d9b2644e450b96eadf&client_secret=e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI', {
        json: true
    }, (err, res, body) => {
        console.log(body.access_token)
        global.Token = body.access_token
    })


});

//reload function,this will reload all details into the mainPage.html
ipcMain.on('asynchronous-message', (event, args) => {
    MainWindow.show();
    ChildWindow.hide(); //when we do login,close the login window
    console.log("login" + " " + args)
    global.uid = args 
   MainWindow.webContents.send('info', args);
    MainWindow.webContents.send('loadProfilePage');

});

ipcMain.on('tabChangeProfile',(sender,args) =>{
    console.log("LoadProfilePage from main")
    MainWindow.webContents.send('loadProfilePage');
})

ipcMain.on('load-guildpage',(sender,args) =>{
     
    console.log("load guild page in main process");
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

ipcMain.on( "storeUserDetails", ( event, userDetails ) => { //handly way I can set global vars for the users when logging in

    global.userDetails = userDetails;
    console.log(global.userDetails)
  } );

  ipcMain.on( "storeAuthToken", ( event, authToken ) => { //handly way I can set global vars for the users when logging in
    console.log(authToken)
    global.Token = authToken;
  } );

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

ipcMain.on('load-guildChatpage', (event,args,args2) => {
    console.log("load guild chat called in Main page args"); 
     MainWindow.webContents.send("load-guildChatpage",args,args2); 
})

ipcMain.on('load-guildEventPage', (event,args) => {
    console.log("load guild event called in Main page args"); 
     MainWindow.webContents.send("load-guildEventPage",args); 
});

ipcMain.on('load-eventCreate', (event, args) => {
    global.Gid = args; //fucking terrible idea,really bad
    console.log("event create" + " " +args)
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCalendar/AddEvent/AddEvent.html'),
        protocol: 'file',
        show:false,
        slashes: true
    }));

    ChildWindow.show();
});

